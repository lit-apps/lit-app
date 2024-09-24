import type { UserItemRole } from '@lit-app/cmp/user/internal/types';
import {
	Access,
	AccessActionI,
	ConsumeDataMixin,
	ConsumeEntityMixin,
	ConsumeEntityStatusMixin,
	ConsumeUidMixin,
	GetAccess,
	PartialBy,
	ProvideAccessMixin,
	RenderConfig,
	RenderHeaderMixin,
	entries
} from '@lit-app/model';
import { Where } from '@preignition/lit-firebase/src/types';
import '@preignition/lit-firebase/store';
import { LitElement, html } from "lit";
import {
	columnBodyRenderer,
} from 'lit-vaadin-helpers';
import { property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { ProvideUserAccessMixin } from './context-user-access-mixin';
import hasUserRole from './hasUserRole';
import { choose } from 'lit/directives/choose.js';
import { HTMLEvent } from '@lit-app/cmp/types';
import type { MdTabs } from '@material/web/tabs/tabs';
import('@material/web/chips/filter-chip.js')
import('@material/web/chips/chip-set.js')
import('@material/web/divider/divider.js')
import('@material/web/tabs/tabs.js')
import('@material/web/tabs/secondary-tab.js')
import('../set-role')
import('../add-role')
import('@lit-app/cmp/user/list')
import('@lit-app/cmp/user/invite-list')
import closest from '@lit-app/shared/closest';

type User = PartialBy<UserItemRole, 'provider' | 'created'>;

const getAccess: GetAccess = function (this: EntityAccess, access: Access, _data: any) {
	return {
		isOwner: hasUserRole('owner', access, this.uid),
		canEdit: hasUserRole('owner', access, this.uid) ||
			hasUserRole('admin', access, this.uid) ||
			import.meta.env.DEV,
		canDelete: false,
		canView: true,
	}
}
	

/**
 * An element that renders access utilities against an entity, 
 * like setOwner, addAccess, removeAccess, etc.
 * 
 */

export class EntityAccess extends
	ProvideAccessMixin(getAccess)(
		ConsumeEntityMixin(
			RenderHeaderMixin(
				ProvideUserAccessMixin(
					ConsumeDataMixin()(
						ConsumeEntityStatusMixin(
							ConsumeUidMixin(
								LitElement))))))) {

	private _users!: User[];

	@property() override icon = 'manage_accounts';
	@property() override heading = 'Members';
	@state() invite: any[] = [];
	@state() selected = 0

	get path() {
		// this is a temp hak to fetch the closest 'db-ref-entity' path
		// once stabilized, we would use @lit/context - but is needs to be in a @lit-app package (and not as firebase persistence)
		const ref = closest(this, 'db-ref-entity, db-ref');
		// @ts-expect-error - we know ref has path
		return ref?.path;
	}

	get hasInvite() {
		return this.invite?.length > 0;
	}

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
		const users: User[] = [];
		entries<Access['user']>(this.metaData?.access?.user || {})
			.forEach(([role, value]) => {
				const v = Array.isArray(value) ? value : [value];
				v.forEach((uid: string) => {
					const user = users.find((user) => user.uid === uid);
					if (!user) {
						const prevUser = prev?.find((user) => user.uid === uid);
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
		const where: Where[] = [{
			field: 'ref.machineId',
			op: '==',
			value: 'invite'
		}, {
			field: 'snapshot.context.targetRefOrPath',
			op: '==',
			value: this.path
		}, {
			field: 'snapshot.status',
			op: '==',
			value: 'active'
		}]
		return html`
		<lif-store
			.path=${'actor'}
			.where=${where}
			@data-changed=${(e: CustomEvent) => this.invite = e.detail.value}></lif-store>
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
		const currentOwner = this.metaData?.access?.user?.owner
		const hasOwner = Array.isArray(currentOwner) ? currentOwner.length > 0 : !!currentOwner;
		const hasOneOwner = Array.isArray(currentOwner) ? currentOwner.length === 1 : !!currentOwner;
		const bodyRole = (item: UserItemRole) => html`
		<md-chip-set>
			${item.roles.map(it => {
			const onActionRevoke = (e: CustomEvent) => {
				// console.log('onActionRevoke', e);
				e.preventDefault();
				const event = this.Entity.getEntityAction<AccessActionI>({
					uid: item.uid,
					role: it
				}, 'removeAccess')
				this.dispatchEvent(event);
			}
			const onClick = (e: CustomEvent) => {
				e.preventDefault();
			}
			const canEdit = it === 'owner' ? this.canEdit && !hasOneOwner : this.canEdit;
			return html`<md-filter-chip 
				@remove=${onActionRevoke}
				@click=${onClick}
				.removable=${canEdit}
				.label=${it}></md-filter-chip>`
		})}
		</md-chip-set>`;

		const userListTpl = html`<lapp-user-list
				.items=${this.users}>
				<vaadin-grid-column flex-grow="1" 
					.header=${'Role'}
					${columnBodyRenderer(bodyRole)}></vaadin-grid-column>
			</lapp-user-list>`

		const inviteListTpl = html`<lapp-invite-list
			.items=${this.invite}
			></lapp-invite-list>`
		const canSetOwnership = renderConfig.entityAccess?.isOwner || !hasOwner || this.superAdmin;
		const onChange = (e: HTMLEvent<MdTabs>) => {
			this.selected = e.target.activeTabIndex
		}
		return html`
		<section class="content">
			<h5 class="secondary">Ownership</h5>
			<lapp-access-set-role
				.label=${'Modify Ownership'}
				.accessRole=${'owner'}
				.uid=${currentOwner}
				.canEdit=${canSetOwnership}
				.Entity=${this.Entity}
			></lapp-access-set-role>
		</section>
		${when(renderConfig.entityAccess?.canEdit, () => html`
		<section class="content">
			<h5 class="secondary">Membership</h5>
			<lapp-access-add-role
				.label=${'Add Members'}
				.canEdit=${renderConfig.entityAccess.canEdit}
				.Entity=${this.Entity}
			></lapp-access-add-role>
		</section>`)}
		<md-divider class="m top bottom large"></md-divider>
		<section class="flex content layout vertical no-gap">
				${this.hasInvite ?
				html`<md-tabs 
						style="max-width: 400px;"
						.activeTabIndex=${this.selected} 
						@change=${onChange}>
					<md-secondary-tab>
						<lapp-icon slot="icon">groups</lapp-icon>
						Member List
					</md-secondary-tab>
					<md-secondary-tab>
						<lapp-icon slot="icon">send</lapp-icon>
						Pending Invite
					</md-secondary-tab>
				</md-tabs>
				${choose(this.selected, [
					[1, () => inviteListTpl]
				],
					() => userListTpl
				)}` :
				html`<h5 class="secondary">Member List</h5>${userListTpl}`}
				
		</section>
		`
	}

	protected renderFooter() {
		return html``
	}

}




