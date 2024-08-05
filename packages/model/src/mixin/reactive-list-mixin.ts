import { LitElement } from 'lit';
import { property } from 'lit/decorators.js'

declare global {
  interface HTMLElementEventMap {
    
  }
}

type Constructor<T = {}> = abstract new (...args: any[]) => T;
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
export const ReactiveListMixin = <T extends Constructor<LitElement>>(superClass: T) => {
  abstract class ReactiveListMixinClass extends superClass  {
    @property({type: Number}) size!: number;
    @property({type: Array}) selectedItems!: any[];

  };
  return ReactiveListMixinClass as unknown as Constructor<ReactiveListMixinInterface> & T;
}

export default ReactiveListMixin;

