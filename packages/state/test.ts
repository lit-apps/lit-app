import { html, css, LitElement } from "lit";
import { customElement, state } from 'lit/decorators.js';
import { State} from "./src/state";
import { storage } from "./src/decorators/local-storage";
import { property } from "./src/decorators/property";
import { StateController } from "./src/state-controller";
// import {bindState} from './src/decorators/bind-state'
class YourState extends State {
  @property({type: String}) a = 'a'  
  @property({value: 'b'}) b: string
  @property({value: 'b'}) c
}

class MyState extends State {
	// static properties = {
	//   a: {},
	//   b: { type: Array }
	// }

	@storage()
	@property({value: 'a'}) a 

	@storage()
	@property({value: ['a', 'b'], type: Array}) b
	// @property({type: Array, value: '1234'}) b
	// constructor() {
	//   super()
	//   this.a = 'abc'
	//   this.b = [1, 2]
	// }
}
// class MyState3 extends MyState {
// 	@property() a = '333'
// 	@property() c = 'hello'
// 	// @property() b = 'hello'

// 	get test()  {
// 		return this.a + this.c
// 	}
	
// }
const myState1 = new MyState()
// const myState2 = new MyState()
// const myState3 = new MyState3()
window.myState1 = myState1
// window.myState2 = myState2
// window.myState3 = myState3

class StateEl extends LitElement {
	// @bindState( myState1)
	state1 = new StateController(this, myState1)
	// state3 = new StateController(this, myState3)
	render() {
		return html`
		<div>${myState1.a}</div>
		`;
	}
}
customElements.define('state-el', StateEl);