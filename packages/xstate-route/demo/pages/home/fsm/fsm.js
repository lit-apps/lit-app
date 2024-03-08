var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, LitElement } from "lit";
import { customElement, query } from 'lit/decorators.js';
import { queryString, basePath, isPathActive, GLOBAL_ROUTER_EVENTS_TARGET } from 'router-slot';
import { RouteStateController } from '../../../../src/xstate-route-controller';
import ActorController from '@lit-app/actor';
import { assertEvent, assign, setup } from 'xstate';
import { sharedStyles } from '../../styles';
import { StateController } from '@lit-app/state';
const machine = setup({
    types: {},
    actions: {
        setID: assign({
            id: ({ event }) => {
                assertEvent(event, 'context.id');
                return event.params.id;
            },
        })
    },
    guards: {
        preventOne: ({ context }) => {
            return (Number(context.id) * 1) > 123;
        }
    }
}).createMachine({
    id: 'fsm',
    initial: 'one',
    context: {
        name: 'fsm',
        id: '0'
    },
    on: {
        'context.id': {
            actions: 'setID',
        },
    },
    states: {
        one: {
            on: {
                NEXT: 'two'
            },
            route: {
                guard: 'preventOne',
            }
        },
        two: {
            on: {
                NEXT: 'one'
            },
            route: {}
        }
    }
});
const Routes = [
    {
        path: "one",
        data: {
            title: "Page one",
            xstate: "one"
        },
        component: () => html `
			<h3>Page one</h3>
			<p>Page one content</p>
		`
    },
    {
        path: ":id/two",
        data: {
            title: "Page two",
            xstate: "two"
        },
        component: (info) => html `
			<h3>Page 2</h3>
			<p>Page two content - ${info?.match.params.id}</p>
		`
    },
    {
        path: "**",
        redirectTo: "one"
    }
];
/**
 * ActorController is a lit controller wrapping the machine
 * and adding reactive properties for rendering (lit renders on state change)
 */
const stateActor = new ActorController(machine);
/**
 *
 */
let FsmComponent = class FsmComponent extends LitElement {
    constructor() {
        super(...arguments);
        this.bindStateActor = new StateController(this, stateActor);
    }
    static { this.styles = [
        sharedStyles
    ]; }
    firstUpdated(props) {
        super.firstUpdated(props);
        this.router.add(Routes, true);
        stateActor.start();
        this.routeStateController = new RouteStateController(this, stateActor.actor, this.router);
        // this is needed for making links work
        GLOBAL_ROUTER_EVENTS_TARGET.addEventListener("changestate", () => {
            this.requestUpdate();
        });
    }
    render() {
        const isOneActive = stateActor.snapshot.can({ type: 'xstate.route.one' });
        return html `
			<h2>xstate-route Controller component</h2>
			<p>This component demonstrates how to use xstate-route-controller. The Controller binds <a href="https://github.com/statelyai/xstate" target="_blank">xstate  machine actors</a> with <a href="https://github.com/andreasbm/router-slot" target="_blank">router-slot router</a></p>
			<h3>Navigation:</h3>
			<p>Click on the links below to navigate to different pages. Activating links will match the state machine with the current route.</p>
			<div>
				<a ?disabled=${!isOneActive} href="${location.origin}/home/fsm/one${queryString()}" ?data-active="${isPathActive(`${basePath()}home/fsm/one`)}">Page One (${isOneActive ? 'o.k.' : 'inactive'})</a>
				<a href="${location.origin}/home/fsm/123/two${queryString()}" ?data-active="${isPathActive(`${basePath()}home/fsm/123/two`)}">Page Two (id:123)</a>
				<a href="${location.origin}/home/fsm/456/two${queryString()}" ?data-active="${isPathActive(`${basePath()}home/fsm/456/two`)}">Page Two (id:456)</a>
			</div>
			<h4>Pages activated by router-slot (Outlet)</h4>
			<router-slot></router-slot>
			<h4>Machine Context State (Value and context.id)</h4>
			<div>
				<div>Current State Value: ${stateActor.snapshot.value}</div>
				<div>Current Context ID: ${stateActor.context.id}</div>
				<button @click="${() => stateActor.send({ type: 'NEXT' })}">Next State</button>
				<button @click="${() => stateActor.send({ type: 'context.id', params: { id: 111 } })}">Set Context ID</button>
			</div>
		`;
    }
};
__decorate([
    query('router-slot')
], FsmComponent.prototype, "router", void 0);
FsmComponent = __decorate([
    customElement('fsm-component')
], FsmComponent);
export default FsmComponent;
//# sourceMappingURL=fsm.js.map