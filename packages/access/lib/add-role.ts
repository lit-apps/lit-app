import { EntityI } from '@lit-app/model/src/types/entity';
import { html, css, LitElement } from "lit";
import { when } from 'lit/directives/when.js';
import { property, state } from 'lit/decorators.js';
import { HTMLEvent } from '@lit-app/cmp/types';
import { AccessActionI,  Role } from '@lit-app/model';
import('@lit-app/cmp/user/card')
import('@lit-app/cmp/user/search')
import('@lit-app/cmp/user/name')
import('@material/web/button/outlined-button')
import('@material/web/button/filled-button')
import('@material/web/button/tonal-button')
import('@material/web/icon/icon')
import('@material/web/circularprogress/circular-progress')

/**
 *  Add user role for an entity
 */

export class AddRole  extends LitElement {

	static override styles = css`
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
			}
		`;
	
	/** uid of current user */	
	@property() label: string = 'Add Members'
	@property({type: Boolean}) canEdit = false;
	@property({attribute: false}) Entity!: typeof EntityI;
	@property({attribute: false}) languages: string[] = []; // for roles supporting languages (e.g. translator)
	
	@state() accessRole: Role['name'] | '' = ''; 
	@state() languageRole: string = ''; 
	@state() isEditing = false;
	@state() isLoading = false;						
	@state() newUid!: string;
	@state() newName!: string;

	get isLocaleRole() {
		return this.Entity.roles.find(role => role.name === this.accessRole)?.locale ;
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
		}

		const addRole = async () => {
			this.isLoading = true;
			if(!this.accessRole) return;
			const event = this.Entity.getEntityAction<AccessActionI>({
				data: {
					uid: this.newUid,
					role: this.accessRole as Role['name'],
					language: this.languageRole
				}
			}, 'addAccess')

			this.dispatchEvent(event);
			const promise = await event.detail.promise;
			this.isLoading = false;
		}

		const onValueChanged = (e: CustomEvent) => {
			this.newUid = e.detail.value;
			this.newName = e.detail.selectedText;
		}
		const onRoleSelected = (e: HTMLEvent<HTMLInputElement>) => {
			this.accessRole = e.target.value as Role['name']	;
		}
		const onLanguageRoleSelected = (e: HTMLEvent<HTMLInputElement>) => {
			this.languageRole = e.target.value;
		}

		const disabled = !this.newUid || !this.accessRole || (!!this.isLocaleRole && !this.languageRole);
		return html`
		<div class="layout">
			${this.isEditing ? 
				html`
					<md-outlined-button @click=${cancel}>
						Cancel
						<md-icon slot="icon">cancel</md-icon>
					</md-outlined-button>
					<lapp-user-search
						.loader=${this.Entity?.userLoader}
						@value-changed=${onValueChanged}
					></lapp-user-search>
					<mwc-select
						.label=${'Select Role'} 
						.value=${this.accessRole}
						@selected=${onRoleSelected}>
						${this.Entity?.roles.filter(role => role.level > 1).map(role => html`
							<mwc-list-item .value=${role.name}>
								${role.name}
							</mwc-list-item>
						`)}
					</mwc-select>
					${when(this.isLocaleRole, () => html`
					<mwc-select
						.label=${'Select Langauge'} 
						.value=${this.languageRole}
						@selected=${onLanguageRoleSelected}>
						${this.languages.map(lan => html`<mwc-list-item .value=${lan}>${lan}</mwc-list-item>`)}
					</mwc-select>
						`)}
					<md-filled-button 
						@click=${addRole} 
						.disabled=${disabled}>
						${disabled ? 
							'Select a User and a Role' :
							`Add ${this.newName || ''} as ${this.accessRole || ''} ${this.isLocaleRole ? `(${this.languageRole})` : ''}`
							}</lapp-user-name>
						${this.isLoading ? 
							html`<md-circular-progress></md-circular-progress>` :
							html`<md-icon slot="icon">person</md-icon>`
							}
					</md-filled-button>
					` :
				html`
					<md-outlined-button @click=${() => this.isEditing = true}>
						${this.label}
						<md-icon slot="icon">person</md-icon>
					</md-outlined-button>
					
					` 
			}
		</div>
		`
	}

}
