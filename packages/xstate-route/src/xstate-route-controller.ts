import {
  ReactiveController,
  ReactiveControllerHost
} from 'lit';
import {
  RouterSlot,
  GLOBAL_ROUTER_EVENTS_TARGET,
  WillChangeStateEvent,
  matchRoutes,
  constructAbsolutePath,
  ChangeStateEvent,
  IRouteMatch,
  IRouterSlot
} from 'router-slot';
import type {
  AnyStateMachine,
  Actor,
  StateNode,
  AnyMachineSnapshot  
} from 'xstate';

import type { XstateDataT } from './types';
export { XstateDataT };

/**
 * RouteStateController is a reactive controller that manages the state of a route in an XState-based application.
 * It listens for route changes and updates the corresponding XState actor state accordingly.
 * 
 * TODO: unsubscribe from events when the actor reaches a final state
 */
class RouteStateController implements ReactiveController {
  private unsubscribe!: (() => void) | undefined;
  private _preventHistoryChange: boolean = false;
  private _preventSetState: boolean = false;
  private _nextState: string = '';
  private _previousMatch: IRouteMatch | undefined | null;

  /**
   * Constructs a new XStateRouteController.
   * 
   * @param host - The ReactiveControllerHost instance.
   * @param actor - The Actor instance representing the state machine.
   * @param routerSlot - The RouterSlot instance for managing navigation.
   * @param allowNavigationWhenFinal - Optional. Specifies whether navigation is allowed when the state machine is in a final state. Defaults to true.
   */
  constructor(
    protected host: ReactiveControllerHost,
    protected actor: Actor<AnyStateMachine>,
    protected routerSlot: IRouterSlot,
    protected allowNavigationWhenFinal: boolean = true
  ) {
    host.addController(this);
  }

  private subscribe() {

    // confirmNavigation will cancel the navigation if the machine cannot enter the state. 
    const confirmNavigation = (e: WillChangeStateEvent) => {

      // if (this._preventSetState || !this.routerSlot.isConnected) {
      if (this._preventSetState) {
        return true
      }
      if (!this.routerSlot?.isConnected) {
        return false
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
      
      const xstate = match?.route.data?.xstate;
      if (xstate) {
        try {
          const sn = this.actor.getSnapshot();
          // allow navigation when the actor is in a final state
          if (sn.status !== 'active' && !this.allowNavigationWhenFinal) {
            this._nextState = '';
            return false
          }
          // temporarily set the next state so that we know what to navigate to
          this._nextState = xstate;
          const actorId = this.actor.logic.id;
          const can = sn.matches(xstate) || sn.can({ type: `xstate.route.${actorId}.${xstate}` });
          console.groupEnd();
          if (can) {
            this._previousMatch = match;
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
      this._previousMatch = match;
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
        if (!this.actor.getSnapshot().matches(this._nextState)) {
          const actorId = this.actor.logic.id;
          this.actor.send({ type: `xstate.route.${actorId}.${this._nextState}` });
        }
        this._nextState = '';
      }
      if (match?.params) {
        for (const key in match.params) {
          const value = match.params[key];
          this.actor.send({ type: `context.${key}`, params: { [key]: value } })
        }
      }
      this._preventHistoryChange = false;
      console.groupEnd();
    }
    this.routerSlot.addEventListener('changestate', changeState);

    const actorToURL = (snap: AnyMachineSnapshot) => {
      const routeConfig = snap._nodes
        .find((node: StateNode) => node.config?.route !== undefined)
        ?.config?.route;
      if (routeConfig) {
        // find the route in the routerSlot build the path and navigate to it
        const route = this.routerSlot.routes
          .find(r => r.data?.xstate && snap.matches(r.data?.xstate))
        if (route) {
          console.log('actorToURL, route:', route)
          const path = constructAbsolutePath(
            this.routerSlot, 
            route.path.replace(/:(\w+)/g, (match, paramName) => {
              const contextValue = snap.context[paramName];
              return contextValue !== undefined ? String(contextValue) : match;
            })
          );
          this._preventSetState = true;
          console.log('actorToURL, path:', path)
          if (window.location.pathname !== path || this.routerSlot.match === null) {
            // we need to wait for the next frame to make sure URL has had time to update
            // otherwise matchRoutes will not work correctly
            requestAnimationFrame(() => {
              window.history.pushState({}, '', path);
            });
          }
          this._preventSetState = false;
        }
      }
    }
    // subscribe to the actor state - set the route when route config is set
    const subscription = this.actor.subscribe(snap => {
      if (this._preventHistoryChange) {
        return
      }
      console.group('Route Controller - subscribe')
      // get routeConfig from _node
      actorToURL(snap);
      console.groupEnd();
    })

    // if actor state is active, it takes precedence over the route
    // unless the current state is marked with meta.ignoreOnSubscribe = true
    // this is the case for exceptions, where we want the machine to possibly start again
    // on browser refresh
    const snap = this.actor.getSnapshot();
    const routeConfig = snap._nodes?.find((node: StateNode) => node.config?.route !== undefined)?.config?.route;
    if (snap.status === 'active' && !routeConfig?.meta?.ignoreOnSubscribe) {
      // get the route from the actor state
      actorToURL(snap);
    } else {

      // we still need to sync the state with the current route
      const match = getMatchedRoute(this.routerSlot);
      const xstate = match?.route.data?.xstate;
      if (xstate) {
        this._preventHistoryChange = true;
        const actorId = this.actor.logic.id;
        this.actor.send({ type: `xstate.route.${actorId}.${xstate}` });
        this._preventHistoryChange = false;
      }
    }

    return () => {
      subscription.unsubscribe()
      this.routerSlot?.removeEventListener('changestate', changeState);
      GLOBAL_ROUTER_EVENTS_TARGET.removeEventListener('willchangestate', confirmNavigation);
    }
  }

  hostConnected(): void {
    this.unsubscribe = this.subscribe()
  }
  hostDisconnected(): void {
    this.unsubscribe?.();
  }
}


function getMatchedRoute(routerSlot: IRouterSlot, url?: string) {
  const parentPath = constructAbsolutePath(routerSlot);
  url ??= window.location.pathname;
  // get path fragments already consumed by parents
  const rest = url.replace(parentPath, '');
  return matchRoutes(routerSlot.routes, rest);
}



export { RouteStateController };
export default RouteStateController;