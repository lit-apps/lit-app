import { State } from './state';

/**
 * This event is fired to inform a state has updated one of its value
 */
 export class LitStateEvent extends Event {
  static readonly eventName = 'lit-state-changed';
  readonly key: PropertyKey;
  readonly state: State;

  readonly value: unknown;
  
  /**
   * @param  {PropertyKey} key of the state that has changed
   * @param  {unknown} value for the changed key
   */
  constructor(key: PropertyKey, value: unknown, state: State) {
    super(LitStateEvent.eventName, {
      cancelable: false,
    });
    this.key = key;
    this.value = value;
    this.state = state;
  }
}

declare global {
  interface HTMLElementEventMap {
    [LitStateEvent.eventName]: LitStateEvent;
  }
  interface EventTargetEventMap {
    [LitStateEvent.eventName]: LitStateEvent;
  }
}

