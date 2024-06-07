import { LitElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js'

type Constructor<T = {}> = new (...args: any[]) => T;
export declare class LocalStoragePersistInterface {
  /**
   * The key to use to store the value in local storage
   * 
   * When this value is set, the value of the field will be saved to local storage when it changes 
   * and restored from local storage when the component is created.
   */
  storageKey: string

  /**
   * Reset the value in local storage
   */
  resetLocalStorage(): void
}

type FieldT = LitElement & { value: string };

const isLocalStorageAvailable = (() => {
  try {
    const key = '__storage_test__';
    localStorage.setItem(key, key);
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
})()


/**
 * LocalStoragePersist 
 * 
 * A mixin to persist input values to local storage. It will save the value of the property to local storage when the property changes.
 * 
 */
export const LocalStoragePersist = <T extends Constructor<FieldT>>(superClass: T) => {

  class LocalStoragePersistClass extends superClass {

    @property() storageKey!: string;

    override willUpdate(changedProperties: PropertyValues<this>) {
      super.willUpdate(changedProperties);

      if (changedProperties.has('storageKey') && isLocalStorageAvailable) {
        if (this.storageKey) {
          this.addEventListener('input', this._handleInput);
          const value = localStorage.getItem(this.storageKey);
          if (value && !this.value) {
            this.value = JSON.parse(value);
          }
        } else {
          this.removeEventListener('input', this._handleInput);
        }
      }
    }

    private async _handleInput() {
      // we make async because we want to wait for the value to be updated
      await this.updateComplete;
      localStorage.setItem(this.storageKey, JSON.stringify(this.value));
    }

    resetLocalStorage() {
      localStorage.removeItem(this.storageKey);
    }
  };
  // Cast return type to your mixin's interface intersected with the superClass type
  return LocalStoragePersistClass as unknown as Constructor<LocalStoragePersistInterface> & T;
}

export default LocalStoragePersist;

