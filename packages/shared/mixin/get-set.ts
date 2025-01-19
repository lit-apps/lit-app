import { LitElement } from 'lit';

import { deep, type action } from '../deep.js';

const _get = (obj: any, prop: string) => obj[prop];
const _set = (n: any) => (obj: any, prop: string) => (obj[prop] = n);



type Constructor<T = {}> = new (...args: any[]) => T;

export declare class GetSetMixinInterface {
  setProp(path: string, value: any, obj?: any): action
  onInput(path: string, valPath?: string, scope?: any): (e: Event) => void

}
/**
 * GetSetMixin - a mixin for handling getter and setters 
 */
export const GetSetMixin = <T extends Constructor<LitElement>>(superClass: T) => {


  class GetSetMixinClass extends superClass {
    /**
     * Set as value deep in a object
     *
     * @param {String} path deep path (data.title.key)
     * @param {String} value valut to Set
     * @param {Object} obj the object to set - this by default
     * @returns
     */
    setProp(path: string, value: any, obj?: any) {
      return deep(_set(value), obj || this, path);
    }

    /**
     * onInput defautl handler. To be used like `
     * <lapp-text-field
     *     @input=${this.onInput('data.title')}>
     * </lapp-text-field>`
     * Main difference with onData is e.target[path] instead of e.detail[path]
     * @param  {String} path  path to write to
     * @param  {String} valPath='value'
     * @returns  {Function} a function  to be used as an event listener
     */
    onInput(path: string, valPath: string = 'value', scope?: any) {
      return async (e: Event) => {
        this.setProp(path, e.target?.[valPath as keyof EventTarget], scope);
        this._notifyPropChange(path, scope);
      };
    }

    private _notifyPropChange(path: string, scope?: any) {
      const keys = path.split('.');
      // make sure host is notified for objects
      if (keys.length > 1) {
        if (scope) {
          this.requestUpdate();
        } else {
          const name = path.split('.')[0];
          // @ts-expect-error  - we are cheating
          this[name] = { ...this[name] };
        }

      }
    }

  };
  return GetSetMixinClass as unknown as Constructor<GetSetMixinInterface> & T;
}

export default GetSetMixin;

