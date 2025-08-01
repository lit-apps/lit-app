import type { MixinBase, MixinReturn } from '@material/web/labs/behaviors/mixin.js';
import { LitElement } from 'lit';

export declare class AddClassMixinInterface { }

type BaseT = LitElement & {}

/**
 * PageMixin a mixin to be applied to all for pages (Page and Submit)
 */
export const AddClassMixin = <D = any>(cls: string | string[]) => <T extends MixinBase<BaseT>>(
  superClass: T
): MixinReturn<T, AddClassMixinInterface> => {

  abstract class AddClassMixinClass extends superClass {

    constructor(...args: any[]) {
      super(...args);
      if (Array.isArray(cls)) {
        cls.forEach(c => this.classList.add(c));
      } else {
        this.classList.add(cls);
      }
    }
  };
  return AddClassMixinClass
}

export default AddClassMixin;


