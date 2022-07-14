/**
 * A hook for @lit-app/state synchronizing with firebase
 */

import { set, child, onValue, DatabaseReference, DataSnapshot, Unsubscribe, Query } from 'firebase/database'
import { Hook } from '../src/hook'
import { State } from '../src/state'

type Ref = DatabaseReference | { [key: string]: DatabaseReference } | undefined
type hookDef = {
	path?: string,
	forceSet?: boolean
}



/** DatabaseReference is an interface. We cannot use value instanceof DatabaseReference */
const isRef = (value: Ref) => {
	return value && value.key && value.root && value.parent;
};
const hookName = 'firebase'

/** 
 * Firebase hook to synchronize state values with a firebase path
 * 
 * The path resolves relatively to a Database reference set to the hook. 
 * 
 * Synchronisation works like this: 
 * 
 * When the ref is set: 
 * If the value of the database does not exits (onValue returning null), or the hook property has `forceSet` set to `true` set with current state value
 * Otherwise (database value does exist, no `forceSet`), read the value from the database first
 * 
 * Then database write updates on state value and vice-versa.
 * 
 * The Database reference is either :
 * 1. one ref (applying to all hooked properties), or
 * 2. a <key, ref> object, with individual ref applying to hooked properties
 * 
 * 
 * Examples: 
 * 
 * Same ref for the all state properties
 * ```js
 * @hook(firebase, {path: /mypath})
 * @property() a // property `a` will sync with child(state.ref, 'mypath')
 * @hook(firebase )
 * @property() name // property `name` will sync with child(state.ref, 'name')
 * ```
 * 
 * setting a <key,ref> object 
 * 
 * ```js
 * const ref = {
 * 	a: ref(getDatabase(), '/a/path/for/a')
 * 	name: ref(getDatabase(), '/a/path/for/name')
 * }
 * @hook(firebase, {path: /mypath})
 * @property() a // property `a` will sync with with path '/a/path/for/a' (mypath is not taken into account)
 * @hook(firebase )
 * @property() name // property `name` will sync path '/a/path/for/name'
 * ```
 * 
 */
export class HookFirebase extends Hook {
	static override hookName: string = hookName;
	private _ref: Ref
	private _hasSynched: Map<string, boolean> = new Map()
	private _unsubscribe: Unsubscribe[] = []

	set ref(ref: Ref) {
		this._unsubscribe.forEach(unsubscribe => unsubscribe())
		this._unsubscribe = []
		this._hasSynched = new Map()
		this._ref = ref;
		if (ref) {

			const callback = (key: string) => (snap: DataSnapshot) => {
				const value = snap.val()
				// console.info('cb', key, value, this.state[key])
				const hookDef = this.getDefinition(key)?.hook?.firebase as hookDef
				if (!this._hasSynched.get(key) &&
					(value === null || hookDef.forceSet) && this.state[key] !== undefined) {
					set(snap.ref, this.state[key])
						.then(() => this._hasSynched.set(key, true))
				} else {
					this.toState({ [key]: snap.val() })
					this._hasSynched.set(key, true)
				}
			}

		  this.hookedProps.forEach(([key, definition]) => {
				const hookDef = definition?.hook?.firebase as hookDef
				const r = isRef(this.ref[key]) ? this._ref[key] :
					isRef(this.ref) ? child(this.ref as DatabaseReference, hookDef?.path || key) :
					null
				if(r) {
					this._unsubscribe.push(onValue(r as Query, callback(key), (error) => {
						console.error(error)  
					}))
					
				}
			})
		}
	}
	
	store() {
		if (isRef(this._ref)) {
			const stateValue = this.state.stateValue
			const value = {}
			this.hookedProps.forEach(([key, definition]) => {
				const hookDef = definition?.hook?.firebase as hookDef
				const v = stateValue[key]
				if(v !== undefined) {value[hookDef?.path || key] = v}
			})
			set(this._ref as DatabaseReference, value)
		}
	}


	get ref(): Ref {
		return this._ref
	}

	constructor(public state: State, ref?: Ref) {
		super(state)
		if (ref) {
			this.ref = ref
		}
	}

	override fromState(key: string, value: unknown): void {
		if (value !== undefined && this._hasSynched.get(key) && this.ref) {
			const definition = this.getDefinition(key)
			set(
				child(this.ref[key] || this.ref,
					(definition?.hook?.firebase as hookDef)?.path || key), value
			)
		}
	}
	override reset():void {
		this.ref = undefined
	}
}