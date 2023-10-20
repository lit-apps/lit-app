import { html, css, LitElement } from "lit";
import { customElement, property, state } from 'lit/decorators.js';
import AbstractEntity from './abstract-entity-element';
import RenderHeaderMixin from '../mixin/render-header-mixin';



/**
 *  
 */

export default class EntityDelete  extends RenderHeaderMixin(AbstractEntity) {

	override icon: string = 'dangerous';
	override heading: string = 'Danger Zone';

	get deleted() {
		return this.data?.metaData?.deleted;
	}

	// renderTitle(data: any, config: any) {
	// 	return html`Danger Zone: ${data?.name ?? 'loading ...'}`
	// }

	protected override renderEntity(entity: Entity) {
		return html`
			<slot name="header">
				${this.renderHeader(this.data, this.renderConfig)}
			</slot>
			<slot name="sub-header"></slot>
			<slot name="body">
				${this.renderBody(entity)}
			</slot>
			
		`;
	}

	override renderBody(entity: Entity) {
		return html`
			<p>This is a danger zone</p>
			<section class="content ">
				${this.deleted ? 
					html`<p>Mark ${this.data?.name} as  deleted</p>
					${this.entity.renderAction('restore', entity)}
					` : 
					html`<p>${this.data?.name} has been deleted</p>
					${this.entity.renderAction('delete', entity)}`
				}
				
			</section>
		`
	}

}

