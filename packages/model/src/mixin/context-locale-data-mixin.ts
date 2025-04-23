import type { MixinBase, MixinReturn } from '@lit-app/shared/types.js';
import { consume, ContextConsumer, ContextProvider, createContext } from '@lit/context';
import { PropertyValues, ReactiveElement } from 'lit';
import { state } from 'lit/decorators.js';

export const localeDataContext = createContext<any>('locale-data-context');

export interface localeDataHasChangedDetail {
  /**
 * The path of the data to check
 */
  path: string
  /**
   * the name of the entity to check
   */
  entityName: string
  /**
   * If the data has changed
   */
  hasChanged?: boolean
}

/**
 * This event is fired to trigger the main application hoist an element
 */
class localeDataHasChangedEvent extends CustomEvent<localeDataHasChangedDetail> {
  static readonly eventName = 'LocaleDataHasChanged';
  constructor(path: string, entityName: string) {
    super(localeDataHasChangedEvent.eventName, {
      bubbles: true,
      composed: true,
      detail: { path, entityName }
    });
  }
}

declare global {
  interface HTMLElementEventMap {
    'LocaleDataHasChanged': localeDataHasChangedEvent,
  }
}

/**
 * ConsumeLocaleDataMixin a mixin that consumes data context
 */
export declare class DataMixinInterface<D = any> {
  localeData: D;
}
export declare class DataMixinConsumeInterface<D = any> extends DataMixinInterface<D> {
  /**
   * whether the data has changed for a given entity and path
   */
  hasLocaleDataChanged(path: string, entityName: string): boolean;
}

type BaseT = ReactiveElement & {
  preventConsume: boolean;

}

/**
 * A mixin function that provides data consumption capabilities to a LitElement-based component.
 * 
 * 
 * @param superClass - The superclass to be extended by the mixin.
 * 
 * @returns A class that extends the provided superclass with data consumption capabilities.
 * 
 * @property {D} localeData - The data consumed from the context.
 * @property {boolean} preventConsume - A flag to prevent data consumption.
 * 
 * @event LocaleDataHasChanged - Dispatched to check if the locale data has changed.
 */
export const ConsumeLocaleDataMixin = <D = any>() => <T extends MixinBase<BaseT>>(
  superClass: T
): MixinReturn<T, DataMixinConsumeInterface<D>> => {

  abstract class ContextConsumeLocaleDataMixinClass extends superClass {

    @state() localeData!: D;

    /**
     * whether the data has changed for a given entity and path
     */
    hasLocaleDataChanged(path: string, entityName: string): boolean {
      const hasChangedEvent = new localeDataHasChangedEvent(path, entityName);
      this.dispatchEvent(hasChangedEvent);
      return !!hasChangedEvent.detail.hasChanged;
    }

    private cachedLocaleData!: any;
    consumer = new ContextConsumer(this, {
      context: localeDataContext,
      subscribe: true,
      callback: (value: any) => {
        if (this.preventConsume) {
          this.cachedLocaleData = value;
        } else {
          this.localeData = value;
        }
      }
    });

    override willUpdate(prop: PropertyValues) {
      if (prop.has('preventConsume')) {
        const old = prop.get('preventConsume');
        if (old === false && this.preventConsume === true && this.cachedLocaleData) {
          this.localeData = this.cachedLocaleData;
        }
      }

      super.willUpdate(prop);
    }


  };
  return ContextConsumeLocaleDataMixinClass;
}

type ProvideBaseT = ReactiveElement & {
  hasLocaleDataChanged: (path: string) => void;
  Entity: { entityName: string }
}
/**
 * A mixin function that provides context locale data to a LitElement component.
 * 
 * This mixin consumes localeData from a parent context and provides it to child components
 * using the `ContextProvider`. It ensures that the `localeData` property is set as the prototype
 * of `parentLocaleData` if both are defined, and updates the context provider with the current data.
 * 
 * @template D - The type of data to be provided.
 * @returns A class that extends the given superclass with context data providing capabilities.
 * 
 * @property {D} localeData - The data provided by the context.
 * 
 * @example
 * ```typescript
 * class MyElement extends ProvideLocaleDataMixin<MyDataType>()(LitElement) {
 *   // Your element implementation
 * }
 * ```
 */
export const ProvideLocaleDataMixin = <D = any>() => <T extends MixinBase<ProvideBaseT>>(
  superClass: T
): MixinReturn<T, DataMixinInterface<D>> => {

  abstract class ContextProvideLocaleDataMixinClass extends superClass {

    @consume({ context: localeDataContext, subscribe: true })
    @state() parentLocaleData!: any;

    @state() localeData!: D;

    provider = new ContextProvider(this, { context: localeDataContext, initialValue: this.localeData });

    override firstUpdated(changedProperties: PropertyValues<this>) {
      super.firstUpdated(changedProperties);
      this.addEventListener(localeDataHasChangedEvent.eventName, (e: CustomEvent) => {
        const entityName = this.Entity?.entityName
        if (entityName && e.detail.entityName === entityName) {
          e.stopPropagation();
          e.detail.hasChanged = this.hasLocaleDataChanged(e.detail.path);
        }
      })
    }
    override willUpdate(prop: PropertyValues<this>) {

      // we set parentData as prototype of data if data and parentData are set
      if (prop.has('parentLocaleData') || prop.has('localeData')) {
        if (this.localeData === null && this.parentLocaleData) {
          this.localeData = {} as D
        }
        if (this.localeData && this.parentLocaleData) {
          if (Object.getPrototypeOf(this.localeData) === Object.prototype) {
            Object.setPrototypeOf(
              this.localeData,
              this.parentLocaleData)
          }
        }
        const force = Array.isArray(this.localeData) ? true : false;
        this.provider.setValue(this.localeData, force);

      }
      super.willUpdate(prop);

    }

  };

  return ContextProvideLocaleDataMixinClass;
}
