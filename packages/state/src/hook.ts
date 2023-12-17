import { State } from './state.js';
const DONOTUSE: string = 'DONOTUSE'

type Values = {[key:string]: unknown}

/**
 * A base class for building state hooks
 */
export class Hook {
	static hookName: string = DONOTUSE
	
	unsubscribe: () => void
	
	constructor(public state: State) {
		if(!(this.constructor as typeof Hook).hookName || (this.constructor as typeof Hook).hookName === DONOTUSE) {
			throw new Error('hook subclass must have their own hookName')
		}
		this.unsubscribe = this.subscribe()
		state.hookMap.set((this.constructor as typeof Hook).hookName, this)
	}

	subscribe() {
		return this.state.subscribe(this.fromState.bind(this), this.hookedProps.map(([key]) => key))
	}

	get hookedProps() {
		const stateProto = Object.getPrototypeOf(this.state)
		if(!stateProto.propertyMap) {stateProto.initPropertyMap()}
		return [...stateProto.propertyMap].filter(([, definition]) => definition?.hook 
			&& definition?.hook[(this.constructor as typeof Hook).hookName])
	}

	/**
	 * Returns true if the key is configured for this hook
	 * @param key 
	 * @returns boolean
	 */
	isHookedProp(key: string) {
		return this.getDefinition(key)?.hook?.[(this.constructor as typeof Hook).hookName]
	}

	getDefinition(key: string) {
		return this.state.propertyMap.get(key)
	}

	toState(values : Values) {
		Object.entries(values)
		.filter(([key]) => this.isHookedProp(key))
		.forEach(([key, value]) =>  (this.state as {} as { [key: string]: unknown })[key as string] = value) 
	}
	
	// @ts-ignore 
	fromState(key: string, value: unknown, state: State) {
		throw ('fromState must be implemented in subclasses')
	}
	
	// @ts-ignore 
	reset() {
		throw ('reset hook must be implemented in subclasses')
	}
}