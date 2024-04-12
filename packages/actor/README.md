# Actor

Actor is a lit state controller holding an xstate actor.

We use extend State to be able to use state reactive controllers and simplify the reuse of the same actor across different components.


## Example

```js
const actor = new Actor(workflow)
 
export default class fsmTest extends LitElement {
  bindActor = new StateController(this, actor) // bind actor state to fsmTest element, so it will re-render when actor snapshot changes
  
  override render() {
   const send = () => actor.send({ 
    type: 'NewPatientEvent', name: 'John', condition: 'healthy' })
   
   return html`
    <div>
     <div>machineId: ${actor.machineId}</div>
     <div>status: ${actor.status}</div>
     <div>value: ${JSON.stringify(actor.value)}</div>
    </div>
    <md-filled-button @click=${send}>NewPatientEvent</md-filled-button>
   `;
  }
}
```
