// import { EntityI } from '@lit-app/model/src/types/entity';
import { UserSearch } from '@lit-app/cmp/user/internal/search';
import '@lit-app/cmp/user/name';
import '@lit-app/cmp/user/search';
import '@lit-app/cmp/user/select-item';
import { Role } from '@lit-app/model';
import { EntityI } from '@lit-app/model/src/types';
import { HTMLEvent } from '@lit-app/shared/types';
import { LitElement, css, html } from "lit";
import { property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
// import { invite, machineStateServer } from '@lit-app/firebase-fsm'
import { ToastEvent } from '@lit-app/shared/event';
import { ConsumeUserAccessMixin } from './context-user-access-mixin';
import('@lit-app/cmp/user/search')
import('@lit-app/cmp/user/name')
import('@material/web/button/outlined-button.js')
import('@material/web/button/filled-button')
import('@material/web/button/filled-tonal-button')
import('@material/web/icon/icon')
import('@material/web/select/filled-select')
import('@material/web/select/select-option')
import('@material/web/progress/circular-progress.js')
/**
 *  Add user role for an entity
 */

export class AddRole extends ConsumeUserAccessMixin(LitElement) {

	static override styles = [
		css`
			:host {
				display: flex;
				flex-direction: column;
				gap: var(--space-medium);
				--_width: var(--user-card-width, 380px);
				
			}
			
			lapp-user-search {
				width: var(--_width);
			}

			.layout {
				display: flex;
				flex-wrap: wrap;
				flex-direction: row;
				gap: var(--space-medium);
				min-height: 56px; 
				align-items: center;
				flex-wrap: wrap;
			}
			md-filled-button md-circular-progress {
   		 --md-sys-color-primary: var(--color-on-primary);
  		}
		`];

	/** uid of current user */
	@property() label: string = 'Add Members'
	@property({ type: Boolean }) canEdit = false;
	@property({ attribute: false }) Entity!: EntityI;
	@property({ attribute: false }) languages: string[] = []; // for roles supporting languages (e.g. translator)
	@property()

	@state() accessRole: Role['name'] | '' = '';
	@state() languageRole: string = '';
	@state() isEditing = false;
	@state() isInviting = false; // true when inviting a user
	@state() isLoading = false;
	@state() newUid!: string;
	@state() newName!: string;

	get isLocaleRole() {
		return this.Entity.roles.find(role => role.name === this.accessRole)?.locale;
	}

	override render() {
		return html`
		${when(this.canEdit, () => this.renderEdit())}`;
	}

	renderEdit() {
		const cancel = () => {
			this.newUid = '';
			this.newName = '';
			this.accessRole = '';
			this.isEditing = false;
			this.isInviting = false;
		}


		const handlerFact = (action: 'addAccess' | 'invite') => async (e: CustomEvent) => {

			this.isLoading = true;
			try {
				if (!this.accessRole) return;
				const actionHandler = this.Entity.actionHandler(action, this, {
					uid: this.newUid,
					role: this.accessRole as Role['name'],
					language: this.languageRole
				});
				await actionHandler(e);
				this.isLoading = false;
				this.isEditing = false;
				this.dispatchEvent(new ToastEvent(`Access request processed with success`));
			} catch (error) {
				this.dispatchEvent(new ToastEvent(`There was an error while processing the access request: ${(error as Error).message}`, 'error'));
				this.isLoading = false;
				this.isEditing = false;
			}
		}

		const onUserChanged = (e: HTMLEvent<UserSearch>) => {
			this.newUid = e.target.value;
			this.isInviting = false;
			this.newName = e.target.selectedOptions[0]?.displayText || '';
		}
		const onRoleSelected = (e: HTMLEvent<HTMLInputElement>) => {
			this.accessRole = e.target.value as Role['name'];
		}
		const onLanguageRoleSelected = (e: HTMLEvent<HTMLInputElement>) => {
			this.languageRole = e.target.value;
		}
		const onInviteEmailChanged = (e: HTMLEvent<UserSearch>) => {
			this.newName = this.newUid = e.target.inviteEmail;
			this.isInviting = true;
		}
		const disabled = !this.newUid || !this.accessRole || (!!this.isLocaleRole && !this.languageRole);
		return html`
		<div class="layout">
			${this.isEditing ?
				html`
					<md-outlined-button @click=${cancel}>
						Cancel
						<lapp-icon slot="icon">cancel</lapp-icon>
					</md-outlined-button>
					${this.Entity?.userLoader ?
						html`<lapp-user-search
							.loader=${this.Entity?.userLoader}
							@change=${onUserChanged}
							@invite-email-changed=${onInviteEmailChanged}
						></lapp-user-search>` :
						html`<md-filled-select
							.label=${'select user'}
							.value=${this.newUid}
							@change=${onUserChanged}
							quick
							>
							${this.accessUsers?.map(user => html`
								<lapp-user-select-item .value=${user.uid} .selected=${this.newUid === user.uid} .uid=${user.uid}>
									<lapp-user-name slot="headline" .uid=${user.uid}></lapp-user-name>  
							</lapp-user-select-item>
							`)}
						</md-filled-select>`}
					<md-filled-select
						.label=${'Select Role'} 
						.value=${this.accessRole}
						@change=${onRoleSelected}
						quick>
						${this.Entity?.roles.filter(role => role.level > 1).map(role => html`
							<md-select-option .value=${role.name} ?selected=${role.name === this.accessRole}>
								<div slot="headline">${role.name}</div>
							</md-select-option>
						`)}
					</md-filled-select>
					${when(this.isLocaleRole, () => html`
					<md-filled-select
						.label=${'Select Language'} 
						.value=${this.languageRole}
						@change=${onLanguageRoleSelected}
						quick>
						${this.languages.map(lan => html`<md-select-option .value=${lan} ?selected=${lan === this.languageRole}>
							<div slot="headline">${lan}</div>
						</md-select-option>`)}
					</md-filled-select>
						`)}
						${this.isInviting ?
						html`<md-filled-button 
						@click=${handlerFact('invite')} 
						.disabled=${disabled}>
						${disabled ?
								`Invite ${this.newName || 'a User'} (set a Role)` :
								`Invite ${this.newName || ''} as ${this.accessRole || ''} ${this.isLocaleRole ? `(${this.languageRole})` : ''}`
							}</lapp-user-name>
						${this.isLoading ?
								html`<md-circular-progress indeterminate slot="icon"></md-circular-progress>` :
								html`<lapp-icon slot="icon">contact_mail</lapp-icon>`
							}
					</md-filled-button>` :
						html`<md-filled-button 
						@click=${handlerFact('addAccess')} 
						.disabled=${disabled}>
						${disabled ?
								'Select a User and a Role' :
								`Add ${this.newName || ''} as ${this.accessRole || ''} ${this.isLocaleRole ? `(${this.languageRole})` : ''}`
							}</lapp-user-name>
						${this.isLoading ?
								html`<md-circular-progress indeterminate slot="icon"></md-circular-progress>` :
								html`<lapp-icon slot="icon">person</lapp-icon>`
							}
					</md-filled-button>`}
					` :
				html`
					<md-outlined-button @click=${() => this.isEditing = true}>
						${this.label}
						<lapp-icon slot="icon">person_add</lapp-icon>
					</md-outlined-button>
					
					`
			}
		</div>
		`
	}

}
