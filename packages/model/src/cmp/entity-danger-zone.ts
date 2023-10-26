import { html, css, LitElement } from "lit";
import { customElement, property, state } from 'lit/decorators.js';
import AbstractEntity from './abstract-entity-element';
import RenderHeaderMixin from '../mixin/render-header-mixin';

import('@material/web/list/list')
import('@material/web/list/list-item')



/**
 *  
 */

export default class EntityDangerZone  extends RenderHeaderMixin(AbstractEntity) {

	override icon: string = 'dangerous';
	override heading: string = 'Danger Zone';

	get deleted() {
		return this.data?.metaData?.deleted;
	}

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

		const name = this.data?.name || 'this entity';

		const restoreTemplate = html`
				<md-list-item	>
					<div slot="headline">Restore</div>
					<div slot="supporting-text">${name} has been deleted. Restore it</div>
					<span slot="end">${this.entity.renderAction('restore', this.data)}</span>
					</md-list-item>`

		const deleteTemplate = html`
				<md-list-item	>
					<div slot="headline">Delete</div>
					<div slot="supporting-text">Mark ${name} as deleted.</div>
					<span slot="end">${this.entity.renderAction('markDeleted', this.data)}</span>
				</md-list-item>`
		return html`
			<p>Advanced or admin actions for <span class="badge">${name}.</span></p>
			<section class="content ">
				<md-list class="outlined">
					
				${this.deleted ? restoreTemplate : deleteTemplate}
				<md-divider></md-divider>
				<md-list-item	disabled>
					<div slot="headline">Transfer Ownership</div>
					<div slot="supporting-text">Make another user the owner of ${name}</div>
					<span slot="end">
						<md-outlined-button ><lapp-icon slot="icon">supervised_user_circle</lapp-icon>Transfer Ownership</md-outlined-button>
					</span>
				</md-list-item>
				</md-list>
			</section>
		`
	}

}

