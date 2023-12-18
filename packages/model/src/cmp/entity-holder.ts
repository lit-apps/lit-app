import { adoptStyles, html, PropertyValues } from "lit";
import { property } from 'lit/decorators.js';
import Entity from '../entityAbstract';

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

	override get renderConfig(): RenderConfig {
		return {
			...super.renderConfig,			
			variant: this.variant,
			layout: this.layout
		}
	}


	protected override setEntity(E: typeof Entity) {
		// const E = Entity as unknown as typeof Entity
		super.setEntity(E)
		/** Handle Styles */
		if (this.Entity?.styles) {
			const root = this.renderRoot as ShadowRoot
			const styles = Array.isArray(this.Entity.styles) ? this.Entity.styles : [this.Entity.styles]
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

	protected override renderEntity(entity: Entity, config?: RenderConfig) {
		return html`
			<slot name="header">
				${this.renderHeader(entity, config)}
			</slot>
			<slot name="sub-header"></slot>
			<slot name="body">
				${this.renderBody(entity, config)}
			</slot>
			<slot name="footer">
				${this.renderFooter(entity, config)}
			</slot>
		`;
	}


}
