import { html, css, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import userMixin from './user-mixin.js';
import '../img.js';
import '@preignition/lit-firebase/span';
import type {LifSpan} from '@preignition/lit-firebase/span';
import { MdListItem } from '@material/web/list/list-item.js';
import { HTMLEvent } from '../../types.js';
import { classMap } from 'lit/directives/class-map.js';
import('@material/web/list/list-item.js');


/**
 *  A card widget to display user information
 */

export class UserCard extends userMixin(MdListItem) {

  static override styles = [
    ...MdListItem.styles,
    css`
    :host {
      display: flex;
    }

    [data-variant="avatar"] {
      margin-inline-start: var(--_list-item-leading-element-leading-space);
      display: inline-flex;
      justify-content: center;
      align-items: center;
      background-color: var(--_list-item-leading-avatar-color);
      height: var(--_list-item-leading-avatar-size);
      width: var(--_list-item-leading-avatar-size);
      border-radius: var(--_list-item-leading-avatar-shape);
      color: var(--_list-item-leading-avatar-label-color);
      font: var(--_list-item-leading-avatar-label-type);
  }
    `];

  @property() email!: string | undefined;
  
  private get _labelText() {
    return this.renderRoot?.querySelector('.label-text')?.textContent;
  }
  private get _supportingText() {
    return this.renderRoot?.querySelector('.supporting-text')?.textContent;
  }
  // Note(CG): we need this so as to make lapp-user-card work within lapp-content-observer
  override get innerText() {
    const text = [this._labelText, this._supportingText].filter(d => d);
    return (text.length) ? text[0] + (text[1] ? ` (${text[1]})` : '') :
      'loading ...';
  }

  // Note(CG): we need this so as to make lapp-user-card work within lapp-content-observer
  // TODO: MD3 - review if this is still necessary
  get text() {
    return this.innerText;
  }

  protected override renderStart() {
    return html`
    <div class="start"><slot name="start">
      <lapp-user-img part="img" data-variant="avatar" .uid=${this.uid}></lapp-user-img>
    </slot></div>`;
  }

    /**
   * Handles rendering the headline and supporting text.
   */
   protected override renderBody() {
      const supportingText = this.renderSupportingText();

      const headline = this.headline ? this.headline : html`<lif-span .path=${this.namePath}></lif-span>`;
    
      return html`<div class="body"
        ><span class="label-text">${headline}</span>${supportingText}</div>`;
    }

   /**
   * Renders the one-line supporting text.
   */
  protected override renderSupportingText() {
    const supportingText = this.supportingText ? this.supportingText : 
      this.email ? html`<span part="email">${this.email}</span>` :
      html`<lif-span 
        @error=${(e: HTMLEvent<LifSpan> ) => e.target.valueController.value = ''}
        part="email" .defaultValue=${'no email'} .path=${this.emailPath}></lif-span>`
    return html`<span
        class="supporting-text ${classMap(this.getSupportingTextClasses())}"
      >${supportingText}</span>`;
  }
    

}
