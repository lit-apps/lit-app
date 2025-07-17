import { adoptStyles, html, PropertyValues } from "lit";
import { property } from 'lit/decorators.js';
import { entityI, EntityI } from '../types';

import { RenderConfig } from '../types/entity';

import { Edit, Reset, Write } from '../events';
import AbstractEntity from './abstract-entity-element';

/**
 *  Base Class holding an Entity
 */
export default class EntityHolder extends AbstractEntity {

	/** 
	 * variant for rendering process 
	 */
	@property() variant: RenderConfig['variant'] = 'default'
	@property() layout: RenderConfig['layout'] = 'horizontal'
	@property({ reflect: true }) context: RenderConfig['context'] = 'default'
	@property({ type: Boolean }) isNew: boolean = false
	@property({ attribute: 'base-url' }) baseURL: string = ''

	override get renderConfig(): RenderConfig {
		return {
			...super.renderConfig,
			context: this.context,
			variant: this.variant,
			layout: this.layout,
			baseURL: this.baseURL,
		}
	}

	protected override setEntity(E: EntityI) {

		super.setEntity(E)

		/** Handle Styles */
		if (this.Entity?.styles) {
			const root = this.renderRoot as ShadowRoot
			const styles = Array.isArray(this.Entity.styles)
				? this.Entity.styles
				: [this.Entity.styles]
			adoptStyles(
				root,
				[...root.adoptedStyleSheets, ...styles]
			)
		}
	};

	override firstUpdated(props: PropertyValues) {
		super.firstUpdated(props);
		// without requesting Updates, renderFIeld templates will not be updated when data changes
		this.addEventListener(Reset.eventName, () => this.requestUpdate());
		this.addEventListener(Edit.eventName, () => this.requestUpdate());
		this.addEventListener(Write.eventName, () => this.requestUpdate());
	}

	protected override renderEntity(entity: entityI, config?: RenderConfig) {
		const isEmptyArray = Array.isArray(this.data) && this.data.length === 0
		return html`
			<slot name="header">
				${this.renderHeader(entity, config)}
			</slot>
			<slot name="sub-header">
				${this.renderSubHeader(entity, config)}
			</slot>
			<slot name="body">
				${this.renderBody(entity, config)}
			</slot>
			<slot name="footer">
				${this.renderFooter(entity, config)}
			</slot>
			<slot name="footer-${isEmptyArray ? 'no-data' : 'data'}"></slot>
		`;
	}

	// entity holder might be focused in grid details. We need a way to pass focus to the first input
	override focus(): void {
		const focus = this.renderRoot.querySelector('*[focus-on-activate]') as HTMLInputElement;
		if (focus) {
			focus.focus();
		}
	}
}
