import { LitElement, html, css, PropertyValues, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { ExpansionPanel } from '../container/expansion-panel';

/**
 * A custom element implementing the accordion widget: a vertically stacked set of expandable panels
 * that wraps several instances of the `<expansion-panel>` element. Only one panel can be opened
 * (expanded) at a time.
 *
 * Panel headings function as controls that enable users to open (expand) or hide (collapse) their
 * associated sections of content. The user can toggle panels by mouse click, Enter and Space keys.
 *
 * The component supports keyboard navigation and is aligned with the
 * [WAI-ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.1/#accordion).
 *
 * @element fancy-accordion
 *
 * @slot - Slot fot panel elements.
 *
 * @fires opened-index-changed - Event fired when changing currently opened panel.
 */
@customElement('lapp-accordion')
export class Accordion extends LitElement {
  /**
   * Index of the currently opened panel. By default all the panels are closed.
   * Only one panel can be opened at the same time. Setting `null` or `undefined`
   * closes all the accordion panels.
   */
  @property({ type: Number, attribute: 'opened-index' })
  openedIndex: number | null | undefined = null;

  protected _items: ExpansionPanel[] = [];

  private _boundOnOpened = this._onOpened.bind(this) as EventListener;

  static override styles = css`
      :host {
        display: block;
      }

      :host([hidden]) {
        display: none !important;
      }

      ::slotted([opened]:not(:first-child)) {
        margin-top: 16px;
      }

      ::slotted([opened]:not(:last-child)) {
        margin-bottom: 16px;
      }

      ::slotted(:not([opened])) {
        position: relative;
      }

      ::slotted(:not([opened]))::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: 1px;
        opacity: 1;
        z-index: 1;
        background-color: rgba(0, 0, 0, 0.12);
      }
    `;

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }

  protected override firstUpdated(): void {
    this.addEventListener('keydown', (e) => this._onKeydown(e));

    Array.from(this.children).forEach((node) => {
      if (node instanceof ExpansionPanel) {
        this._items.push(node);
        node.addEventListener('opened-changed', this._boundOnOpened);
      }
    });
  }

  override willUpdate(props: PropertyValues): void {
    if (props.has('openedIndex') && this._items) {
      const item =
        this.openedIndex == null ? null : this._items[this.openedIndex];
      this._items.forEach((el) => {
        el.opened = el === item;
      });
    }
  }

  get focused(): Element | null {
    const root = this.getRootNode();
    return (root as unknown as DocumentOrShadowRoot).activeElement;
  }

  private _onKeydown(event: KeyboardEvent): void {
    const target = event.composedPath()[0] as Element;
    if (target.getAttribute('part') !== 'header') {
      return;
    }
    const key = event.key.replace(/^Arrow/, '');
    const currentIdx = this._items.indexOf(this.focused as ExpansionPanel);
    let idx;
    let increment;
    switch (key) {
      case 'Up':
        increment = -1;
        idx = currentIdx - 1;
        break;
      case 'Down':
        increment = 1;
        idx = currentIdx + 1;
        break;
      case 'Home':
        increment = 1;
        idx = 0;
        break;
      case 'End':
        increment = -1;
        idx = this._items.length - 1;
        break;
      default:
    }
    idx = this._getAvailableIndex(idx, increment);
    if (idx >= 0) {
      this._items[idx].focus();
      this._items[idx].setAttribute('focus-ring', '');
      event.preventDefault();
    }
  }

  private _getAvailableIndex(index?: number, increment?: number): number {
    const total = this._items.length;
    let idx = index;
    for (
      let i = 0;
      typeof idx === 'number' && i < total;
      i++, idx += increment || 1
    ) {
      if (idx < 0) {
        idx = total - 1;
      } else if (idx >= total) {
        idx = 0;
      }
      const item = this._items[idx];
      if (!item.disabled) {
        return idx;
      }
    }
    return -1;
  }

  private _onOpened(e: CustomEvent): void {
    const target = e.composedPath()[0] as ExpansionPanel;
    const idx = this._items.indexOf(target);
    if (e.detail.value) {
      if (target.disabled || idx === -1) {
        return;
      }

      this.openedIndex = idx;
      this._notifyOpen();

      this._items.forEach((item) => {
        if (item !== target && item.opened) {
          item.opened = false;
        }
      });
    } else if (!this._items.some((item) => item.opened)) {
      this.openedIndex = undefined;
      this._notifyOpen();
    }
  }

  private _notifyOpen(): void {
    this.dispatchEvent(
      new CustomEvent('opened-index-changed', {
        detail: {
          value: this.openedIndex
        }
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-accordion': Accordion;
  }
}