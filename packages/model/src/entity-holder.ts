import { html, LitElement, PropertyValues } from "lit";
import { customElement, property, state } from 'lit/decorators.js';
import Entity from './entity';
import { ConsumeEntityMixin } from './mixin/context-entity-mixin';
import { ConsumeAccessMixin } from './mixin/context-access-mixin';
import { ConsumeEntityStatusMixin } from './mixin/context-entity-status-mixin';
import { ConsumeDataMixin } from './mixin/context-data-mixin';
import { RenderConfig } from './types/entity';

/**
 *  Base Class holding an Entity
 */
@customElement('entity-holder')
export default class entityHolder extends 
	ConsumeEntityMixin(
		ConsumeAccessMixin(
			ConsumeDataMixin(
				ConsumeEntityStatusMixin(LitElement)))) {


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
			this.entity = new this.Entity(this, this.realTime, this.listenOnAction)
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
			<slot>
				${this.renderBody(entity)}
			<slot>
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
