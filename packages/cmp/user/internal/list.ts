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
	headerFilterText
} from '@preignition/preignition-util/src/directiveRenderer';

import activeItemChanged from '@preignition/preignition-util/src/grid/activeItemChanged';
import type { GridCellClassNameGenerator, GridRowDetailsRenderer } from '@vaadin/grid';
import {
	columnBodyRenderer,
	columnHeaderRenderer
} from 'lit-vaadin-helpers';
import '../../dom/observer';
import '../card';

/**
 *  An element to display a list of users
 */

export class UserList extends LitElement {

	static override styles = css`
			:host {
				display: contents;
			}
			vaadin-grid {
				flex: 1;
			}
			lapp-user-card {
				margin-top: -8px;
				margin-bottom: -8px;
			}
				
		`;

	/** the  items to display on the list */		
	@property({attribute: false}) items!: UserItemRole[];

	/** a renderer for row details */
	@property({attribute: false}) rowDetailsRenderer!: GridRowDetailsRenderer<UserItem>;

	/** a renderer for row details */
	@property({attribute: false}) cellClassNameGenerator!: GridCellClassNameGenerator<UserItem>;

	override render() {
		const onSizeChanged = (e: Event) => redispatchEvent(this, e);
		
		return html`
      <vaadin-grid 
       .cellClassNameGenerator=${this.cellClassNameGenerator}
       .rowDetailsRenderer=${this.rowDetailsRenderer}
       .items=${this.items}
       @size-changed=${onSizeChanged}
       @active-item-changed=${activeItemChanged}>
      <vaadin-grid-column flex-grow="2" 
        ${columnHeaderRenderer(headerUserName)}
        ${columnBodyRenderer(bodyUserName)}
        ></vaadin-grid-column>
       <slot></slot>
      </vaadin-grid>
		`;
	}
}

const headerUserName = headerFilterText('name', 'user Name', true)
const bodyUserName = (item: UserItemRole  ) => html`
  <lapp-dom-observer @content-changed=${(e: CustomEvent) => {
		const target = e.target as HTMLElement;
		setTimeout(() => {
			item.name = target.innerText;
		}, 200)
		}}>
    <lapp-user-card noninteractive .uid=${item.uid}></lapp-user-card>
  </lapp-dom-observer> 
`;

