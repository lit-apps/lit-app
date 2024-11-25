import '@vaadin/grid/theme/material/vaadin-grid-filter-column.js';
import '@vaadin/grid/theme/material/vaadin-grid-selection-column.js';
import '@vaadin/grid/theme/material/vaadin-grid-sort-column.js';
import '@vaadin/grid/theme/material/vaadin-grid-tree-column.js';
import '@vaadin/grid/theme/material/vaadin-grid.js';
import { css, html, LitElement } from "lit";
import { property } from 'lit/decorators.js';
import { UserItem, UserItemRole, UserUidRoleT } from './types';

import { redispatchEvent } from '@material/web/internal/events/redispatch-event.js';
import {
	headerFilterText, bodyDate
} from '@preignition/preignition-util/src/directiveRenderer';

import activeItemChanged from '@preignition/preignition-util/src/grid/activeItemChanged';
import type { GridRowDetailsRenderer } from '@vaadin/grid';
import {
	columnBodyRenderer,
} from '@vaadin/grid/src/lit/column-renderer-directives.js';

import '../../dom/observer';
import '../card';

// TODO: this should come from machine def
type InviteT = any

/**
 *  An element to display a list of invite sent to users
 */

export class InviteList extends LitElement {

	static override styles = css`
			:host {
				display: contents;
			}
			vaadin-grid {
				flex: 1;
				min-height: var(--lapp-user-grid-min-height, 350px);
			}`;

	/** the  items to display on the list */
	@property({ attribute: false }) items!: InviteT[];

	/** a renderer for row details */
	@property({ attribute: false }) rowDetailsRenderer!: GridRowDetailsRenderer<InviteT>;

	override render() {
		const onSizeChanged = (e: Event) => redispatchEvent(this, e);

		return html`
      <vaadin-grid 
       	.rowDetailsRenderer=${this.rowDetailsRenderer}
       	.items=${this.items}
       	@size-changed=${onSizeChanged}
       	@active-item-changed=${activeItemChanged}>
      	<vaadin-grid-column flex-grow="2" header="Sent To" path="snapshot.context.recipientInfo.email"></vaadin-grid-column>
				<vaadin-grid-column flex-grow="1" header="Invite as Role" path="snapshot.context.role"></vaadin-grid-column>
      	<vaadin-grid-column flex-grow="1" header="Sent On" 
					${columnBodyRenderer(bodyDate((data) => data.metaData.timestamp))}
				></vaadin-grid-column>
      	<vaadin-grid-column flex-grow="1" header="Sent By " 
				${columnBodyRenderer(bodySentTo)}></vaadin-grid-column>
       <slot></slot>
      </vaadin-grid>
		`;
	}
}

const bodySentTo = (item: InviteT) => html`
		<lapp-user-card noninteractive .uid=${item.snapshot.context.uid}></lapp-user-card>
  
`;

