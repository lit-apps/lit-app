import { html, css, LitElement, PropertyValues } from "lit";
import { customElement, property, query, state } from 'lit/decorators.js';
import { RouterSlot, IRoutingInfo, IRoute, queryString, basePath, isPathActive, GLOBAL_ROUTER_EVENTS_TARGET } from 'router-slot';
import { RouteStateController } from '../../../../src/xstate-route-controller';
import ActorController from '@lit-app/actor'
import { ContextFrom, assertEvent, assign, createActor, fromPromise, setup } from 'xstate';
import { sharedStyles } from '../../styles';
import { StateController } from '@lit-app/state';
import type { MachineParams } from '@lit-app/actor/src/types';

type EventT = MachineParams<{
  'context.id': { readonly id: string }
  'NEXT': {}
}>;

type ContextT = {
  name: string;
  id: string;
};

type RouteMetaDataT = {
  title?: string;
  xstate?: string; // a path to xstate machine
};

const machine = setup({
  types: {} as {
    events: EventT
    context: ContextT
  },
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

const Routes: IRoute<RouteMetaDataT>[] = [
  {
    path: "one",
    data: {
      title: "Page one",
      xstate: "one"
    },
    component: () => html`
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
    component: (info?: IRoutingInfo) => html`
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

@customElement('fsm-component')
export default class FsmComponent extends LitElement {

  routeStateController!: RouteStateController;
  bindStateActor = new StateController(this, stateActor)

  @query('router-slot') router!: RouterSlot;

  static override styles = [
    sharedStyles
  ];


  override firstUpdated(props: PropertyValues) {

    super.firstUpdated(props);

    this.router.add(Routes, true);
    stateActor.start();
    this.routeStateController = new RouteStateController(this, stateActor.actor, this.router);

    // this is needed for making links work
    GLOBAL_ROUTER_EVENTS_TARGET.addEventListener("changestate", () => {
      this.requestUpdate();
    })
  }

  override render() {
    const isOneActive = stateActor.snapshot.can({ type: 'xstate.route.fsm.one' });
    return html`
			<h2>xstate-route Controller component</h2>
			<p>This component demonstrates how to use xstate-route-controller. The Controller binds <a href="https://github.com/statelyai/xstate" target="_blank">xstate  machine actors</a> with <a href="https://github.com/andreasbm/router-slot" target="_blank">router-slot router</a></p>
			<p>You can have a look at <a target="_blank" href="https://github.com/lit-apps/lit-app/tree/dev/packages/xstate-route">this @lit-apps/repo if you want to know more about the implementation.</a></p>
      <p>The source for this page is in <a target="_blank" href="https://github.com/lit-apps/lit-app/blob/dev/packages/xstate-route/demo/pages/home/fsm/fsm.ts">packages/xstate-route/demo/pages/home/fsm/fsm.ts</a></p>
			<h3>Navigation:</h3>
			<p>Click on the links below to navigate to different pages. Activating links will match the state machine with the current route.</p>
			<div>
				<a ?disabled=${!isOneActive} href="${location.origin}/home/fsm/one${queryString()}" ?data-active="${isPathActive(`${basePath()}home/fsm/one`)}">Page One (${isOneActive ? 'o.k.' : 'inactive - guarded in route'})</a>
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

}

declare global {
  interface HTMLElementTagNameMap {
    'fsm-component': FsmComponent;
  }
}
