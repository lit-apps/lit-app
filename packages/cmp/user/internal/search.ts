import { html, css, LitElement, PropertyValues } from "lit";
import { property, state, query } from 'lit/decorators.js';
import {repeat} from 'lit/directives/repeat.js';
import { HTMLEvent } from '../../types'
import '../../field/select-input'
import type { LappSelectInput } from '../../field/select-input';
import { redispatchEvent } from '@material/web/internal/controller/events.js';
// import '../card'
import { Loader, UserItem } from './types';
import('@material/web/progress/linear-progress.js');
import('@material/web/select/select-option.js');
// used to validate emails
const inputValidator = document.createElement('input');
inputValidator.type = 'email';
inputValidator.required = true;


/**
 *  An element to select users from a list of users.
 */
export class UserSearch extends LitElement {

	static override styles = css`
			:host {
				display: inline-flex;
			}
			lapp-select-input {
         flex: 1;
      }
		`;

	@property() label: string = 'Search Users';
	@property({attribute: 'supporting-text'}) supportingText!: string;

	/** a loader for searching Users */
	@property({ attribute: false }) loader!: Loader;

	/** the selected valued - the uid of the selected user*/
	@property() value!: string;

	/** the list of user items */
	@property({ type: Array }) items!: UserItem[];

	/** true to allow invite users */
	// TODO: re-implement canInvite
	@property({ type: Boolean }) canInvite = false;

	/** max number of items to show */
	@property({ type: Number }) maxItems = 10;

	@state() loading = false;

	/** text to user to filter the list 
	 * TODO: MD3 - remove this and use type ahead instead
	 */
	@state() filterText = '';

	@query('lapp-select-input') field!: LappSelectInput;

	get selectedOptions() {
		return this.field.selectedOptions;
	}

	override willUpdate(prop: PropertyValues<this>) {
		if (prop.has('loader')) {
			// bind loader to this
			this.loader = this.loader.bind(this);
		}

		if (prop.has('filterText')) {
			// check if we can invite
			const canInvite = this.canInvite;
			inputValidator.value = this.filterText;
			this.canInvite = inputValidator.checkValidity();
			if (canInvite !== this.canInvite) {
				// if (this.canInvite) {
				// 	this.textfield.onClosed()
				// }
				this.dispatchEvent(new CustomEvent('canInvite-changed', { detail: { value: this.canInvite, email: this.filterText }, composed: true }));
			}
		}

		super.willUpdate(prop);
	}

	override render() {

		const onSearchInput = async (e: HTMLEvent<LappSelectInput>) => {
			// if (e.target.localName !== 'input') {
			// 	return
			// }
			const token = e.target.searchValue || '';
			console.info('pwi - onInput', token);
			// if we have a loader, use it to load the items
			if (this.loader) {
				if (token.length > 3) {
					this.loading = true
					this.items = await this.loader.call(this, token);
					this.loading = false
				}
				return
			}
			// otherwise, use is to filer the actual items
			this.filterText = token;
		}
		const redispatch = (e: Event) => redispatchEvent(this, e);
		const onChange = (e: HTMLEvent<LappSelectInput>) => {
			this.value = e.target.value;
			redispatch(e)
			console.info('pwi - onchange', this.value);
		}

		

		return html`
			<lapp-select-input 
				.label=${this.label}
				.helper=${this.supportingText}
				.value=${this.value}
				@change=${onChange}
				@input=${redispatch}
				@search-input=${onSearchInput}
				>${
					this.loading ? html`Loading ... <md-linear-progress style="width: 300px;" indeterminate></md-linear-progress>` :
					!this.items ? html`<div style="padding: 10px;"><p>Find users by email or name .</p><p>Type at least 3 letters ...</p></div>` : 
					repeat(
						(this.items || [])
							.filter((_item, index) => index < this.maxItems), 
						(item) => item.uid, 
						(item) => this.renderListItem(item))}
			</lapp-select-input>
		`;
	}

	renderListItem(item: UserItem) {
		const name = item.email?.split('@')[0]
		const headline = item.displayName || name || 'no name';
		
		return html`<md-select-option
			.value=${item.uid}
			?selected=${item.uid === this.value}
			>${item.photoURL ? 
				html`<img slot="start" src=${item.photoURL} />` : 
				html`<lapp-icon slot="start" class="avatar">person</lapp-icon>`}
				<div slot="headline">${headline}</div>
				<div slot="supporting-text">${item.email || ''}</div>
			</md-select-option>`;


	}
}


