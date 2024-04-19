import { ReactiveController, ReactiveControllerHost } from 'lit';
import { State } from './state.js'
import { StateEvent } from './state-event.js'
/**
 * A reactive-controller holding a state
 */
type callback = () => void | EventListener | Promise<void>

export class StateController<T extends State>
	implements ReactiveController {

	callback: callback

	constructor(
		protected host: ReactiveControllerHost,
		public state: T,
		cb?: callback,
	) {
		this.callback = cb ? cb : () => this.host.requestUpdate()
		this.host.addController(this);
	}

	dispose() {
		this.state.removeEventListener(StateEvent.eventName, this.callback);
	}

	hostConnected(): void {
		this.state.addEventListener(StateEvent.eventName, this.callback);
		this.callback();

	}
	hostDisconnected(): void {
		this.dispose()
	}
}