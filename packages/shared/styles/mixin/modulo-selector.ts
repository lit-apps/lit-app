import { LitElement, PropertyValues } from 'lit';

type Constructor<T = {}> = new (...args: any[]) => T;
export declare class ModuloSelectorMixinInterface {
}
/**
 * ModuloSelectorMixin 
 * 
 * A mixin to add classes to a component by selecting their order in modulo
 */
export const ModuloSelectorMixin = (modulo: number, selector: string = 'p', className: string = 'mod') => <T extends Constructor<LitElement>>(superClass: T) => {

  class ModuloSelectorMixinClass extends superClass {

    protected override firstUpdated(props: PropertyValues<this>): void {
      super.firstUpdated(props);
      // add class to the element
      const els = this.shadowRoot?.querySelectorAll(selector);
      [...els!].forEach((el, i) => {
        el.classList.add(`${className}-${i % modulo}`);
        el.classList.add(`${className}`);
      })
    }

  };
  // Cast return type to your mixin's interface intersected with the superClass type
  return ModuloSelectorMixinClass as unknown as Constructor<ModuloSelectorMixinInterface> & T;
}

export default ModuloSelectorMixin;

