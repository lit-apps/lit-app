/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */


/**
 * Shameless copy of @lit-labs/context/src/lib/value-notifier
 * We copy as ValueNotifier is not exported (cannot import, 
 * even when poiting to exacti source filer because of packages.json
 * having exports defined)
 */

 export type Callback<ValueType> = (
  value: ValueType,
  unsubscribe?: () => void
) => void;


 /**
	* A disposer function
	*/
 type Disposer = () => void;
 
 /**
	* A simple class which stores a value, and triggers registered callbacks when the
	* value is changed via its setter.
	*
	* An implementor might use other observable patterns such as MobX or Redux to get
	* behavior like this. But this is a pretty minimal approach that will likely work
	* for a number of use cases.
	*/
 export class ValueNotifier<T> {
	 private callbacks: Map<Callback<T>, Disposer> = new Map();
 
	 private _value!: T;
	 public get value(): T {
		 return this._value;
	 }
	 public set value(v: T) {
		 this.setValue(v);
	 }
 
	 public setValue(v: T, force = false) {
		 const update = force || !Object.is(v, this._value);
		 this._value = v;
		 if (update) {
			 this.updateObservers();
		 }
	 }
 
	 constructor(defaultValue?: T) {
		 if (defaultValue !== undefined) {
			 this.value = defaultValue;
		 }
	 }
 
	 updateObservers = (): void => {
		 for (const [callback, disposer] of this.callbacks) {
			 callback(this._value, disposer);
		 }
	 };
 
	 addCallback(callback: Callback<T>, subscribe?: boolean): void {
		 if (subscribe) {
			 if (!this.callbacks.has(callback)) {
				 this.callbacks.set(callback, () => {
					 this.callbacks.delete(callback);
				 });
			 }
		 }
		 callback(this.value);
	 }
 
	 clearCallbacks(): void {
		 this.callbacks.clear();
	 }
 }
 