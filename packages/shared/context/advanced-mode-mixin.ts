import { createContext } from '@lit/context';
import { LitElement, PropertyValues } from 'lit';
import type { MixinBase, MixinReturn } from '../types.js';
import { ContextMixinFactory } from './context-mixin-factory.js';


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
export declare class AdvancedModeMixinInterface {
  advancedMode: boolean
}
export const advancedModeContext = createContext<boolean>('advanced-mode-context');

const {
  ConsumeMixin,
  ProvideMixin
} = ContextMixinFactory<AdvancedModeMixinInterface>(advancedModeContext, 'advancedMode', false);


export declare class ConsumeAdvancedModeMixinInterface extends AdvancedModeMixinInterface {
  setAdvancedMode: (value: boolean) => void
}

/**
 * ConsumeAdvancedModeMixin a mixin to add advanced mode to a component 
 */
export const ConsumeAdvancedModeMixin = <T extends MixinBase<LitElement>>(
  superClass: T
): MixinReturn<T, ConsumeAdvancedModeMixinInterface> => {

  abstract class ConsumeAdvancedModeMixinClass extends ConsumeMixin(superClass) {

    setAdvancedMode(value: boolean) {
      this.dispatchEvent(new AdvancedModeEvent(value));
    }

  };
  return ConsumeAdvancedModeMixinClass;
}

/**
 * ProvideAdvancedModeMixin a mixin to provide advanced mode context
 */
export const ProvideAdvancedModeMixin = <T extends MixinBase<LitElement>>(
  superClass: T
): MixinReturn<T, AdvancedModeMixinInterface> => {

  abstract class ProvideAdvancedModeMixinClass extends ProvideMixin(superClass) {

    override firstUpdated(props: PropertyValues<this>) {
      super.firstUpdated(props);
      this.addEventListener(AdvancedModeEvent.eventName, (e) => {
        this.advancedMode = (e as AdvancedModeEvent).value;
      })
    }

  };
  return ProvideAdvancedModeMixinClass;
}

