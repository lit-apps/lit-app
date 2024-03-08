import { LitElement, PropertyValues } from "lit";
import { RouterSlot } from 'router-slot';
import { RouteStateController } from '../../../../src/xstate-route-controller';
import ActorController from '@lit-app/actor';
import { StateController } from '@lit-app/state';
type ContextT = {
    name: string;
    id: string;
};
/**
 *
 */
export default class FsmComponent extends LitElement {
    routeStateController: RouteStateController;
    bindStateActor: StateController<ActorController<ContextT, {
        readonly type: "context.id";
        readonly params: {
            readonly id: string;
        };
    } | {
        readonly type: "NEXT";
    }>>;
    router: RouterSlot;
    static styles: import("lit").CSSResult[];
    firstUpdated(props: PropertyValues): void;
    render(): import("lit").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'fsm-component': FsmComponent;
    }
}
export {};
//# sourceMappingURL=fsm.d.ts.map