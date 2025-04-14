import { ToastEvent } from '@lit-app/shared/event/index.js';
import '@material/web/button/outlined-button.js';
import { html } from "lit";
import { customElement, property, query } from 'lit/decorators.js';
import '../../entity-create-dialog.js';
import { LappEntityCreateDialog } from "../../entity-create-dialog.js";
import { entityI, RenderConfig } from '../types';
import AbstractEntity from './abstract-entity-element';
import { entityCreateDialogEvent } from "./entity-create-dialog.js";

/**
 * Entity Creator component
 * 
 * This component handles the creation of new entities:
 * 1. Renders a create button
 * 2. Opens a dialog with form when clicked
 * 3. Creates entity on form submission
 * 
 * @example
 * ```html
 * <lapp-entity-creator 
 *   entity="product"
 *   button-text="Create Product"
 *   button-icon="add">
 * </lapp-entity-creator>
 * ```
 */

@customElement('lapp-entity-creator')
export default class EntityCreator extends AbstractEntity {
  /**
   * Text to display on the create button
   */
  @property() label = 'Create New';

  /**
   * Icon to display on the create button
   */
  @property() icon = 'add';

  /**
   * Dialog title
   */
  @property({ attribute: 'dialog-title' }) dialogTitle = '';

  /**
   * Dialog title
   */
  @property({ attribute: 'dialog-label' }) dialogLabel = '';


  /**
   * Additional creation options
   */
  @property({ type: Object }) options = {};


  @query('#dialog') dialog!: LappEntityCreateDialog;


  /**
   * Open the creation dialog
   */
  private _openDialog() {
    this.dialog.show();
  }

  /**
   * Handle form submission and create entity
   */
  private async _handleCreate(e: entityCreateDialogEvent) {
    if (!this.Entity) return;
    let title
    try {
      const { data, entity } = e.detail
      title = entity.title || 'Item';
      const event = entity.create(data)
      await event.detail.promise
      // console.log('promise', promise)
      this.dispatchEvent(new ToastEvent(`new ${title} created with success`));
      // TODO: redirect to new blog
    } catch (e) {
      this.dispatchEvent(new ToastEvent(`There was an error while creating the new ${title} (${(e as Error).message})`, 'error'))
      return;
    }
  }

  /**
   * Render the create button
   */
  private _renderCreateButton() {
    return html`
      <md-outlined-button 
        @click=${this._openDialog}
        class="create-button">
        ${this.icon ? html`<lapp-icon slot="icon">${this.icon}</lapp-icon>` : ''}
        ${this.label}
      </md-outlined-button>
    `;
  }

  /**
   * Render the creation dialog
   */
  private _renderDialog(entity: entityI, config?: RenderConfig) {
    const title = this.dialogTitle || (entity.title ? `Create New ${entity.title}` : 'Create New Item');
    const label = this.dialogLabel || (entity.title ? `Create ${entity.title}` : 'Create Item');

    return html`
      <lapp-entity-create-dialog 
        .createLabel=${label}
        @entity-create-ok=${this._handleCreate}
      
        id="dialog">
        <div slot="headline">
          <slot slot="headline" name="headline">
            <div>${title}</div>
          </slot>
        </div>
        <div slot="content">
          <slot slot="content" name="content"></slot>
        </div>
      </lapp-entity-create-dialog>
    `;
  }

  protected override renderEntity(entity: entityI, config?: RenderConfig) {
    return html`
      ${this._renderCreateButton()}
      ${this._renderDialog(entity, config)}
    `;
  }
}

