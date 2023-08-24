import { EntityI } from '@lit-app/model/src/types/entity';
import { html, css, LitElement } from "lit";
import { when } from 'lit/directives/when.js';
import { AccessActionI,  Role } from '@lit-app/model';
import { property, state } from 'lit/decorators.js';
import {icon} from '@preignition/preignition-styles';
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

export class SetRole  extends LitElement {

	static override styles = [
		icon, 
		css`
			:host {
				display: flex;
				flex-direction: column;
				gap: var(--space-medium);
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
		`];
	
	/** uid of current user */
	@property() uid!: string;	
	@property() label: string = 'Set Ownership'
	@property({type: Boolean}) canEdit = false;
	@property() accessRole: Role['name']  = 'owner'; 
	@property({attribute: false}) Entity!: typeof EntityI;
	
	@state() isEditing = false;			
	@state() isLoading = false;			
	@state() newUid!: string;
	@state() newName!: string;

	override render() {
		return html`
		<lapp-user-card noninteractive .uid=${this.uid}></lapp-user-card>
		${when(this.canEdit, () => this.renderEdit())}`;
	}

	renderEdit() {
		const cancel = () => {
			this.newUid = '';
			this.newName = '';
			this.isEditing = false;
		}

		const setAccess = async () => {
			this.isLoading = true;
			const event = this.Entity.getEntityAction<AccessActionI>({
				uid: this.newUid,
				role: this.accessRole as Role['name']
				
			}, 'setAccess')
			
			this.dispatchEvent(event);
			await event.detail.promise;
			this.isLoading = false;
		}	

		const onValueChanged = (e: CustomEvent) => {
			this.newUid = e.detail.value;
			this.newName = e.detail.selectedText;
		}

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
						@value-changed=${onValueChanged}
					></lapp-user-search>
					<md-filled-button @click=${setAccess} .disabled=${!this.newUid}>
						set ${this.newName || ''} as ${this.accessRole}</lapp-user-name>
						${this.isLoading ? 
							html`<md-circular-progress></md-circular-progress>` :
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

