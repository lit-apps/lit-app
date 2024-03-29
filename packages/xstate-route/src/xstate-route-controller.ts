import { ReactiveController, ReactiveControllerHost } from 'lit';
import { RouterSlot, GLOBAL_ROUTER_EVENTS_TARGET, WillChangeStateEvent, matchRoutes, constructAbsolutePath, ChangeStateEvent, IRoute, IRouteMatch } from 'router-slot';
import type { AnyStateMachine, Actor, MachineSnapshot, StateNode, AnyMachineSnapshot } from 'xstate';

class RouteStateController implements ReactiveController {
  private unsubscribe!: (() => void) | undefined;
  private _preventHistoryChange: boolean = false;
  private _preventSetState: boolean = false;
  private _nextState: string = '';
  private _previousMatch: IRouteMatch | undefined | null;
  constructor(
    protected host: ReactiveControllerHost,
    protected actorState: Actor<AnyStateMachine>,
    protected routerSlot: RouterSlot
  ) {
    host.addController(this);
  }

  private subscribe() {

    // confirmNavigation will cancel the navigation if the machine cannot enter the state. 
    const confirmNavigation = (e: WillChangeStateEvent) => {
      if (this._preventSetState) {
        return true
      }
      console.group('Route Controller - ConfirmNavigation')

      const match = getMatchedRoute(this.routerSlot, e.detail.url!);
      console.log('match:', e.detail.url, match);
      // return early if the match is the same as the previous match to avoid unnecessary state changes
      if (!match || (match?.route &&
        this._previousMatch?.route === match?.route &&
        this._previousMatch?.fragments.consumed === match?.fragments.consumed &&
        JSON.stringify(match?.params) === JSON.stringify(this._previousMatch?.params)
      )) {
        console.info(' match is the same as previous match - not checking xstate', match)
        console.groupEnd();
        return true
      }
      this._previousMatch = match;
      const xstate = match?.route.data?.xstate;
      if (xstate) {
        try {
          // temporarily set the next state so that we know what to navigate to
          this._nextState = xstate;
          const sn = this.actorState.getSnapshot();
          const can = sn.matches(xstate) || sn.can({ type: `xstate.route.${xstate}` });
          console.groupEnd();
          if (can) {
            return true
          }
          e.preventDefault()
          return false
        } catch (error) {
          this._preventHistoryChange = false;
          console.error('Error while changing state', error);
          e.preventDefault()
          return
        }
      }
      console.groupEnd();
      return true
    }
    GLOBAL_ROUTER_EVENTS_TARGET.addEventListener('willchangestate', confirmNavigation);

    // when the route changes, try to sync existing context ids to the actor state
    // the convention is to add a `context.[key]` event that will assign the value 
    // of the route param to the actor state.
    const changeState = (e: ChangeStateEvent) => {
      console.group('Route Controller - changestate')
      console.log('detail:', e.detail);
      const match = this.routerSlot.match;

      this._preventHistoryChange = true;
      if (this._nextState) {
        // only send the next state if the actor is not already in that state
        if (!this.actorState.getSnapshot().matches(this._nextState)) {
          this.actorState.send({ type: `xstate.route.${this._nextState}` });
        }
        this._nextState = '';
      }
      if (match?.params) {
        for (const key in match.params) {
          const value = match.params[key];
          this.actorState.send({ type: `context.${key}`, params: { [key]: value } })
        }
      }
      this._preventHistoryChange = false;
      console.groupEnd();
    }
    this.routerSlot.addEventListener('changestate', changeState);

    const routeToPath = (snap: AnyMachineSnapshot) => {
      const routeConfig = snap._nodes.find((node: StateNode) => node.config?.route !== undefined)?.config?.route;
      if (routeConfig) {
        // find the route in the routerSlot build the path and navigate to it
        const route = this.routerSlot.routes
          .find(r => r.data?.xstate && snap.matches(r.data?.xstate))
        if (route) {
          console.log('routeToPath, route:', route)
          const path = constructAbsolutePath(this.routerSlot, route.path.replace(/:(\w+)/g, (match, paramName) => {
            const contextValue = snap.context[paramName];
            return contextValue !== undefined ? String(contextValue) : match;
          }));
          this._preventSetState = true;
          console.log('routeToPath, path:', path)
          window.history.pushState({}, '', path);
          this._preventSetState = false;
        }
      }
    }
    // subscribe to the actor state - set the route when route config is set
    const subscription = this.actorState.subscribe(snap => {
      if (this._preventHistoryChange) {
        return
      }
      console.group('Route Controller - subscribe')
      // get routeConfig from _node
      routeToPath(snap);
      console.groupEnd();
    })

    // TODO: decide whether  the route or the state should be the source of truth
    // in case of late binding: state

    // if actor state is active, it takes precedence over the route
    if (this.actorState.getSnapshot().status === 'active') {
      // get the route from the actor state
      routeToPath(this.actorState.getSnapshot());
    } else {

      // we still need to sync the state with the current route
      const match = getMatchedRoute(this.routerSlot);
      const xstate = match?.route.data?.xstate;
      if (xstate) {
        this._preventHistoryChange = true;
        this.actorState.send({ type: `xstate.route.${xstate}` });
        this._preventHistoryChange = false;
      }

      return () => {
        subscription.unsubscribe()
        this.routerSlot?.removeEventListener('changestate', changeState);
        GLOBAL_ROUTER_EVENTS_TARGET.removeEventListener('willchangestate', confirmNavigation);
      }
    }
  }

  hostConnected(): void {
    this.unsubscribe = this.subscribe()
  }
  hostDisconnected(): void {
    this.unsubscribe?.();
  }
}


function getMatchedRoute(routerSlot: RouterSlot, url?: string) {
  const parentPath = constructAbsolutePath(routerSlot);
  url ??= window.location.pathname;
  // get path fragments already consumed by parents
  const rest = url.replace(parentPath, '');
  return matchRoutes(routerSlot.routes, rest);
}



export { RouteStateController };
export default RouteStateController;