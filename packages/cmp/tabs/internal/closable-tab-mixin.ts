/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {property, state} from 'lit/decorators.js';
import {html, PropertyValues, render} from 'lit';
import('@material/web/iconbutton/icon-button.js');
import {Tab} from '@material/web/tabs/internal/tab.js';
import {UICloseEvent} from '@lit-app/event';
type Constructor<T = {}> = new (...args: any[]) => T;
export declare class ClosableMixinInterface {
	// Define the interface for the mixin
	closeLabel: string
}
/**
 * ClosableMixin - A mixin that adds a close icon to a component.
 */
export const ClosableMixin = <T extends Constructor<Tab>>(superClass: T) => {

 
	class ClosableMixinClass extends superClass  {

		@property() closeLabel = 'close tab';
		@state() showCloseIcon = false;
	
		constructor(...para: any[]) {
			super();
			this.injectCloseIcon();
		}
	
		override firstUpdated(props: PropertyValues<this>) {
			const showCloseIcon = () => this.showCloseIcon = true;
			const hideCloseIcon = () => this.showCloseIcon = false;
			this.addEventListener('mouseenter', showCloseIcon);
			this.addEventListener('focus', showCloseIcon);
			this.addEventListener('mouseleave', hideCloseIcon);
			// 
			// this.addEventListener('blur', hideCloseIcon); 
			super.firstUpdated(props);
		}
		
		private injectCloseIcon() {
			const tpl = html`<md-icon-button .ariaLabel=${this.closeLabel}  @click=${this.closeTab} slot="icon"><lapp-icon>close</lapp-icon></md-icon-button>`
			render(tpl, this);

		}
		private closeTab(e: Event) {
			e.stopPropagation();
			this.dispatchEvent(new UICloseEvent());
		}
	

		protected override getContentClasses() {
			return {
				...super.getContentClasses(),
				'show-close-icon': this.showCloseIcon,
			};
		}

	};
	// Cast return type to your mixin's interface intersected with the superClass type
	return ClosableMixinClass as unknown as Constructor<ClosableMixinInterface> & T;
}

export default ClosableMixin;

