import { LitElement } from 'lit';
import { property } from 'lit/decorators.js'

declare global {
  interface HTMLElementEventMap {
    
  }
}

type Constructor<T = {}> = new (...args: any[]) => T;
export declare class ReactiveListMixinInterface {
  size: number;
  selectedItems: any[];
}

/**
 * A mixin in to add Reactive properties for grids and lists: 
 * 
 * @property {Number} size - number of items in the list
 * @property {Array} selectedItems - list of selected items in a grid
 * 
 */
export const ReactiveListMixin = <T extends Constructor<LitElement>>(superClass: T) => {
  class ReactiveListMixinClass extends superClass  {
    @property({type: Number}) size!: number;
    @property({type: Array}) selectedItems!: any[];

  };
  return ReactiveListMixinClass as unknown as Constructor<ReactiveListMixinInterface> & T;
}

export default ReactiveListMixin;

