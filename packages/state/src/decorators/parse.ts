import { PropertyTypes } from './property.js';

export function parse(value: string | null, type: PropertyTypes| undefined): any {
	if (value !== null && (
		type === Boolean ||
		type === Number ||
		type === Array ||
		type === Object)) {
		try {
			value = JSON.parse(value);
		} catch (e) {
			console.warn('cannot parse value', value);
		}
	}
	return value;
}
