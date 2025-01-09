import { ActionT, ActionEntityI, ActionEventI, ActionServerEntityI } from '../types/actionTypes.js';
import { Timestamp } from 'firebase/firestore';
import { LitElement, css, html } from "lit";
import { state } from 'lit/decorators.js';

type Meta = {
	by: string;
	timestamp: Timestamp;
}
// type Actions = {[key: string]:  ActionEntityI | ActionEventI | ActionServerEntityI};
type Actions = {[key: string]:  ActionT};

const renderMeta = (label: string, meta: Meta) => {
	if (!meta) { return '' }
	return html`
		<div class="inline">
			<span class="label">${label} : </span>
			<span class="value">${meta.timestamp?.toDate()?.toLocaleDateString() || ''}</span>
			${meta.by && meta.by !== 'cloudFunction' ? html`, <lif-span class="value" .path="/userData/profile/${meta.by}/displayName"></lif-span>` : ''}
		</div>
	`;
}
/**
 * display resource metadata
 * This is the Base class - to be extended via specific Entity mixins, providing 
 * Entity actions to display. It also need to be mixed with PersistenceMixin to provide 
 * a path to the database (and bind the data property)
 */

export default class BaseMetadata extends LitElement {
	static actions: Actions;

	static override styles = css`
			:host {
				display: grid;
    		grid-template-columns: repeat(4, 1fr);
    		column-gap: var(--space-medium);
				color: var(--color-secondary-text);
				font-size: var(--font-size-x-small);
				font-weight: 100;
				min-height: 2em;
				margin-bottom: 1em;
			}
		`;
	
	@state() data!: any;

	get actions() {
		return (this.constructor as typeof BaseMetadata).actions
	}

	private get metaActions() {
		return Object.entries(this.actions as Record<string,ActionEntityI>)
		.filter(([_key, action]) => action.meta)
		.sort(([_key1, action1], [_key2, action2]) => (action1.meta?.index ?? 0) - (action2.meta?.index ?? 0));
		;
	}
	override render() {
		if(!this.data) { return ''; }
		return this.metaActions
			.filter(([key, _action]) => this.data[key])
			.map(([key, action]) => renderMeta(action.meta?.label || key, this.data[key]));
	}

}


