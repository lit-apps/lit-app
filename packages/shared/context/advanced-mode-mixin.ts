import { consume, createContext, provide } from '@lit/context';
import { LitElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js'

/**
 * This event is fired to inform advanced-mode value has changed
 */
export class AdvancedModeEvent extends Event {
  static readonly eventName = 'app-advanced-mode-changed';
  readonly value: boolean;

  /**
   * @param  {boolean} value for the changed key
   */
  constructor(value: boolean) {
    super(AdvancedModeEvent.eventName, {
      cancelable: false,
      bubbles: true,
      composed: true
    });
    this.value = value;
  }
}

declare global {
  interface HTMLElementEventMap {
    [AdvancedModeEvent.eventName]: AdvancedModeEvent;
  }
}
export const advancedModeContext = createContext<boolean>('advanced-mode-context');

type Constructor<T = {}> = new (...args: any[]) => T;
export declare class AdvancedModeMixinInterface {
  advancedMode: boolean
}

export declare class ContextConsumeAdvancedModeMixinInterface extends AdvancedModeMixinInterface {
  setAdvancedMode: (value: boolean) => void
}

/**
 * ContextConsumeAdvancedModeMixin a mixin to add advanced mode to a component 
 */
export const ContextConsumeAdvancedModeMixin = <T extends Constructor<LitElement>>(superClass: T) => {


  class ContextConsumeAdvancedModeMixinClass extends superClass {

    @consume({ context: advancedModeContext, subscribe: true })
    @property() advancedMode!: boolean;

    setAdvancedMode(value: boolean) {
      this.dispatchEvent(new AdvancedModeEvent(value));
    }

  };
  return ContextConsumeAdvancedModeMixinClass as unknown as Constructor<ContextConsumeAdvancedModeMixinInterface> & T;
}


/**
 * ContextProvideAdvancedModeMixin a mixin to provide advanced mode context
 */
export const ContextProvideAdvancedModeMixin = <T extends Constructor<LitElement>>(superClass: T) => {


  class ContextProvideAdvancedModeMixinClass extends superClass {

    @provide({ context: advancedModeContext })
    @property() advancedMode: boolean = false

    override firstUpdated(props: PropertyValues<this>) {
      super.firstUpdated(props);
      this.addEventListener(AdvancedModeEvent.eventName, (e) => {
        this.advancedMode = (e as AdvancedModeEvent).value;
      })
    }

  };
  return ContextProvideAdvancedModeMixinClass as unknown as Constructor<AdvancedModeMixinInterface> & T;
}

