import {
	ProvideAccessMixin,
	ConsumeDataMixin,
	ConsumeEntityMixin,
	ConsumeEntityStatusMixin,
	RenderHeaderMixin,
	Access,
	RenderConfig,
	GetAccess,
	ConsumeUidMixin,
	AccessActionI,
	entries
} from '@lit-app/model';
import { html, LitElement } from "lit";
import { property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import hasUserRole from './hasUserRole';
import type { UserItem, UserItemRole } from '@lit-app/cmp/user/lib/types';
import {
	columnBodyRenderer,
} from 'lit-vaadin-helpers';
// import('@material/web/chips/filter-chip.js')
import('@material/web/chips/input-chip.js')
import('@material/web/chips/chip-set.js')
import('../set-role')
import('../add-role')
import('@lit-app/cmp/user/list')

const getAccess: GetAccess = {
	isOwner: function (this: EntityAccess, access: Access, _data: any) {
		return hasUserRole('owner', access, this.uid)
	},
	canEdit: function (this: EntityAccess, access: Access, _data: any) {
		return hasUserRole('owner', access, this.uid) ||
			hasUserRole('admin', access, this.uid) ||
			import.meta.env.DEV;
	},
	canDelete: false,
	canView: true,
};

/**
 * An element that renders access utilities against an entity, 
 * like setOwner, addAccess, removeAccess, etc.
 * 
 */

export class EntityAccess extends
	ProvideAccessMixin(
		ConsumeEntityMixin(
			RenderHeaderMixin(
				ConsumeDataMixin(
					ConsumeEntityStatusMixin(
						ConsumeUidMixin(
							LitElement))))), getAccess) {

	private _users!: UserItemRole[];

	@property() override icon = 'manage_accounts';
	@property() override heading = 'Members';

	get metaData() {
		return this.data?.metaData;
	}

	get roles() {
		return this.Entity?.roles;
	}

	get users() {
		// we cache users so that the grid can also cache user names
		const prev = this._users;
		// loop through all metaData roles and return users
		const users: UserItemRole[] = [];
		entries<Access['user']>(this.metaData?.access?.user || {})
			.forEach(([role, value]) => {
			const v = Array.isArray(value) ? value : [value];
			v.forEach((uid: string) => {
				const user = users.find((user: UserItemRole) => user.uid === uid);
				if (!user) {
					const prevUser = prev?.find((user: UserItemRole) => user.uid === uid);
					users.push({ uid, roles: [role], name: prevUser?.name });
				} else {
					user.roles.push(role);
				}

			})
		})

		this._users = users;

		return users
	}


	get renderConfig(): RenderConfig {
		return {
			entityAccess: this.entityAccess,
			entityStatus: this.entityStatus,
			level: this.level
		}
	}

	override render() {
		if (!this.Entity) {
			return html`getting Entity...`;
		}

		if (this.data === undefined) {
			return html`getting data...`;
		}

		return [
			super.render(),
			this.renderEntityAccess()
		]
	}

	protected renderEntityAccess() {
		return html`
			<slot name="header">
				${this.renderHeader(this.data, this.renderConfig)}
			</slot>
			<slot name="sub-header"></slot>
			<slot name="body">
				${this.renderBody(this.data, this.renderConfig)}
			</slot>
			<slot name="footer">
				${this.renderFooter()}
			</slot>
		`;
	}

	protected renderBody(_data: any, renderConfig: RenderConfig) {
		const currentOwner = this.metaData?.access?.user?.owner;

		const bodyRole = (item: UserItemRole) => html`
		<md-chip-set>
			${item.roles.map(it => {
			const onActionRevoke = (e: CustomEvent) => {
				// console.log('onActionRevoke', e);
				e.preventDefault();
				const event = this.Entity.getEntityAction<AccessActionI>({
					data: {
						uid: item.uid,
						role: it
					}
				}, 'removeAccess')
				this.dispatchEvent(event);

			}
			return html`<md-input-chip 
				@remove=${onActionRevoke}
				.disabled=${!this.canEdit} 
				.removable=${this.canEdit} 
				.label=${it}></md-input-chip>`
			})}
		</md-chip-set>`;

		return html`
		<section class="content">
			<h5 class="secondary">Ownership</h5>
			<lapp-access-set-role
				.label=${'Modify Ownership'}
				.accessRole=${'owner'}
				.uid=${currentOwner}
				.canEdit=${renderConfig.entityAccess.isOwner || !currentOwner}
				.Entity=${this.Entity}
			></lapp-access-set-role>
			
		</section>
		${when(renderConfig.entityAccess.canEdit, () => html`
		<section class="content">
			<h5 class="secondary">Membership</h5>
			<lapp-access-add-role
				.label=${'Add Members'}
				.canEdit=${renderConfig.entityAccess.canEdit}
				.Entity=${this.Entity}
			></lapp-access-add-role>
			</section>`)}
		<section class="flex content layout vertical no-gap">
			<h5 class="secondary">Member List</h5>
			<lapp-user-list
				.items=${this.users}
				.canEdit=${renderConfig.entityAccess.canEdit}
			>
			<vaadin-grid-column flex-grow="1" 
				.header=${'Role'}
        ${columnBodyRenderer(bodyRole)}
        ></vaadin-grid-column>
		</lapp-user-list>
			
		</section>
		`

	}
	protected renderFooter() {
		return html``
	}

}




