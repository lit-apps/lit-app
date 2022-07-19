# @lit-app/state Documentation

## Creating State

A `State` is defined by specifing its `@properties`. When state properties changes, the state emits a `StateEvent` which can be listened to.

**Example**
```ts
import { State, property } from "@lit-app/state";

class MyState extends State {
  @property({value: 'Bob'}) name  
}
const myState = new MyState()
```

### Property Options
Declaring a property is similar to the way properties are declared for `litElements` with decorators. 

`value`

The value to initiate the property with. When `@property` is used in conjunction with other decorators (like `@query` or `@storage`) initial value must be declared this way (and not by setting a value like `@property() name = 'Bob' `)

`hasChanged`

 A function that indicates if a property should be considered changed when it is set. The function should take the `newValue` and `oldValue` and return `true` if an update should be requested.

`type`

The type of the property. Used to Stringify/parse depending on wich other decorators are in use. For instance, `@storage` strignify before storing to localStorage. 

`skipReset`

`State.reset()` resets all property values to their initial {value: value} value. This is not the wanted behavior in some cases. For instance, we can have a state property for language, with an initial value (english). The state will be reset on user sign-out, but we want to keep the actual state value for language, if the user has modified it. 


### State API

`reset()`

Reset the state to its original values, skipping properties marked as skipReset

`subscribe(callback: (event: StateEvent) => void, nameOrNames: string | string[]): Unsubscribe`

Subscribe to a state change event. The callback will be called anytime a state property change if `nameOrNames` is undefined, or only for matching  property values specified by `nameOrNames`. It returns an `unsubscibe` function to call for endind the subscription.

**Example**
```js
const unsubscribe = state.subscribe((event: StateEvent) => {}, ['name'])
```


## Binding a State to a component

The binding between a state and a component is done via a `StateController`. 

**Example**
```ts
import { StateController } from "@lit-app/state";
import { LitElement } from "lit";
import myState from './state'

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
```

By default the `StateController` will call a `requestUpdate` on the bound component. It is possible to assign user-defined callback functions.

**Example**
```ts

// declare a component
class StateEl extends LitElement {

  // StateController is a Reactive Controller binding myState with the element
  state = new StateController(this, myState, () => {console.info('a state event was emitted')})
 
}
```

## Decorators

Decorators augment the capacity of state properties. They can only be used in Typescript environment (whereas state properties can also be declared as javascript static properties on the State).

The `@property` decorator must be set last when used together with other decorators.

### @storage
Bind a state property with localStorage, so that its value can persist. 

#### Storage Options

`key`

The key to use for localStorage. Will take the name of the property if not set.

`prefix` 

A prefix to use for the the key (`_ls` if not set). An usual practice would be to override @storage and provide a default prefix for all `@storage` state values.

**Example**

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

#### Query Options

`parameter`

The parameter to use on the URL. If not set, will use the name of the property. 

When used, `@query` must be set as the first decorator.

**Example**

The example below would set state.name to `Alice` when accessed via an URL with `?name-parameter=Alice`

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
Hook decorator allows to configure state properties for the use of other third parties. This is usefull when used with persistence layers. 

A user-defined hook extend the `Hook` class and must implement `fromState` method, which is called when the state change. Depending on the requirements, it shall also implement the `reset` method.

See [hook-firebase](./test/hook-firebase.ts) and [hook.test](./test/hook.test.ts) for a real example.

**Example**

```ts
import { State, property, hook } from "@lit-app/state";

class MyState extends State {
  @hook('firebase', {path: 'a/path/to/be/consumed'})
  @property({value: 'Bob'}) name  
}
const myState = new MyState()

```



