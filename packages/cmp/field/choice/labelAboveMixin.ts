import { MixinBase, MixinReturn } from '@material/web/labs/behaviors/mixin.js';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';


declare global {
  interface HTMLElementEventMap {

  }
}

export declare class LabelAboveMixinInterface {
  /**
   * When true, the label is above the input
   */
  labelAbove: boolean;
}

type BaseT = LitElement & {}
/**
 * LabelAboveMixin  
 */
export const LabelAboveMixin = <T extends MixinBase<BaseT>>(
  superClass: T
): MixinReturn<T, LabelAboveMixinInterface> => {


  abstract class LabelAboveMixinClass extends superClass {

    @property({ type: Boolean, reflect: true, attribute: 'label-above' }) labelAbove = false;

  };
  return LabelAboveMixinClass;
}

export default LabelAboveMixin;

