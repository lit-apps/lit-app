var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from "lit";
import { customElement, query } from 'lit/decorators.js';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { GLOBAL_ROUTER_EVENTS_TARGET, basePath, isPathActive, queryString } from 'router-slot';
import ActorController from '@lit-app/actor';
import { StateController } from '@lit-app/state';
import fixture, { fixtureCleanup } from '@lit-app/testing/fixture';
import { assertEvent, assign, setup } from 'xstate';
import { RouteStateController } from './xstate-route-controller';
export function addBaseTag(path = "/") {
    const $base = document.createElement("base");
    $base.href = `/`;
    document.head.appendChild($base);
    return $base;
}
afterEach(fixtureCleanup);
describe('RouteStateController', () => {
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
            id: '1'
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
    const stateActor = new ActorController(machine);
    let FsmComponent = class FsmComponent extends LitElement {
        constructor() {
            super(...arguments);
            /**
             * StateController is a lit controller wrapping the machine
             * and adding reactive properties for rendering (lit renders on state change)
             */
            this.bindStateActor = new StateController(this, stateActor);
        }
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
				<a ?disabled=${!isOneActive} href="${location.origin}/one${queryString()}" ?data-active="${isPathActive(`${basePath()}one`)}">Page One (${isOneActive ? 'o.k.' : 'inactive'})</a>
				<a href="${location.origin}/123/two${queryString()}" ?data-active="${isPathActive(`${basePath()}123/two`)}">Page Two (id:123)</a>
				<a href="${location.origin}/456/two${queryString()}" ?data-active="${isPathActive(`${basePath()}456/two`)}">Page Two (id:456)</a>
			</div>
			<h4>Pages activated by router-slot (Outlet)</h4>
			<router-slot></router-slot>
			<h4>Machine Context State (Value and context.id)</h4>
			<div>
				<div>Current State Value: ${stateActor.snapshot.value}</div>
				<div>Current Context ID: ${stateActor.context.id}</div>
				<button @click="${() => stateActor.send({ type: 'NEXT' })}">Next State</button>
				<button @click="${() => stateActor.send({ type: 'context.id', params: { id: '111' } })}">Set Context ID</button>
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
    async function setupTest(template = html `<fsm-component></fsm-component>`) {
        const element = await fixture(template);
        if (!element) {
            throw new Error('Could not query rendered <lapp-test-star>.');
        }
        const buttons = element.renderRoot.querySelectorAll('button');
        const links = element.renderRoot.querySelectorAll('a');
        return {
            element,
            nextButton: buttons[0],
            setIDButton: buttons[1],
            linkOne: links[2],
            linkTwo123: links[3],
            linkTwo456: links[4],
        };
    }
    beforeEach(async () => {
        addBaseTag();
    });
    afterEach(fixtureCleanup);
    it('initializes the component', async () => {
        const { element } = await setupTest();
        expect(element).toBeInstanceOf(FsmComponent);
        expect(stateActor.value).toEqual('one');
    });
    it('initializes stateActor', async () => {
        expect(stateActor.value).toEqual('one');
    });
    it('sets window location ', async () => {
        await setupTest();
        const url = '/one';
        console.log('path Name', window.location.pathname);
        expect(window.location.pathname).toMatch(url);
    });
    it('keep state and URL in sync (state -> URL)', async () => {
        const { nextButton, setIDButton, element, } = await setupTest();
        let url = '/1/two';
        nextButton.click();
        await element.updateComplete;
        expect(window.location.pathname).toMatch(url);
        expect(stateActor.value).toEqual('two');
        expect(stateActor.context.id).toEqual('1');
        url = '/111/two';
        setIDButton.click();
        await element.updateComplete;
        expect(window.location.pathname).toMatch(url);
        expect(stateActor.value).toEqual('two');
        expect(stateActor.context.id).toEqual('111');
        url = '/one';
        nextButton.click();
        await element.updateComplete;
        expect(window.location.pathname).toMatch(url);
        expect(stateActor.value).toEqual('one');
        expect(stateActor.context.id).toEqual('111');
    });
    it('keep state and URL in sync (URL -> state)', async () => {
        const { element, linkOne, linkTwo123, linkTwo456 } = await setupTest();
        let url = '/123/two';
        linkTwo123.click();
        await new Promise((resolve) => setTimeout(resolve, 30));
        expect(window.location.pathname).toMatch(url);
        expect(stateActor.value).toEqual('two');
        expect(stateActor.context.id).toEqual('123');
        url = '/456/two';
        linkTwo456.click();
        await new Promise((resolve) => setTimeout(resolve, 30));
        expect(window.location.pathname).toMatch(url);
        expect(stateActor.value).toEqual('two');
        expect(stateActor.context.id).toEqual('456');
        url = '/one';
        linkOne.click();
        await element.updateComplete;
        await new Promise((resolve) => setTimeout(resolve, 30));
        expect(window.location.pathname).toMatch(url);
        expect(stateActor.value).toEqual('one');
        expect(stateActor.context.id).toEqual('456');
    });
    it('should honor guarded routes', async () => {
        const { linkOne, linkTwo123, linkTwo456 } = await setupTest();
        let url = '/123/two';
        linkTwo123.click();
        await new Promise((resolve) => setTimeout(resolve, 30));
        expect(window.location.pathname).toMatch(url);
        expect(stateActor.value).toEqual('two');
        expect(stateActor.context.id).toEqual('123');
        linkOne.click();
        await new Promise((resolve) => setTimeout(resolve, 30));
        expect(window.location.pathname).toMatch(url);
        expect(stateActor.value).toEqual('two');
        expect(stateActor.context.id).toEqual('123');
        linkTwo456.click();
        await new Promise((resolve) => setTimeout(resolve, 30));
        linkOne.click();
        await new Promise((resolve) => setTimeout(resolve, 30));
        expect(window.location.pathname).toMatch('/one');
        expect(stateActor.value).toEqual('one');
        expect(stateActor.context.id).toEqual('456');
    });
});
//# sourceMappingURL=xstate-route-controller.test.js.map