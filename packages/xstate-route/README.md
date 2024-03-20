# `xstate-route`

`state-route` is a package that binds [xstate state machine](https://stately.ai/docs/machines) with [`router-slot` router](https://github.com/andreasbm/router-slot).

The main idea is to keep in sync window location with the current state of the machine actor:

- when the actor enters a state that has a `route` property, the window location is updated to url matching the `route` property.
- when the window location changes, the machine is updated accordingly (enters the relevant state).
- if and when the route has parameters, the machine context is updated with the parameters.

The current implementation depends on this [routable states PR](https://github.com/statelyai/xstate/pull/4184), not yet merged.

An example of this approach can be tested on: <https://xstate-route.web.app/home/fsm/one>.

## Usage

### Controller

The `xstate-route` package exports a `Controller` class that can be used to bind a state machine with a router.

The controller listen Window `willchangestate` events ([see `router-slot` documentation](https://github.com/andreasbm/router-slot?tab=readme-ov-file#stop-the-user-from-navigating-away)). When a route is matched and contains an `xstate` data key, the controller will assess whether the state machine can transition to this bound route. If it can, the navigation is allowed; if it cannot, the navigation is prevented. This allows to define guards on the state machine that will prevent navigation to certain routes.

The controller listen to `router-slot` `changestate` events - called whenever a successful navigation occurs. When a route is matched and contains an `xstate` data key, the controller will try to transition the state machine to the state that is bound to the route. The controller will also update the state machine context with the route parameters.

Finally, the controller listens to the state machine transitions. When a state with a `route` property is entered, the controller will update the window location to the value of the `route` property.

```ts
import { Controller } from '@lit-app/xstate-route';

export default class RouterElement  extends LitElement {

 @query('router-slot') router!: RouterSlot;

 override firstUpdated(props: PropertyValues) {
  super.firstUpdated(props);

  // add routes to the router
  this.router.add(Routes, true);

  // bind a state machine actor with the router
  this.routeStateController = new Controller(this, actor, this.router);
 }

 override render() {
  return html`
   <router-slot></router-slot>
  `;
 }
}

```

### Routes

Bound routes have to be configured with an `xstate` data key. When such a route is matched on navigation, the controller will try To The state machine accordingly.

For example:

```ts
import { html } from "lit";
import { IRoutingInfo, IRoute } from 'router-slot';

type RouteDataT = {
 title?: string;
 xstate?: string; // a path to xstate machine
};

const Routes: IRoute<RouteDataT>[] = [
 {
  path: "one",
  data: {
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

```

### State machine

The state machine has to be configured with a `route` property in the states that are bound to the routes.

```ts

const machine = setup({
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

```
