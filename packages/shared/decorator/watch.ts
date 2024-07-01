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
 */
export function watch(propName: string, waitUntilFirstUpdate = false) {
  return <T extends LitElement>(proto: T, functionName: string): void => {
    // @ts-ignore
    const { update } = proto;
    if (propName in proto) {
      // @ts-ignore
      proto.update = function (this: T, changedProperties: PropertyValues) {
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

        update.call(this, changedProperties);
      };
    }
  };
}