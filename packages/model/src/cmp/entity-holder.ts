import { adoptStyles, html, PropertyValues } from "lit";
import { property } from 'lit/decorators.js';
import Entity from '../entity';

import { RenderConfig } from '../types/entity';

import { Edit, Reset, Write } from '../events';
import abstractEntity from './abstract-entity-element';

/**
 *  Base Class holding an Entity
 */
export default class EntityHolder extends abstractEntity {


	/** 
	 * variant for rendering process 
	 */
	@property({ type: String }) variant: RenderConfig['variant'] = 'default'

	override get renderConfig(): RenderConfig {
		return {
			...super.renderConfig,			
			variant: this.variant
		}
	}


	protected override setEntity(E: typeof Entity) {
		// const E = Entity as unknown as typeof Entity
		super.setEntity(E)
		/** Handle Syles */
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

	protected override renderEntity(entity: Entity) {
		return html`
			<slot name="header">
				${this.renderHeader(entity)}
			</slot>
			<slot name="sub-header"></slot>
			<slot name="body">
				${this.renderBody(entity)}
			</slot>
			<slot name="footer">
				${this.renderFooter(entity)}
			</slot>
		`;
	}


}
