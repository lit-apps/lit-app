import { html, css, LitElement, PropertyValues } from "lit";
import { property, state, query } from 'lit/decorators.js';
import {repeat} from 'lit/directives/repeat.js';
import { HTMLEvent } from '../../types'
import '@preignition/pwi-textfield-select'
import type { PwiTextfieldSelect } from '@preignition/pwi-textfield-select/src/pwi-textfield-select';
import '../card'
import { Loader, UserItem } from './types';
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
			pwi-textfield-select {
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
	@property({ type: Boolean }) canInvite = false;

	/** max number of items to show */
	@property({ type: Number }) maxItems = 10;

	@state() loading = false;

	/** text to user to filter the list 
	 * TODO: MD3 - remove this and use type ahead instead
	 */
	@state() filterText = '';

	@query('pwi-textfield-select') textfield!: LitElement & {
		onClosed: () => void
		onOpened: () => void
	};

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
				if (this.canInvite) {
					this.textfield.onClosed()
				}
				this.dispatchEvent(new CustomEvent('canInvite-changed', { detail: { value: this.canInvite, email: this.filterText }, composed: true }));
			}
		}
		if (prop.has('items') && !!this.loader && !this.canInvite) {
			// check whether to open or close the menu
			this.textfield.onOpened()

		}
		super.willUpdate(prop);
	}

	override render() {

		const onSearchInput = async (e: CustomEvent) => {
			const token = e.detail;
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
		
		const onSelected = (e: HTMLEvent<PwiTextfieldSelect>) => {
			this.value = e.target.value;
			this.dispatchEvent(new CustomEvent('value-changed', { detail: { 
				value: this.value,
				selectedText: e.target.selectedText
			}, composed: true }));
		}

		return html`
			<pwi-textfield-select 
				.label=${this.label}
				.helper=${this.supportingText}
				.value=${this.value}
				@selected=${onSelected}
				@search-input=${onSearchInput}
				>${!this.items ? ' Find users by email or names  ...' : 
					repeat(
						(this.items || [])
							.filter((_item, index) => index < this.maxItems), 
						(item) => item.uid, 
						(item) => this.renderListItem(item.uid, item.email))}</pwi-textfield-select>

			</pwi-textfield-select>
		`;
	}

	renderListItem(uid: string, email?: string) {
		// TODO: MD3 - remove the onclick patch

		const onClick = (e: HTMLEvent<HTMLElement & {selected: boolean}>) => {
			const selected = !e.target.selected;
			const source = 'interaction'
			const customEv = new CustomEvent('request-selected', { bubbles: true, composed: true, detail: { source, selected } });
			e.target.dispatchEvent(customEv);
		}
		return html`<lapp-user-card 
      @click=${onClick}
      mwc-list-item 
      two-line 
      .value=${uid} 
      .uid=${uid} 
      .email=${email}></lapp-user-card>`;
	}
}


