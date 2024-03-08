import { ReactiveController, ReactiveControllerHost } from 'lit';
import { RouterSlot } from 'router-slot';
import type { AnyStateMachine, Actor } from 'xstate';
export declare class RouteStateController implements ReactiveController {
    protected host: ReactiveControllerHost;
    protected actorState: Actor<AnyStateMachine>;
    protected routerSlot: RouterSlot;
    private unsubscribe;
    private _preventHistoryChange;
    private _preventSetState;
    private _nextState;
    constructor(host: ReactiveControllerHost, actorState: Actor<AnyStateMachine>, routerSlot: RouterSlot);
    private subscribe;
    hostConnected(): void;
    hostDisconnected(): void;
}
//# sourceMappingURL=xstate-route-controller.d.ts.map