import { camelToDash } from '@preignition/preignition-util';
import { TemplateResult } from 'lit';
import { html, LitElement, PropertyValues } from "lit";
import { property, state } from 'lit/decorators.js';
import Entity from '../entity';
import { ConsumeAccessMixin } from '../mixin/context-access-mixin';
import { ConsumeDataMixin } from '../mixin/context-data-mixin';
import { ConsumeEntityMixin } from '../mixin/context-entity-mixin';
import { ConsumeEntityStatusMixin } from '../mixin/context-entity-status-mixin';
import { Strings } from '../types';
import { RenderConfig } from '../types/entity';

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
 *  Abstract Class for entity holders
 */

export default abstract class AbstractEntityElement extends
	ConsumeEntityMixin(
		ConsumeAccessMixin(
			ConsumeDataMixin(
				ConsumeEntityStatusMixin(LitElement)))) {

	// setLocale must be set to handle translations
	declare setLocale: (entityName: string, locale: Strings) => void;

	@state() entity!: Entity;

	/**
	 * The entity class to override the default entity (inherited from context)
	 * this is useful when we do not want to consume the entity from context
	 */
	@property({ attribute: false }) useEntity!: typeof Entity;

	@property() heading!: string;

	// when true, will listen to action events on the element
	@property({ type: Boolean }) listenOnAction = false

	// true to make input  fields write real-time changes
	@property({ type: Boolean }) realTime = false

	/**
	 * The level at which this entity should be rendered.
	 * 1: default - highest level;  title of entity will be h2
	 * 2: title of entity will be h3
	 * 3: no title
	 */
	@property({ type: Number }) level: number = 1;

	get renderConfig(): RenderConfig {
		return {
			entityAccess: this.entityAccess,
			entityStatus: this.entityStatus,
			level: this.level,
		}
	}

	protected override willUpdate(props: PropertyValues<this>) {
		if (props.has('Entity') || props.has('useEntity')) {
			this.setEntity(this.useEntity || this.Entity as unknown as typeof Entity)
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
	protected setEntity(E: typeof Entity) {
		// const E = Entity as unknown as typeof Entity
		this.entity = new E(this, this.realTime, this.listenOnAction)


		/** Handle Localization */
		if (this.Entity.locale && this.setLocale) {
			this.setLocale(camelToDash(this.Entity.entityName), this.Entity.locale);
		}

		// notify entity is ready
		this.dispatchEvent(new entityEvent(this.entity))

		if (import.meta.env.DEV) {
			this.setAttribute('entity-name', this.Entity.entityName)
		}
	};

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

	/**
	 * renderEntity is called when entity is ready
	 */
	protected abstract renderEntity(entity: Entity): TemplateResult;

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
