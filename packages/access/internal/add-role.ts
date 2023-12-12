import { EntityI } from '@lit-app/model/src/types/entity';
import { html, css, LitElement } from "lit";
import { when } from 'lit/directives/when.js';
import { property, state } from 'lit/decorators.js';
import { HTMLEvent } from '@lit-app/cmp/types';
import { AccessActionI, InviteActionI, Role } from '@lit-app/model';
import { icon } from '@preignition/preignition-styles';
import { LappUserSearch } from '@lit-app/cmp/user/search';
import { UserSearch } from '@lit-app/cmp/user/internal/search';
// import { invite, machineStateServer } from 'firebase-fsm'
import { ToastEvent } from '../../event';
import('@lit-app/cmp/user/search')
import('@lit-app/cmp/user/name')
import('@material/web/button/outlined-button')
import('@material/web/button/filled-button')
import('@material/web/button/filled-tonal-button')
import('@material/web/icon/icon')
import('@material/web/select/filled-select')
import('@material/web/select/select-option')
import('@material/web/progress/circular-progress')

/**
 *  Add user role for an entity
 */

export class AddRole extends LitElement {

	static override styles = [
		icon,
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
		`];

	/** uid of current user */
	@property() label: string = 'Add Members'
	@property({ type: Boolean }) canEdit = false;
	@property({ attribute: false }) Entity!: typeof EntityI;
	@property({ attribute: false }) languages: string[] = []; // for roles supporting languages (e.g. translator)

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


		const handlerFact = (action: 'addAccess' | 'invite') => async () => {
			this.isLoading = true;
			try {
				if (!this.accessRole) return;
				const event = this.Entity.getEntityAction<AccessActionI>({
					uid: this.newUid,
					role: this.accessRole as Role['name'],
					language: this.languageRole
				}, action)
				this.dispatchEvent(event);
				await event.detail.promise;
				this.isLoading = false;
				this.isEditing = false;
				this.dispatchEvent(new ToastEvent(`Access request processed with success`));
			} catch (error) {
				this.dispatchEvent(new ToastEvent(`There was an error while processing the access request: ${(error as Error).message}`  ,'error' ));
				this.isLoading = false;
				this.isEditing = false;
			}
		}

		const onUserChanged = (e: HTMLEvent<LappUserSearch>) => {
			this.newUid = e.target.value;
			this.isInviting = false;
			this.newName = e.target.selectedOptions[0]?.headline || '';
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
					<lapp-user-search
						.loader=${this.Entity?.userLoader}
						@change=${onUserChanged}
						@invite-email-changed=${onInviteEmailChanged}
					></lapp-user-search>
					<md-filled-select
						.label=${'Select Role'} 
						.value=${this.accessRole}
						@change=${onRoleSelected}>
						${this.Entity?.roles.filter(role => role.level > 1).map(role => html`
							<md-select-option .value=${role.name} ?selected=${role.name === this.accessRole}>
								<div slot="headline">${role.name}</div>
							</md-select-option>
						`)}
					</md-filled-select>
					${when(this.isLocaleRole, () => html`
					<md-filled-select
						.label=${'Select Langauge'} 
						.value=${this.languageRole}
						@change=${onLanguageRoleSelected}>
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
								html`<md-circular-progress></md-circular-progress>` :
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
								html`<md-circular-progress></md-circular-progress>` :
								html`<lapp-icon slot="icon">person</lapp-icon>`
							}
					</md-filled-button>`}
					` :
				html`
					<md-outlined-button @click=${() => this.isEditing = true}>
						${this.label}
						<lapp-icon slot="icon">person</lapp-icon>
					</md-outlined-button>
					
					`
			}
		</div>
		`
	}

}
