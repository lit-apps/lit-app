import type { PropertyValues, LitElement } from 'lit';

/**
 * Decorator that watches for changes in a specified property and calls a corresponding function when the property changes.
 * @param propName - The name of the property to watch for changes.
 * @param waitUntilFirstUpdate - Optional parameter to specify whether to wait until the first update before calling the corresponding function. Default is false.
 * @returns A decorator function that can be applied to a method.
 * 
 * @watch('propName')
 * handlePropChange(oldValue, newValue) {
 *
 * }
 * 
 * from: https://github.com/zdhxiong/mdui/blob/v2/packages/shared/src/decorators/watch.ts
 * 
 * The difference from the source is that we operate at `willupdate` 
 * instead of `update` to avoid the multiple calls to reactive rendering
 */
export function watch(propName: string, waitUntilFirstUpdate = false) {
  return <T extends LitElement>(proto: T, functionName: string): void => {
    // @ts-ignore
    const { willUpdate } = proto;
    if (propName in proto) {
      // @ts-ignore
      proto.willUpdate = function (this: T, changedProperties: PropertyValues) {
        if (changedProperties.has(propName)) {
          const oldValue = changedProperties.get(propName);
          const newValue = this[propName as keyof T];

          if (oldValue !== newValue) {
            if (!waitUntilFirstUpdate || this.hasUpdated) {
              // @ts-ignore
              this[functionName](oldValue, newValue);
            }
          }
        }

        willUpdate.call(this, changedProperties);
      };
    }
  };
}

export default watch