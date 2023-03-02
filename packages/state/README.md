# @lit-app/state

@lit-app/state is a global state management, integrating with [lit](https://lit.dev) web-components. 

## Why a new state-management tool ? 

There are plenty options available for state management, so why yet another one? 

- Some existing options are too heavy. In my opinion, managing state should be lean and simple. Redux, for instance falls into this category.
- Some solutions designed for lit (for instance [lit-state](https://github.com/gitaarik/lit-state)) do not support Typescript and do not take advantage of lit@2 [Reactive Controlers](https://lit.dev/docs/composition/controllers/), very well suited for hooking external features into templating lifecyce. 
- Some elegant ideas were worth pursuing (for instance [this tweet](https://twitter.com/passle_/status/1528318552947806212), or [this post](https://dev.to/pfrueh/the-dom-eventtarget-interface-6ak)).


## How to use it?

```ts
import { State, StateController, property } from "@lit-app/state";
import { LitElement } from "lit";

// declare some state
class MyState extends State {
  @property({value: 'Bob'}) name  
}
const myState = new MyState()

// declare a component
class StateEl extends LitElement {

  // StateController is a Reactive Controller binding myState with the element
  state = new StateController(this, myState)
  override render() {
    return html`
      <div>This will be updated when the state changes: ${myState.name}</div>
    `;
  }
}

// changing the state will reflect in the template
myState.name = 'Alice'
```
[Very simple demo on lit.dev playground.](https://lit.dev/playground/#gist=6b45c964c5632f153d046da7ffc9421c)

[Another demo, more advanced.](https://lit.dev/playground/?linkId=8223273#gist=184c2d7a658d2fb1ff95aeddf8b09ba0)



## How does it work?
`State` extends [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) and dispatches a `StateEvent` when one of its properties changes. 

`StateController` listens for a `StateEvent` emited by a bound state. By default, it calls a requestUpdate on the lit element; the callback function is configurable. 

## Decorators

Decorators augment the capacity of state properties: 

### @storage
Bind a state property with localStorage, so that its value can persist. 

```ts
import { State, property, storage } from "@lit-app/state";

class MyState extends State {
  @storage({key: 'localstorage_key'})
  @property({value: 'Bob'}) name  
}
const myState = new MyState()

```
[Demo with @storage](https://lit.dev/playground/#gist=8c1b5273fd8449d4c89dd66c9c1e6539)

### @query
Init a state property value with an URL parameter, and also persist it 
to localStorage. 

```ts
import { State, property, storage } from "@lit-app/state";

class MyState extends State {
  @query({parameter: 'name-parameter'})
  @storage({key: 'localstorage_key'})
  @property({value: 'Bob'}) name  
}
const myState = new MyState()

```


### @hook
Hook decorator allows to configure state properties for the use of other third parties

```ts
import { State, property, hook } from "@lit-app/state";

class MyState extends State {
  @hook('firebase', {path: 'a/path/to/be/consumed'})
  @property({value: 'Bob'}) name  
}
const myState = new MyState()

```


## API

[Documentation and API](https://github.com/lit-apps/lit-app/blob/main/packages/state/Documentation.md)

## Installation

```
> pnpm add @lit-app/state
```

or 
```
> npm install @lit-app/state
```








