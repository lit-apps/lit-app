import { html, LitElement, PropertyValues, adoptStyles } from "lit";
import { customElement, property, state } from 'lit/decorators.js';
import Entity from './entity';
import { ConsumeEntityMixin } from './mixin/context-entity-mixin';
import { ConsumeAccessMixin } from './mixin/context-access-mixin';
import { ConsumeEntityStatusMixin } from './mixin/context-entity-status-mixin';
import { ConsumeDataMixin } from './mixin/context-data-mixin';
import { RenderConfig } from './types/entity';
import { form, styleTypography, accessibility } from '@preignition/preignition-styles';


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
@customElement('entity-holder')
export default class entityHolder extends 
	ConsumeEntityMixin(
		ConsumeAccessMixin(
			ConsumeDataMixin(
				ConsumeEntityStatusMixin(LitElement)))) {

	static override styles = [
		styleTypography,		
		accessibility,
		form
	]

	@state() entity!: Entity;

	@property() heading!: string;

	/**
	 * The level at which this entity should be rendered.
	 * 1: default - highest level;  title of entity will be h2
	 * 2: title of entity will be h3
	 * 3: no title
	 */
	@property() level: number = 1;

	// true to make input  fields write real-time changes
	@property({type: Boolean}) realTime = false

	// when true, will listen to action events on the element
	@property({type: Boolean}) listenOnAction = false

	get renderConfig(): RenderConfig {
		return {
			entityAccess: this.entityAccess,
			entityStatus: this.entityStatus,
			level: this.level
		}
	}
	
	protected override willUpdate(props: PropertyValues){
		if(props.has('Entity')) {

			const E = this.Entity as unknown as typeof Entity
			this.entity = new E(this, this.realTime, this.listenOnAction)
			if(this.Entity?.styles) {
				const root = this.renderRoot as ShadowRoot
				const styles = Array.isArray(this.Entity.styles) ? this.Entity.styles : [this.Entity.styles]
				adoptStyles(
					root, 
					[...root.adoptedStyleSheets,  ...styles] 
					)
			}
			// notify entity is ready
			this.dispatchEvent(new entityEvent(this.entity))
			
			if(import.meta.env.DEV) {
				this.setAttribute('entity-name', this.Entity.entityName)
			}

		}
		if(props.has('realtime') && this.entity) {
			this.entity.realTime = this.realTime
		}
		if(props.has('listenOnAction') && this.entity) {
			// TODO: activate listeners
			this.entity.listenOnAction = this.listenOnAction
		}
		super.willUpdate(props);
	}

	override render() {
		if (!this.entity) {
			return html`getting entity...`;
		}
		
		if (!this.data) {
			return html`getting data...`;
		}

		return [
			super.render(),
			this.renderEntity(this.entity)
		]
	}

	protected renderEntity(entity: Entity) {
		return html`
			<slot name="header">
				${this.renderHeader(entity)}
			</slot>
			<slot name="subHeader"></slot>
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
		return entity.renderFooter(this.data,  this.renderConfig);
	}

}

declare global {
	interface HTMLElementTagNameMap {
		'entity-holder': entityHolder;
	}
}