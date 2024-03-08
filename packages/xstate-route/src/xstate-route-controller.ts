import { ReactiveController, ReactiveControllerHost } from 'lit';
import { RouterSlot, GLOBAL_ROUTER_EVENTS_TARGET, WillChangeStateEvent, matchRoutes, constructAbsolutePath, ChangeStateEvent } from 'router-slot';
import type { AnyStateMachine, Actor } from 'xstate';


export class RouteStateController implements ReactiveController {
	private unsubscribe!: () => void | undefined;
	private _preventHistoryChange: boolean = false;
	private _preventSetState: boolean = false;
	private _nextState: string = '';
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

			const match = getMatchedRoute(this.routerSlot, e.detail.url!);
			if (import.meta.env.DEV) {
				console.log('Controller - ConfirmNavigation - match:', match);
			}
			const xstate = match?.route.data?.xstate;
			if (xstate) {
				try {
					// temporarily set the next state so that we know what to navigate to
					this._nextState = xstate;
					const sn = this.actorState.getSnapshot();
					const can = sn.can({ type: `xstate.route.${xstate}` });
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
			return true
		}
		GLOBAL_ROUTER_EVENTS_TARGET.addEventListener('willchangestate', confirmNavigation);

		// when the route changes, try to sync existing context ids to the actor state
		// the convention is to add a `context.[key]` event that will assign the value 
		// of the route param to the actor state.
		const changeState = (e: ChangeStateEvent) => {
			if (import.meta.env.DEV) {
				console.log('Controller - changestate - detail:', e.detail);
				console.log('Controller - changestate - path name:', window.location.pathname);
			}
			const match = this.routerSlot.match;

			this._preventHistoryChange = true;
			if (this._nextState) {
				this.actorState.send({ type: `xstate.route.${this._nextState}` });
				this._nextState = '';
			}
			if (match?.params) {
				for (const key in match.params) {
					const value = match.params[key];
					this.actorState.send({ type: `context.${key}`, params: { [key]: value } })
				}
			}
			this._preventHistoryChange = false;
		}
		this.routerSlot.addEventListener('changestate', changeState);

		// subscribe to the actor state - set the route when route config is set
		const subscription = this.actorState.subscribe((snap) => {
			if (this._preventHistoryChange) {
				return
			}
			// grab the last node config
			const nodeConfig = snap._nodes[snap._nodes.length - 1]
			if (nodeConfig?.config?.route) {
				// find the route in the routerSlot build the path and navigate to it
				const route = this.routerSlot.routes.find(r => snap.matches(r.data.xstate))
				if (route) {
					if (import.meta.env.DEV) {
						console.log('Controller - subscribe - route:', route)
					}
					const path = constructAbsolutePath(this.routerSlot, route.path.replace(/:(\w+)/g, (match, paramName) => {
						const contextValue = snap.context[paramName];
						return contextValue !== undefined ? String(contextValue) : match;
					}));
					this._preventSetState = true;
					console.log('Controller - subscribe - path:', path)
					window.history.pushState({}, '', path);
					this._preventSetState = false;
				}
			}
		})

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
