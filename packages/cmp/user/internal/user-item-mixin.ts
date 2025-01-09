
import { MdListItem } from '@material/web/list/list-item.js';
import { MdSelectOption } from '@material/web/select/select-option.js';
import '@preignition/lit-firebase/span';
import { LitElement, PropertyValues, TemplateResult } from 'lit';
import { html } from 'lit';
import { property } from 'lit/decorators.js';
import '../img.js';
import userMixin from './user-mixin.js';
import { MixinBase, MixinReturn } from '@material/web/labs/behaviors/mixin.js';



export declare class UserItemMixinInterface {
	/** the user id */
	email: string
	supportingText: string | undefined
	headline: string | undefined
}

// this is to imitate MdListItem
type BaseT = LitElement & {
	// listItemRoot: HTMLElement | undefined;
	// renderListItem: (template: TemplateResult) => TemplateResult;
	// renderRipple: () => TemplateResult;
	// renderFocusRing: () => TemplateResult;
	// renderBody(): TemplateResult;
}
// type BaseT = MdListItem & {}
/**
 * UserItemMixin  
 */
export const UserItemMixin = <T extends MixinBase<BaseT>>(
	superClass: T
): MixinReturn<T, UserItemMixinInterface> => {


	abstract class UserItemMixinClass extends userMixin(superClass) {

	declare listItemRoot: HTMLElement | undefined;
	declare renderListItem: (template: TemplateResult) => TemplateResult;
	declare renderRipple: () => TemplateResult;
	declare renderFocusRing: () => TemplateResult;
	// declare renderBody: () => TemplateResult;
	
	@property() supportingText!: string | undefined;
		@property() headline!: string | undefined;

		// Note(CG): we need this so as to make lapp-user-card work within lapp-content-observer
		override get innerText() {
			return this.listItemRoot?.innerText || 'loading ...';
		}

		// Note(CG): we need this so as to make lapp-user-card work within lapp-content-observer
		// TODO: MD3 - review if this is still necessary
		get text() {
			return this.innerText;
		}

		override render() {
			return this.renderListItem(html`
				<md-item>
					<div slot="container">
						${this.renderRipple()}
						${this.renderFocusRing()}
					</div>
					<slot name="start" slot="start">
						<lapp-user-img slot="start" part="img" .uid=${this.uid}></lapp-user-img>
					</slot>
					<slot name="end" slot="end"></slot>
					${this.renderBody()}
				</md-item>
			`);
		}
		/**
		 * Handles rendering the headline and supporting text.
		 * @override
		 */
		renderBody() {
			if (this.isLoading) {
				return html`
					<slot></slot>
					<slot name="headline" slot="headline">loading...</slot>
					
					`;
			}
			const supportingText = this.renderSupportingText();
			const headline = this.headline ? this.headline : html`<span>${this.displayName}</span>`;

			return html`
				<slot></slot>
				<slot name="overline" slot="overline"></slot>
				<slot name="headline" slot="headline">${headline}</slot>
				<slot name="supporting-text" slot="supporting-text">${supportingText}</slot>
				<slot name="trailing-supporting-text" slot="trailing-supporting-text"></slot>
			`;
		}

		/**
		* Renders the one-line supporting text.
		*/
		protected renderSupportingText() {
			return this.supportingText ? this.supportingText :
				this.isDeleted ? html`<span part="email">user deleted</span>` :
					this.email ? html`<span part="email">${this.email}</span>` :
						html`<span part="email">no email</span>`;

		}

	};
	return UserItemMixinClass;
}

export default UserItemMixin;

