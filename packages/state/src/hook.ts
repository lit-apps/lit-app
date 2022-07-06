import { State } from './state';
const DONOTUSE: string = 'DONOTUSE'
// interface HookI {
// 	name: string
// }

type Values = {[key:string]: unknown}


/**
 * A base class for building state hooks
 */
export class Hook {
	_unsubscribe: () => void
	
	// 
	static hookName: string = DONOTUSE

	constructor(public state: State) {
		if(!(this.constructor as typeof Hook).hookName || (this.constructor as typeof Hook).hookName === DONOTUSE) {
			throw new Error('hook subclass must have their own hookName')
		}
		this._unsubscribe = this.subscribe()
	}

	subscribe() {
		return this.state.subscribe(this.fromState, this.hookedProps.map(([key]) => key))
	}

	get hookedProps() {
		return [...this.state.propertyMap].filter(([, definition]) => definition?.hook 
			&& definition?.hook[(this.constructor as typeof Hook).hookName])
	}

	toState(values : Values) {
		Object.entries(values)
		.filter(([key]) => this.state.propertyMap.get(key)?.hook?.[(this.constructor as typeof Hook).hookName])
		.forEach(([key, value]) =>  (this.state as {} as { [key: string]: unknown })[key as string] = value) 
	}
	
	// @ts-ignore 
	fromState(key: PropertyKey, value: unknown, state: State) {
		throw ('fromState must be implemented in subclasses')
	}
}