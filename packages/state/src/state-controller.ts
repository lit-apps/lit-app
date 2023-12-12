import { ReactiveController, ReactiveControllerHost } from 'lit';
import { State } from './state.js'
import {StateEvent} from './state-event.js'
/**
 * A reactive-controller holding a state
 */

type callback = () => void | EventListener

export class StateController<T extends State>
	implements ReactiveController {

	callback: callback
	
	constructor(
		protected host: ReactiveControllerHost,
		private state: T,
		cb?: callback,
	) {
		this.callback = cb ? cb : () => this.host.requestUpdate()
		this.host.addController(this);
	}

	hostConnected(): void {
		this.state.addEventListener(StateEvent.eventName, this.callback);
		this.callback();

	}
	hostDisconnected(): void {
		this.state.removeEventListener(StateEvent.eventName, this.callback);
	}
}