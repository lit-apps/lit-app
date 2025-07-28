import { MixinBase, MixinReturn } from './types.js';

export declare class ExtendTypeMixinInterface {
}
type BaseT = {};

/**
 * ## ExtendTypeMixin
 * 
 * @template D The type to extend the base type with.
 * @returns A mixin that extends the base type with the given type.
 */
export const ExtendTypeMixin = <D>() => <T extends MixinBase<BaseT>>(
  superClass: T
): MixinReturn<T, ExtendTypeMixinInterface & D> => {

  return superClass as unknown as MixinReturn<T, ExtendTypeMixinInterface & D>;
};
export default ExtendTypeMixin;
