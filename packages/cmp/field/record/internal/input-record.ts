import { Record } from './record';
import ValidationMixin from '../../generic/validationMixin';
import { property } from 'lit/decorators.js';

/**
 * A record Component to be used within RecordField
 * 
 * It needs validation methods from ValidationMixin
 */

export class InputRecord extends ValidationMixin(Record) {

	@property() 
	get value() {
		return this.src;
	}
	set value(value) {
		this.src = value
	}

}

