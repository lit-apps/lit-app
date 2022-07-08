/**
 * A hook for @lit-app/state synchronizing with firebase
 */

import { ref, set, child, onValue, DatabaseReference, DataSnapshot, Unsubscribe, Query } from 'firebase/database'
import { Hook } from '../src/hook'
import { State } from '../src/state'

type Ref = DatabaseReference | { [key: string]: DatabaseReference }
type hookDef = {
	path?: string,
	forceSet?: boolean
}



/** DatabaseReference is an interface. We cannot use value instanceof DatabaseReference */
const isRef = (value: Ref) => {
	return value.key && value.root && value.parent;
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
 * If the value of the database does not exits (onValue retrning null), or the hook property has `forceSet` set to `true` set with current state value
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
export class FirebaseHook extends Hook {
	static override hookName: string = hookName;
	private _ref: Ref
	private _hasSynched: Map<string, boolean>
	private _unsubscribe: Unsubscribe[] = []

	set ref(ref: Ref) {
		this._unsubscribe.forEach(unsubscribe => unsubscribe())
		this._unsubscribe = []
		this._hasSynched = new Map()
		if (ref) {
			this._ref = ref;

			const callbacks = snap => {
				const values = {}
				this.hookedProps.forEach(([key, definition]) => {
					const hookDef = definition?.hook?.firebase as hookDef
					const child = hookDef?.path || key
					const value = snap.child(child).val();
					if (!this._hasSynched.get(key) &&
						(value === null || hookDef.forceSet) && this.state[key] !== undefined) {
						set(snap.child(child), this.state[key])
							.then(() => this._hasSynched.set(key, true))
					} else {
						values[key] = value
						this._hasSynched.set(key, true)
					}
				});
				this.toState(values)
			}

			const callback = (key: string) => (snap: DataSnapshot) => {
				if (this._hasSynched) {
				}
				const value = snap.val()
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
			if (isRef(this._ref)) {
				// Note(CG): ref is a firebase reference., the same for each options
				this._unsubscribe.push(onValue(this._ref as Query, callbacks))
			} else if (Object(this._ref) === this._ref) {
				// Note(CG): ref is an object mapped to option keys
				Object.keys(this._ref)
					.filter(k => isRef(this._ref[k]) && this.isHookedProp(k))
					.forEach(k => {
						this._unsubscribe.push(onValue(this._ref[k], callback(k)))
					});
			}
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
}