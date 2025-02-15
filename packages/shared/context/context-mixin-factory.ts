/**
 * A Factory function that creates a mixin to context data to a LitElement component.
 */

import { consume, createContext, provide } from "@lit/context";
import { LitElement } from "lit";
import { MixinBase, MixinReturn } from '../types.js';

/**
 * A factory function that creates mixins for consuming and providing context in LitElement components.
 *
 * @template I - The type of the context value.
 * @param {ReturnType<typeof createContext>} context - The context object created by `createContext`.
 * @param {string} name - The name of the property that will be used to consume or provide the context.
 * @param {unknown} [defaultValue=undefined] - The value to set the property on provideMixin.
 * @param {boolean} [subscribe=true] - Whether the consuming mixin should subscribe to context changes.
 * @returns {Object} An object containing two mixins: `ConsumeMixin` and `ProvideMixin`.
 *
 * @example
 * ```typescript
 * const { ConsumeMixin, ProvideMixin } = ContextMixinFactory(myContext, 'myProperty');
 * 
 * class MyComponent extends ConsumeMixin(LitElement) {
 *   // This component will consume the context and have a property `myProperty`.
 * }
 * 
 * class MyProviderComponent extends ProvideMixin(LitElement) {
 *   // This component will provide the context and have a property `myProperty`.
 * }
 * ```
 */
export function ContextMixinFactory<I = any>(
  context: ReturnType<typeof createContext>,
  name: string,
  defaultValue: unknown = undefined,
  subscribe: boolean = true
) {

  const ConsumeMixin = <T extends MixinBase<LitElement>>(
    superClass: T
  ): MixinReturn<T, I> => {

    abstract class ContextConsumeAppIdMixinClass extends superClass {
      static properties = {
        [name]: {}
      }
      static {
        consume({ context, subscribe })(this.prototype, name);
      }
    };
    return ContextConsumeAppIdMixinClass as unknown as MixinReturn<T, I>;
  }

  const ProvideMixin = <T extends MixinBase<LitElement>>(
    superClass: T
  ): MixinReturn<T, I> => {

    abstract class ContextProvideAppIdMixinClass extends superClass {
      static properties = {
        [name]: {}
      }
      static {
        provide({ context })(this.prototype, name);
      }
      constructor(..._args: any[]) {
        super();
        if (defaultValue !== undefined) {
          // @ts-expect-error - we know this.name is a property
          this[name] = defaultValue;
        }
      }
    };

    return ContextProvideAppIdMixinClass as unknown as MixinReturn<T, I>;
  }

  return {
    ConsumeMixin,
    ProvideMixin
  }

}