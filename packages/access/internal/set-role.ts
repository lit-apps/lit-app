import '@lit-app/cmp/user/name';
import '@lit-app/cmp/user/search';
import { LappUserSearch } from '@lit-app/cmp/user/search';
import '@lit-app/cmp/user/select-item';
import { Role } from '@lit-app/model';
import { EntityI } from '@lit-app/model/src/types';
import { HTMLEvent } from '@lit-app/shared/types';
import { css, html, LitElement } from "lit";
import { property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { ConsumeUserAccessMixin } from './context-user-access-mixin';
import('@lit-app/cmp/user/card')
import('@lit-app/cmp/user/search')
import('@lit-app/cmp/user/name')
import('@material/web/button/outlined-button')
import('@material/web/button/filled-button')
import('@material/web/button/filled-tonal-button')
import('@material/web/icon/icon')
import('@material/web/progress/circular-progress')

/**
 *  Set the role of an entity
 */

export class SetRole extends ConsumeUserAccessMixin(LitElement) {

	static override styles = [
		css`
			:host {
				display: flex;
				flex-direction: column;
				--_width: var(--user-card-width, 380px);
				
			}
			lapp-user-card {
				max-width: var(--_width);
			}

			lapp-user-search {
				width: var(--_width);
			}

			.layout {
				display: flex;
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
	@property() uid!: string;
	@property() label: string = 'Set Ownership'
	@property({ type: Boolean }) canEdit = false;
	@property() accessRole: Role['name'] = 'owner';
	@property({ attribute: false }) Entity!: EntityI;

	@state() isEditing = false;
	@state() isLoading = false;
	@state() newUid!: string;
	@state() newName!: string;

	override render() {
		return html`
		<lapp-user-card .uid=${this.uid}></lapp-user-card>
		${when(this.canEdit, () => this.renderEdit())}`;
	}

	renderEdit() {
		const cancel = () => {
			this.newUid = '';
			this.newName = '';
			this.isEditing = false;
		}

		const setAccess = async (e: CustomEvent) => {
			this.isLoading = true;
			const onActionClick = this.Entity.onActionClick('setAccess', this, {
				uid: this.newUid,
				role: this.accessRole as Role['name']
			});
			await onActionClick(e);
			this.isLoading = false;
		}

		const onUserChanged = (e: HTMLEvent<LappUserSearch>) => {
			this.newUid = e.target.value;
			this.newName = e.target.selectedOptions[0]?.displayText || '';
		}

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
				
					<md-filled-button @click=${setAccess} .disabled=${!this.newUid}>
						set ${this.newName || ''} as ${this.accessRole}</lapp-user-name>
						${this.isLoading ?
						html`<md-circular-progress indeterminate></md-circular-progress>` :
						html`<lapp-icon slot="icon">person</lapp-icon>`
					}
					</md-filled-button>
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

