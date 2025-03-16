import { MixinBase, MixinReturn } from '@lit-app/shared/types.js';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export declare class ReactiveListMixinInterface {
  size: number;
  selectedItems: any[];
}

/**
 * A mixin to add relevant reactive properties for grids and lists: 
 * 
 * @property {Number} size - number of items in the list
 * @property {Array} selectedItems - list of selected items in a grid
 * 
 */
export const ReactiveListMixin = <T extends MixinBase<LitElement>>(
  superClass: T
): MixinReturn<T, ReactiveListMixinInterface> => {

  abstract class ReactiveListMixinClass extends superClass {
    @property({ type: Number }) size!: number;
    @property({ type: Array }) selectedItems!: any[];

  };
  return ReactiveListMixinClass;
}

export default ReactiveListMixin;

