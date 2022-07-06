[![Netlify Status](https://api.netlify.com/api/v1/badges/def2b202-3a80-469d-9dbc-fc259cc1e712/deploy-status)](https://app.netlify.com/sites/vite-lit-starter/deploys)

# @lit-app/state

@lit-app/state is a global state management, integrating with [lit](lit.dev) web-components. 

```
CAUTION

THIS IS A VERY EARLY PREVIEW - NOT SUITABLE FOR PRODUCTION USE
```

## Why a new state-management tool ? 

There are plenty options available for state management, why a new one. 

- Some existing options are too heavy. Managing state should be lean and simple, in my opinion. Redux, for instance fall into this category.
- Some solutions designed for lit (for instance [lit-state](https://github.com/gitaarik/lit-state)) do not support Typescript and do not take advantages of lit@2 [Reactive Controlers](https://lit.dev/docs/composition/controllers/), very well suited for State Managements. 
- Some elegant ideas were worth pursuing (for instance [this tweet](https://twitter.com/passle_/status/1528318552947806212), or [this post](https://dev.to/pfrueh/the-dom-eventtarget-interface-6ak)).


## How to use it?

```ts
import { State, StateController, property } from "@lit-app/state";
import { LitElement } from "lit";

// declate a state
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


## Demo
To be done on lit-playground once a first preview version is released



