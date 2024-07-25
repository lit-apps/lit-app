import { css, LitElement, nothing } from "lit";
import { html, unsafeStatic } from 'lit/static-html.js'
import { property, state, query } from 'lit/decorators.js';
import { tooltip } from '@preignition/preignition-styles';
import('@material/web/iconbutton/outlined-icon-button.js');
import('@material/web/iconbutton/filled-icon-button.js');
import('@material/web/icon/icon.js');
import('@material/web/iconbutton/icon-button.js');
import('@material/web/button/outlined-button.js');
import('@material/web/button/filled-button.js');
import('@material/web/button/text-button.js');

interface CopyEventDetail {
  origin: Copy;
  content?: string;
}

type ButtonType = 'icon-button' | 'button'

/**
 * An element that copies content to the clipboard.
 *  
 * @fires content-copy - when content is being copied
 * @fires content-copied - when content is copied 
 * @fires content-copied-error - when content is not copied
 * @csspart button - The button
 */
export class Copy extends LitElement {
  static override styles = [
    tooltip,
    css`
    :host {
      display: inline-flex;
      align-items: center;
      --md-icon-button-icon-size: 28px;
    }
    [part=button] { 
      margin-left: var(--space-xx-small, 4px);
    }
  `];

  content!: string

  @state() _icon: string = 'content_copy';
  @property() label: string = 'copy to clipboard';
  @property() buttonType: ButtonType = 'icon-button';
  @property({ type: Boolean }) filled: boolean = false;
  @property({ type: Boolean }) outlined: boolean = false;
  @property({ type: Boolean }) disabled: boolean = false;

  @query('#copy') copySlot!: HTMLSlotElement;

  override render() {

    const tagVariant = this.filled ? 'filled-' : this.outlined ? 'outlined-' : this.buttonType === 'button' ? 'text-' : '';
    const tagName = this.buttonType === 'icon-button' ? `md-${tagVariant}icon-button` : `md-${tagVariant}button`;
    return html`
     <slot id="copy"></slot>
     <${unsafeStatic(tagName)} 
     part="button" 
     data-title="Copy to clipboard" 
     @click=${this.copy} 
     .disabled=${this.disabled}
     >
     ${this.buttonType === 'icon-button' ? '' : this.label}
      <lapp-icon slot=${this.buttonType === 'icon-button' ? nothing : 'icon'} .icon=${this._icon}></lapp-icon>
     </${unsafeStatic(tagName)}>
     `;
  }
  private _reset() {
    setTimeout(() => {
      this._icon = 'content_copy';
      this.dispatchEvent(new CustomEvent('content-copied-reset', { bubbles: true, composed: true }));
    }, 2000);
  }

  protected copy() {
    const event = new CustomEvent<CopyEventDetail>('content-copy', { detail: { origin: this }, bubbles: true, composed: true })
    if (this.dispatchEvent(event)) {
      const content = event.detail.content ? [event.detail.content] :
        this.content ? [this.content] :
          this.copySlot?.assignedNodes()?.map(getContent);

      copyText(content.join('\n'))
        .then(() => {
          this._icon = 'done';
          this._reset();
          this.dispatchEvent(new CustomEvent('content-copied', { detail: content, bubbles: true, composed: true }));
        })
        .catch(e => {
          this._icon = 'error';
          this._reset();
          this.dispatchEvent(new CustomEvent('content-copied-error', { detail: e, bubbles: true, composed: true }));
        });
    }
  }
}

function getContent(node: Node): string | null {
  if (node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement) {
    return node.value;
  } else if (node instanceof HTMLAnchorElement && node.hasAttribute('href')) {
    return node.href;
  } else {
    return node.textContent;
  }
}

function copyNode(node: HTMLElement) {
  if ('clipboard' in navigator) {
    return navigator.clipboard.writeText(node.textContent || '');
  }

  const selection = getSelection();

  if (selection == null) {
    return Promise.reject(new Error());
  }

  selection.removeAllRanges();
  const range = document.createRange();
  range.selectNodeContents(node);
  selection.addRange(range);
  document.execCommand('copy');
  selection.removeAllRanges();
  return Promise.resolve();
}

function copyText(text: string) {
  if ('clipboard' in navigator) {
    return navigator.clipboard.writeText(text);
  }

  const body = document.body;

  if (!body) {
    return Promise.reject(new Error());
  }

  const node = createNode(text);
  body.appendChild(node);
  copyNode(node);
  body.removeChild(node);
  return Promise.resolve();
}

function createNode(text: string) {
  const node = document.createElement('pre');
  node.style.width = '1px';
  node.style.height = '1px';
  node.style.position = 'fixed';
  node.style.top = '5px';
  node.textContent = text;
  return node;
}


