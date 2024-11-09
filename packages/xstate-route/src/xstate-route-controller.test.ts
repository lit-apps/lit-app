import { LitElement, PropertyValues, html } from "lit";
import { customElement, query } from 'lit/decorators.js';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { GLOBAL_ROUTER_EVENTS_TARGET, IRoute, IRoutingInfo, RouterSlot, basePath, isPathActive, queryString } from 'router-slot';

import ActorController from '@lit-app/actor';
import type { MachineParams } from '@lit-app/actor/src/types';
import { StateController } from '@lit-app/state';
import fixture, { fixtureCleanup } from '@lit-app/testing/fixture';
import { assertEvent, assign, setup } from 'xstate';
import { RouteStateController } from './xstate-route-controller';

export function addBaseTag(path: string = "/") {
  const $base = document.createElement("base");
  $base.href = `/`;
  document.head.appendChild($base);
  return $base;
}

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

afterEach(fixtureCleanup);

describe('RouteStateController', () => {

  const machine = setup({
    types: {} as {
      events: EventT
      context: ContextT
    },
    actions: {
      setID: assign({
        id: ({ event }) => {
          assertEvent(event, 'context.id');
          return event.params.id
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


  const stateActor = new ActorController(machine);


  @customElement('fsm-component')
  class FsmComponent extends LitElement {

    routeStateController!: RouteStateController;
    /**
     * StateController is a lit controller wrapping the machine
     * and adding reactive properties for rendering (lit renders on state change)
     */
    bindStateActor = new StateController(this, stateActor)

    @query('router-slot') router!: RouterSlot;

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

  }

  async function setupTest(
    template = html`<fsm-component></fsm-component>`
  ) {
    const element = await fixture<FsmComponent>(template);
    if (!element) {
      throw new Error('Could not query rendered <lapp-test-star>.');
    }

    const buttons = element.renderRoot.querySelectorAll('button') as NodeListOf<HTMLButtonElement>
    const links = element.renderRoot.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>

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
    addBaseTag()
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
    const {
      nextButton,
      setIDButton,
      element,

    } = await setupTest();

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
    const {
      element,
      linkOne,
      linkTwo123,
      linkTwo456
    } = await setupTest();


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

  it('should honour guarded routes', async () => {

    const {
      linkOne,
      linkTwo123,
      linkTwo456
    } = await setupTest();

    const url = '/123/two';
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


  })
});

