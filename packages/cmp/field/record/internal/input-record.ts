import { Record } from './record';
import { property } from 'lit/decorators.js';

/**
 * A record Component to be used within RecordField
 * 
 */

export class InputRecord extends Record {

	
	@property() 
	get value() {
		return this.src;
	}
	set value(value) {
		this.src = value
	}


}

