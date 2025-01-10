import camelToDash from "@lit-app/shared/camelToDash.js";

import { TemplateResult } from 'lit';
import { html, LitElement, PropertyValues } from "lit";
import { property, state } from 'lit/decorators.js';
import { entityI, EntityI } from '../types';
import { ConsumeAccessMixin } from '../mixin/context-access-mixin';
import { ConsumeDataMixin } from '../mixin/context-data-mixin';
import { ConsumeDocIdMixin } from '../mixin/context-doc-id-mixin';
import { ConsumeEntityMixin } from '../mixin/context-entity-mixin';
import { ConsumeEntityStatusMixin } from '../mixin/context-entity-status-mixin';
import { Strings } from '../types';
import { RenderConfig, RenderConfigOptional } from '../types/entity';
import { ConsumeAppIdMixin } from "../mixin/context-app-id-mixin.js";

/**
 * This event is fired to trigger the main application hoist an element
 */
export class entityEvent extends CustomEvent<entityI> {
	static readonly eventName = 'entity-ready';
	constructor(entity: entityI) {
		super(entityEvent.eventName, {
			composed: true,
			detail: entity
		});
	}
}
/**
 *  Abstract Class for entity holders
 */
export default abstract class AbstractEntityElement extends
	ConsumeEntityMixin(
		ConsumeAccessMixin(
			ConsumeAppIdMixin(
				ConsumeDataMixin()(
					ConsumeDocIdMixin(
						ConsumeEntityStatusMixin(LitElement)))))) {

	// setLocale must be set to handle translations
	declare setLocale: (entityName: string, locale: Strings) => void;

	@state() entity!: entityI;

	/**
	 * The entity class to override the default entity (inherited from context)
	 * this is useful when we do not want to consume the entity from context
	 */
	@property({ attribute: false }) useEntity!: EntityI;

	@property() heading!: string;

	// when true, will listen to action events on the element
	// @property({ type: Boolean }) listenOnAction = false

	// true to make input  fields write real-time changes
	@property({ type: Boolean }) realTime = false

	/**
	 * The level at which this entity should be rendered.
	 * 1: default - highest level;  title of entity will be h2
	 * 2: title of entity will be h3
	 * 3: no title
	 */
	@property({ type: Number }) level: number = 1;

	@property({ attribute: false }) entityRenderOptions!: RenderConfigOptional;

	/**
	 * The render mode for the entity
	 * 
	 * It affects how renderField is processed.
	 * 
	 * view: view mode
	 * edit: edit mode
	 * translate: translate mode
	 * print: print mode
	 * default is edit	
	 */
	@property() consumingMode: RenderConfig['consumingMode'] = 'edit';

	get renderConfig(): RenderConfig {
		return {
			authorization: this.authorization,
			entityStatus: this.entityStatus,
			heading: this.heading,
			level: this.level,
			consumingMode: this.consumingMode,
			$id: this.docId,
			...this.entityRenderOptions,
		}
	}

	protected override willUpdate(props: PropertyValues<this>) {
		if (props.has('Entity') || props.has('useEntity')) {
			this.setEntity(this.useEntity || this.Entity)
		}
		if (props.has('realTime') && this.entity) {
			this.entity.realTime = this.realTime
		}
		// if (props.has('listenOnAction') && this.entity) {
		// 	// TODO: activate listeners
		// 	this.entity.listenOnAction = this.listenOnAction
		// }
		super.willUpdate(props);
	}
	/**
 * @returns the form element for the entity (either renderForm or renderFormNew)
 */
	get entityForm(): HTMLFormElement | null {
		return this.renderRoot?.querySelector('#entityForm');
	}

	/**
	 * whether the form containing the entity data-entry (either renderForm or renderFormNew)
	 * is valid, without reporting the validity of the form elements
	 * @returns boolean
	 */
	isFormValid(): boolean {
		return [...(this.entityForm?.elements || [])].every(
			(el) => (el as HTMLFormElement).validity?.valid !== false
		);
	}

	protected setEntity(E: EntityI) {
		this.entity = new E(this, this.realTime)

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

		// if (this.data === undefined && this.consumingMode !== 'print' && this.consumingMode !== 'offline') {
		// 	return html`getting data...`;
		// }

		return [
			super.render(),
			this.renderEntity(this.entity, this.renderConfig)
		]
	}

	/**
	 * renderEntity is called when entity is ready
	 */
	protected abstract renderEntity(entity: entityI, config?: RenderConfig): TemplateResult;

	protected renderHeader(entity: entityI, config?: RenderConfig) {
		return entity.renderHeader(this.data, config || this.renderConfig);
	}
	protected renderSubHeader(entity: entityI, config?: RenderConfig) {
		return entity.renderSubHeader(this.data, config || this.renderConfig);
	}
	protected renderBody(entity: entityI, config?: RenderConfig) {
		return entity.renderBody(this.data, config || this.renderConfig);
	}
	protected renderFooter(entity: entityI, config?: RenderConfig) {
		return entity.renderFooter(this.data, config || this.renderConfig);
	}
}