import { html } from 'lit';

/**
 * Renders a date value as a formatted string.
 * 
 * @param timestamp - The timestamp to render.
 * @returns The HTML element representing the formatted date.
 */
export default (timestamp: number | undefined | null) => {
	if (!timestamp)
		return html`<span style="">-</span>`;
	return html`<span style="">${(new Date(timestamp)).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>`;
};
