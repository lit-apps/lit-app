import { PropertyMapOptions, State } from './state.js';
const DONOTUSE: string = 'DONOTUSE'

type Values = { [key: string]: unknown }

/**
 * A base class for building state hooks
 */
export class Hook {
	static hookName: string = DONOTUSE

	private _unsubscribe: () => void
	state: State

	constructor(state: State) {
		this.state = state
		if (!(this.constructor as typeof Hook).hookName || (this.constructor as typeof Hook).hookName === DONOTUSE) {
			throw new Error('hook subclass must have their own hookName')
		}
		this._unsubscribe = this.subscribe()
		state.hookMap.set((this.constructor as typeof Hook).hookName, this)
	}
	unsubscribe() {
		this._unsubscribe()
	}
	subscribe() {
		return this.state.subscribe(this.fromState.bind(this), this.hookedProps.map(([key]) => key).filter((key): key is string => typeof key === 'string'))
	}

	private _hookedProps?: Array<[string, PropertyMapOptions]>
	get hookedProps(): Array<[string, PropertyMapOptions]> {
		if (this._hookedProps) {
			return this._hookedProps
		}
		const stateProto = Object.getPrototypeOf(this.state)
		if (!stateProto.propertyMap) { stateProto.initPropertyMap() }
		this._hookedProps = [...stateProto.propertyMap].filter(([, definition]) => definition?.hook
			&& definition?.hook[(this.constructor as typeof Hook).hookName])
		return this._hookedProps
	}

	/**
	 * Returns true if the key is configured for this hook
	 * @param key 
	 * @returns boolean
	 */
	isHookedProp(key: string) {
		return this.hookedProps.some(([k]) => k === key)
	}

	getDefinition(key: string) {
		return this.state.propertyMap.get(key)
	}

	toState(values: Values) {
		Object.entries(values)
			.filter(([key]) => this.isHookedProp(key))
			.forEach(([key, value]) => (this.state as {} as { [key: string]: unknown })[key as string] = value)
	}

	fromState(key: string, value: unknown, state: State) {
		throw ('fromState must be implemented in subclasses')
	}

	reset() {
		throw ('reset hook must be implemented in subclasses')
	}
}