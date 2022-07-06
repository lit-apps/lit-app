import { ReactiveController, ReactiveControllerHost } from 'lit';
import { State } from './state'
import {LitStateEvent} from './state-event'
/**
 * A reactive-controller holding a state
 */

type callback = () => void

export class StateController<T extends State>
	implements ReactiveController {

	callback: () => void
	
	constructor(
		protected host: ReactiveControllerHost,
		private state: T,
		cb?: callback,
	) {
		this.host.addController(this);
		this.callback = cb ? cb : () => this.host.requestUpdate()
	}

	hostConnected(): void {
		this.state.addEventListener(LitStateEvent.eventName, this.callback);
		this.callback();

	}
	hostDisconnected(): void {
		this.state.removeEventListener(LitStateEvent.eventName, this.callback);
	}
}