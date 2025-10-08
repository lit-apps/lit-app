import { AppDialogOkEventFactory } from '@lit-app/shared/event/app-dialog-ok.js';

import { databases, databaseMulti } from '@lit-app/shared/config/database.js';
import { alignIcon, typography } from "@lit-app/shared/styles/index.js";
import { HTMLEvent } from "@lit-app/shared/types.js";
import '@material/web/button/filled-button.js';
import { MdDialog } from "@material/web/dialog/dialog.js";
import { APP_CONTACT } from "@preignition/preignition-config";
import { css, html, LitElement } from "lit";
import { customElement, property, query, state } from 'lit/decorators.js';



// import { typography, alignIcon } from '@preignition/preignition-styles';
/**
 *  A component to handle the app survey upgrade process.
 */

@customElement('cmp-app-survey-upgrade')
export default class cmpAppSurveyUpgrade extends LitElement {

  static override styles = [
    typography,
    alignIcon,
    css`
      :host {
        display: block;
      }
      p lapp-icon  {
        color: var(--md-sys-color-outline);
      }  
      `];

  @property({ type: Boolean }) readonly: boolean = false;
  @query('md-dialog') dialog!: MdDialog;
  @property() databaseId = '';
  @state() private upgrading = false;

  override render() {
    const open = () => this.dialog.open = true;
    const onClose = async (e: CustomEvent) => {
      if (this.dialog.returnValue === 'ok') {

        if (this.upgrading) {
          return; // Already processing
        }
        // Prevent dialog from closing immediately
        e.preventDefault();

        this.upgrading = true;
        console.log('Proceeding with the upgrade...');

        // Create a promise that will be resolved by the parent component
        let resolveUpgrade: (value: boolean) => void;
        let rejectUpgrade: (reason?: any) => void;

        const upgradePromise = new Promise<boolean>((resolve, reject) => {
          resolveUpgrade = resolve;
          rejectUpgrade = reject;
        });

        // Dispatch the event with the promise resolvers
        const upgradeEvent = new UpgradeDialogOkEvent({
          databaseId: this.databaseId,
          resolve: resolveUpgrade!,
          reject: rejectUpgrade!
        });


        try {
          this.dispatchEvent(upgradeEvent);
          // Wait for the upgrade to complete
          const success = await upgradePromise;
          if (success) {
            // Close the dialog only after successful upgrade
            this.dialog.close();
          }
        } catch (error) {
          console.error('Upgrade failed:', error);
        } finally {
          this.upgrading = false;
        }
      } else {
        console.log('Upgrade cancelled');
      }
    };
    const onInput = (e: HTMLEvent<HTMLSelectElement>) => {
      this.databaseId = e.target.value;
    }
    return html`
      <p><lapp-icon>info</lapp-icon>The new version of the Survey Application is ready for preview.</p>
      <p>It brings significant benefits, including: improved user interface, choice on data storage location, or content generation through large language models.</p>
      <md-filled-button @click=${open}>
        <lapp-icon slot="icon">shift</lapp-icon>
        Upgrade 
      </md-filled-button>
      <md-dialog @close=${onClose}>
        <span slot="headline">
        <lapp-icon style="color: var(--color-primary); --md-icon-size: 42px;">upgrade</lapp-icon>
        <span style="flex: 1;">Upgrade Survey Application</span>
      </span>
        <form id="form-upgrade" method="dialog" slot="content">
          <p>
            Proceeding with the upgrade will set the new version as your default version. It will still be possible to access and use the legacy version  until 1st August 2026.
          </p>
          <p>
            You can still upgrade if you have existing live surveys in the legacy version. 
          </p>
            Choose the storage location for your survey data with care as this cannot be changed once set. Multi-region databases are better suited for global surveys. Single-Country databases are better suited when it is important that data residency requirements are met. 
          <p>
            Migration of existing surveys will be be handled on demand.
          </p>
          <p>If you encounter any issues or have questions, please contact us at <a href="mailto:${APP_CONTACT}">${APP_CONTACT}</a></p>
          <md-filled-select 
					quick
          required
					.label=${'Storage Location'}
					.supportingText=${`Data Storage Location for respondent data. This cannot be changed once set for a Customer.`}
					.value=${this.databaseId || 'multi-us-nam5'} 
          .disabled=${this.readonly || this.upgrading}
					@input=${onInput}>
          <md-item>
						<div slot="headline">Multi-Region locations</div>
						<div slot="supporting-text">Data is replicated in multiple regions - best suited for when respondent are scattered across the globe.</div>
					</md-item>
					${databaseMulti.map(item => html`
					<md-select-option value=${item[0]} ?selected=${item[0] === this.databaseId}>
						<div slot="headline">${item[1]}</div>
						<div slot="supporting-text">${item[2]}</div>
					</md-select-option>
					`)}
					<md-divider></md-divider>
					<md-item>
						<div slot="headline">Regional locations</div>
						<div slot="supporting-text">Data stays in a single location. Best suited for when respondents are located in a specific area.</div>
					</md-item>
					${databases.map(item => html`
					<md-select-option value=${item[0]} ?selected=${item[0] === this.databaseId}>
						<div slot="headline">${item[1]}</div>
					</md-select-option>`)}
				</md-filled-select>
        </form>
        <div slot="actions"> 
          <md-outlined-button 
            ?disabled=${this.upgrading}
            form="form-upgrade"
            value="close">Cancel</md-outlined-button>
          <md-filled-button 
            .disabled=${!this.databaseId || this.upgrading}
            form="form-upgrade"
            value="ok">
            ${this.upgrading ? 'Upgrading...' : 'Proceed with the Upgrade'}
          </md-filled-button>
        </div>
      </md-dialog>
    `;
  }
  // override connectedCallback() {
  //   super.connectedCallback();

  // }
  // override disconnectedCallback() {
  //   super.disconnectedCallback();

  // }
}

declare global {
  interface HTMLElementTagNameMap {
    'cmp-app-survey-upgrade': cmpAppSurveyUpgrade;
  }
}

export const UpgradeDialogOkEvent = AppDialogOkEventFactory<{
  databaseId: string;
  resolve: (value: boolean) => void;
  reject: (reason?: any) => void;
}>()
export type upgradeDialogOkEvent = InstanceType<typeof UpgradeDialogOkEvent>
