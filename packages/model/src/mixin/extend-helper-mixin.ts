import { EntityI, Model, RenderConfig } from '../types.js';
import { ActionsT } from '../types/actionTypes.js';
import { DefaultI } from '../types/entity.js';

declare global {
  interface HTMLElementEventMap {

  }
}

export declare class ExtendHelperMixinInterface {
}
type Constructor<T = {}> = abstract new (...args: any[]) => T;
/**
 * ## ExtendHelperMixin  
 * 
 * This is a mixin that extends the class with the model and actions and sets 
 * adequate types for the class and the static methods
 */
export const ExtendHelperMixin = <
  D extends DefaultI = DefaultI,
  C extends RenderConfig = RenderConfig,
  A extends ActionsT = ActionsT
>(model?: Model<D>, actions?: A) => <T extends Constructor<any>>(
  superClass: T
): T & EntityI<D, C, A> => {

    abstract class ExtendHelperMixinClass extends superClass {
      static model: Model<D>;
      static actions: A;
    };
    if (model) {
      ExtendHelperMixinClass.model = model;
    }
    if (actions) {
      ExtendHelperMixinClass.actions = actions;
    }
    return ExtendHelperMixinClass as unknown as T & EntityI<D, C, A>;
  }

export default ExtendHelperMixin;

