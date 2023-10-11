
import { html } from 'lit';
import { property } from 'lit/decorators.js'
import { MdListItem } from '@material/web/list/list-item.js';
import userMixin from './user-mixin.js';
import '../img.js';
import '@preignition/lit-firebase/span';
import type {LifSpan} from '@preignition/lit-firebase/span';
import { HTMLEvent } from '../../types.js';
import { classMap } from 'lit/directives/class-map.js';

type Constructor<T = {}> = new (...args: any[]) => T;
export declare class UserMixinInterface {
  /** the user id */
  email: string
  supportingText: string
  headline: string
}
/**
 * UserMixin 
 */
export const UserItemMixin = <T extends Constructor<MdListItem>>(superClass: T) => {

  class UserItemMixinClass extends userMixin(superClass) {

		@property() email!: string | undefined;
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
			return this.renderListItem(html `
				<md-item>
					<div slot="container">
						${this.renderRipple()}
						${this.renderFocusRing()}
					</div>
					<slot name="start" slot="start">
						<lapp-user-img slot="start" part="img"  .uid=${this.uid}></lapp-user-img>
					</slot>
					<slot name="end" slot="end"></slot>
					${this.renderBody()}
				</md-item>
			`);
			}
			/**
			 * Handles rendering the headline and supporting text.
			 */
			override renderBody() {
				const supportingText = this.renderSupportingText();
				const headline = this.headline ? this.headline : html`<lif-span .path=${this.namePath}></lif-span>`;
		
					return html `
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
				this.email ? html`<span part="email">${this.email}</span>` :
				html`<lif-span 
					@error=${(e: HTMLEvent<LifSpan> ) => e.target.valueController.value = ''}
					part="email" .defaultValue=${'no email'} .path=${this.emailPath}></lif-span>`
	
		}

  };
  // Cast return type to your mixin's interface intersected with the superClass type
  return UserItemMixinClass as unknown as Constructor<UserItemMixinInterface> & T;
}

export default UserItemMixin;

