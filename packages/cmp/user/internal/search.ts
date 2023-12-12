import { html, css, LitElement, PropertyValues } from "lit";
import { when } from 'lit/directives/when.js';
import { property, state, query } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { HTMLEvent } from '../../types'
import '../../field/select-input'
import type { LappSelectInput } from '../../field/select-input';
import { redispatchEvent } from '@material/web/internal/controller/events.js';
// import '../card'
import { Loader, UserItem } from './types';
import slotList from '@preignition/preignition-styles/src/slot-list.js';
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

	static override styles = [
		slotList,
		css`
			:host {
				display: inline-flex;
			}
			lapp-select-input {
         flex: 1;
      }
		`];

	@property() label: string = 'Search Users';
	@property({ attribute: 'supporting-text' }) supportingText!: string;

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

	/** the email to use for inviting a user
	 */
	@state() inviteEmail = '';

	@query('lapp-select-input') field!: LappSelectInput;

	get selectedOptions() {
		return this.field.selectedOptions;
	}

	override willUpdate(prop: PropertyValues<this>) {
		if (prop.has('loader')) {
			// bind loader to this
			this.loader = this.loader.bind(this);
		}

		if (prop.has('inviteEmail') && this.inviteEmail && inputValidator.validity.valid) {
					this.dispatchEvent(new CustomEvent('invite-email-changed', {composed: true }));
		}
		super.willUpdate(prop);
	}

	override render() {

		const onSearchInput = async (e: HTMLEvent<LappSelectInput>) => {

			const searchValue = e.target.searchValue || '';
			console.info('pwi - onInput', searchValue);
			inputValidator.value = searchValue;
			// if we have a loader, use it to load the items
			if (this.loader) {
				if (searchValue.length > 3) {
					this.loading = true
					this.items = await this.loader.call(this, searchValue);
					this.loading = false
				}
				return
			}
		}
		const redispatch = (e: Event) => redispatchEvent(this, e);
		const onChange = (e: HTMLEvent<LappSelectInput>) => {
			this.value = e.target.value;
			redispatch(e)
		}


		return html`
			<lapp-select-input 
				.label=${this.label}
				.helper=${this.supportingText}
				.value=${this.value}
				@change=${onChange}
				@input=${redispatch}
				@search-input=${onSearchInput}
				>${this.loading ? html`Loading ... <md-linear-progress style="width: 300px;" indeterminate></md-linear-progress>` :
				!this.items ?
					this.renderNoItems() :
					this.renderItems(this.items)}
			</lapp-select-input>
		`;
	}

	renderNoItems() {
		return html`<div style="padding: 10px;">
			<p><strong>Find users by email or name.</strong></p>
			<p>Type at least 3 letters or a valid email address...</p>
		</div>`
	}

	renderZeroItems() {
		const searchValue = this.field?.searchValue || '';
		const isValidEmail = inputValidator.validity.valid;
		const onInvite = () => this.inviteEmail = searchValue;

		return html`<div style="padding: 10px;">
			<p><strong>Find users by email or name.</strong></p>
			<p>No users found. ${!isValidEmail ?  'Type a valid email address...' : ''}</p>
			${when(isValidEmail, () => html`<md-filled-button .disabled=${searchValue === this.inviteEmail} @click=${onInvite}>Set ${searchValue} as a User to Invite</md-filled-button>` )}
		</div>`
	}
	renderItems(items: UserItem[]) {
		if (items.length === 0) {
			return this.renderZeroItems()
		}
		return html`${repeat(
			(items || []).filter((_item, index) => index < this.maxItems),
			(item) => item.uid,
			(item) => this.renderListItem(item))}
		`

	}

	renderListItem(item: UserItem) {
		const name = item.email?.split('@')[0]
		const headline = item.displayName || name || 'no name';

		return html`<md-select-option
			.value=${item.uid}
			?selected=${item.uid === this.value}
			>${item.photoURL ?
				html`<img slot="start" class="avatar" src=${item.photoURL} />` :
				html`<lapp-icon slot="start" class="avatar">person</lapp-icon>`}
				<div slot="headline">${headline}</div>
				<div slot="supporting-text">${item.email || ''}</div>
			</md-select-option>`;


	}
}


