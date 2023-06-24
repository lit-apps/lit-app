import { html, LitElement, PropertyValues, adoptStyles } from "lit";
import { property, state } from 'lit/decorators.js';
import Entity from './entity';
import { ConsumeEntityMixin } from './mixin/context-entity-mixin';
import { ConsumeAccessMixin } from './mixin/context-access-mixin';
import { ConsumeEntityStatusMixin } from './mixin/context-entity-status-mixin';
import { ConsumeDataMixin } from './mixin/context-data-mixin';
import { RenderConfig } from './types/entity';

import { camelToDash } from '@preignition/preignition-util';
import { Strings } from './types';
import { Reset, Edit, Write } from './events'


/**
 * This event is fired to trigger the main application hoist an element
 */
export class entityEvent extends CustomEvent<Entity> {
	static readonly eventName = 'entity-ready';
	constructor(entity: Entity) {
		super(entityEvent.eventName, {
			composed: true,
			detail: entity
		});
	}
}

declare global {
	interface HTMLElementEventMap {
		'Entity': entityEvent,
	}
}

/**
 *  Base Class holding an Entity
 */
export class EntityHolder extends
	ConsumeEntityMixin(
		ConsumeAccessMixin(
			ConsumeDataMixin(
				ConsumeEntityStatusMixin(LitElement)))) {

	// setLocale must be set to handle translations
	declare setLocale: (entityName: string, locale: Strings) => void;

	@state() entity!: Entity;

	@property() heading!: string;

	/**
	 * The level at which this entity should be rendered.
	 * 1: default - highest level;  title of entity will be h2
	 * 2: title of entity will be h3
	 * 3: no title
	 */
	@property({ type: Number }) level: number = 1;

	// true to make input  fields write real-time changes
	@property({ type: Boolean }) realTime = false

	// when true, will listen to action events on the element
	@property({ type: Boolean }) listenOnAction = false

	get renderConfig(): RenderConfig {
		return {
			entityAccess: this.entityAccess,
			entityStatus: this.entityStatus,
			level: this.level
		}
	}

	protected override willUpdate(props: PropertyValues<this>) {
		if (props.has('Entity')) {

			const E = this.Entity as unknown as typeof Entity
			this.entity = new E(this, this.realTime, this.listenOnAction)

			/** Handle Syles */
			if (this.Entity?.styles) {
				const root = this.renderRoot as ShadowRoot
				const styles = Array.isArray(this.Entity.styles) ? this.Entity.styles : [this.Entity.styles]
				adoptStyles(
					root,
					[...root.adoptedStyleSheets, ...styles]
				)
			}

			/** Handle Localization */
			if (this.Entity.locale && this.setLocale) {
				this.setLocale(camelToDash(this.Entity.entityName), this.Entity.locale);
			}

			// notify entity is ready
			this.dispatchEvent(new entityEvent(this.entity))

			if (import.meta.env.DEV) {
				this.setAttribute('entity-name', this.Entity.entityName)
			}

		}

		if (props.has('realTime') && this.entity) {
			this.entity.realTime = this.realTime
		}
		if (props.has('listenOnAction') && this.entity) {
			// TODO: activate listeners
			this.entity.listenOnAction = this.listenOnAction
		}
		super.willUpdate(props);
	}

	override render() {
		if (!this.entity) {
			return html`getting entity...`;
		}

		if (this.data === undefined) {
			return html`getting data...`;
		}

		return [
			super.render(),
			this.renderEntity(this.entity)
		]
	}

	override firstUpdated(props: PropertyValues) {
		super.firstUpdated(props);
		// without requesting Updates, renderFIeld templates will not be updated when data changes
		this.addEventListener(Reset.eventName, () => this.requestUpdate());
		this.addEventListener(Edit.eventName, () => this.requestUpdate());
		this.addEventListener(Write.eventName, () => this.requestUpdate());
	}

	protected renderEntity(entity: Entity) {
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
	protected renderHeader(entity: Entity) {
		return entity.renderHeader(this.data, this.renderConfig);
	}
	protected renderBody(entity: Entity) {
		return entity.renderBody(this.data, this.renderConfig);
	}
	protected renderFooter(entity: Entity) {
		return entity.renderFooter(this.data, this.renderConfig);
	}

}
