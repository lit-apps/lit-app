import { AppDialogOkEventFactory } from '@lit-app/shared/event/app-dialog-ok.js';

import { alignIcon, typography } from "@lit-app/shared/styles/index.js";
import '@material/web/button/filled-button.js';
import { MdDialog } from "@material/web/dialog/dialog.js";
import { css, html, LitElement } from "lit";
import { customElement, query, state } from 'lit/decorators.js';



// import { typography, alignIcon } from '@preignition/preignition-styles';
/**
 *  A component to handle the app survey upgrade process.
 */

@customElement('cmp-app-survey-downgrade')
export default class cmpAppSurveyDowngrade extends LitElement {

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

  @query('md-dialog') dialog!: MdDialog;
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
        console.log('Proceeding with the downgrade...');

        // Create a promise that will be resolved by the parent component
        let resolveUpgrade: (value: boolean) => void;
        let rejectUpgrade: (reason?: any) => void;

        const upgradePromise = new Promise<boolean>((resolve, reject) => {
          resolveUpgrade = resolve;
          rejectUpgrade = reject;
        });

        // Dispatch the event with the promise resolvers
        const upgradeEvent = new UpgradeDialogOkEvent({
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

    return html`
      <p><lapp-icon>info</lapp-icon>You are currently using the preview version of the Survey Application.</p>
      <p>Downgrade to set reset the legacy application as the default application.</p>
      <md-filled-button @click=${open}>
        <lapp-icon slot="icon">settings_backup_restore</lapp-icon>
        Downgrade
      </md-filled-button>
      <md-dialog @close=${onClose}>
        <span slot="headline">
        <lapp-icon style="color: var(--color-primary); --md-icon-size: 42px;">settings_backup_restore</lapp-icon>
        <span style="flex: 1;">Reset Legacy application</span>
      </span>
        <form id="form-upgrade" method="dialog" slot="content">
          <p>
            Proceeding with the downgrade will reset the legacy version as your default version. 
          </p>
          <p>
            It will be possible to upgrade again to the new version at any time.
          </p>
        </form>
        <div slot="actions"> 
          <md-outlined-button 
            ?disabled=${this.upgrading}
            form="form-upgrade"
            value="close">Cancel</md-outlined-button>
          <md-filled-button 
            .disabled=${this.upgrading}
            form="form-upgrade"
            value="ok">
            ${this.upgrading ? 'Downgrading...' : 'Proceed with the Downgrade'}
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
    'cmp-app-survey-downgrade': cmpAppSurveyDowngrade;
  }
}

export const UpgradeDialogOkEvent = AppDialogOkEventFactory<{
  resolve: (value: boolean) => void;
  reject: (reason?: any) => void;
}>()
export type upgradeDialogOkEvent = InstanceType<typeof UpgradeDialogOkEvent>
