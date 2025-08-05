import { MixinBase, MixinReturn } from '@material/web/labs/behaviors/mixin.js';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';


declare global {
  interface HTMLElementEventMap {

  }
}

export declare class LabelInlineMixinInterface {
  /**
   * When true, the label is inline with the input (radio or checkbox).
   */
  childLabelInline: boolean;
}

type BaseT = LitElement & {}
/**
 * LabelAboveMixin  
 */
export const LabelInlineMixin = <T extends MixinBase<BaseT>>(
  superClass: T
): MixinReturn<T, LabelInlineMixinInterface> => {


  abstract class LabelInlineMixinClass extends superClass {

    @property({ type: Boolean, reflect: true, attribute: 'child-label-inline' }) childLabelInline = false;

  };
  return LabelInlineMixinClass;
}

export default LabelInlineMixin;

