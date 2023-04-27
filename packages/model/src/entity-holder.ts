import { html, LitElement, PropertyValues } from "lit";
import { customElement, property, state } from 'lit/decorators.js';
import Entity from './entity';
import { ConsumeEntityMixin } from './mixin/context-entity-mixin';
import { ConsumeAccessMixin } from './mixin/context-access-mixin';
import { ConsumeEntityStatusMixin } from './mixin/context-entity-status-mixin';
import { ConsumeDataMixin } from './mixin/context-data-mixin';

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

	@property() icon!: string;
	@property() heading!: string;

	// true to make input  fields write real-time changes
	@property({type: Boolean}) realTime = false

	// when true, will listen to action events on the element
	@property({type: Boolean}) listenOnAction = false

	
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

	renderEntity(entity: Entity) {
		return html`
			<div>
				Entity is there
			</div>
		`;
	}
	// override connectedCallback() {
	// 	super.connectedCallback();
		
	// }
	// override disconnectedCallback() {
	// 	super.disconnectedCallback();
		
	// }
}

declare global {
	interface HTMLElementTagNameMap {
		'entity-holder': entityHolder;
	}
}
