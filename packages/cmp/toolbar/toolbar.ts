import { html, css, LitElement, isServer, nothing } from "lit";
import { customElement, property, query, queryAssignedElements, state } from 'lit/decorators.js';
import { ListController, NavigableKeys } from "@material/web/list/internal/list-controller.js";
import type { IconButton } from "@material/web/iconbutton/internal/icon-button.js";
import '@material/web/iconbutton/icon-button.js'
import '@material/web/menu/menu.js'
import '@lit-app/cmp/icon/icon.js'
import { MdMenu } from "@material/web/menu/menu.js";
const NAVIGABLE_KEY_SET = new Set<string>(Object.values(NavigableKeys));

interface ToolbarItem extends IconButton {
}

/**
 *  A toolbar component, that wraps toolbar items when there is not enough space.
 * 
 * The toolbar component will look at `[data-toolbar]` attribute of its children to determine which items 
 * are toolbar items. When there is not enough space to display all items, the toolbar will create slot 
 * with names associated to the `[data-toolbar]`, so that items can be displayed in a menu.
 * 
 * @example
 * ```html
 * <lapp-toolbar>
 *  <md-icon-button data-toolbar="item1" aria-label="Item 1">
 *   <lapp-icon>format_bold</lapp-icon>
 * </md-icon-button>
 * <md-list-item slot="item1" aria-label="Item 2">
 *  <lapp-icon slot="start">format_bold</lapp-icon>
 *  <span slot="heading">Item 2</span>
 * </md-list-item>
 * 
 */
@customElement('lapp-toolbar')
export default class lappToolbar extends LitElement {

  static override styles = css`
      :host {
        position: relative;
        display: inline-flex;
        flex-wrap: wrap;
        height: 34px;
      }

      :host([wrapped]) {
        margin-right: 35px;
      }

      #more {
        position: absolute;
        right: -35px;
      }

      ::slotted(.wrapped) { 
        opacity: 0; 
        z-index: -1; 
       } 
    `;

  /**
   * An array of toolbar items. Queries every assigned
   * element that has the `data-toolbar` attribute.
   *
   * _NOTE:_ This is a shallow, flattened query via
   * `HTMLSlotElement.queryAssignedElements` and thus will _only_ include direct
   * children / directly slotted elements.
   */
  @queryAssignedElements({ flatten: true })
  protected slotItems!: Array<ToolbarItem | (HTMLElement & { item?: ToolbarItem })>;

  @property({ reflect: true, type: Boolean }) wrapped = false;
  @query('md-menu') menu!: MdMenu;
  @state() wrappedItems: string[] = [];

  get items() {
    return this.listController.items;
  }

  private readonly listController = new ListController<ToolbarItem>({
    isItem: (item: HTMLElement): item is ToolbarItem =>
      item.hasAttribute('data-toolbar') && !item.classList.contains('wrapped'),
    getPossibleItems: () => this.slotItems,
    isRtl: () => getComputedStyle(this).direction === 'rtl',
    deactivateItem: (item) => {
      item.tabIndex = -1;
    },
    activateItem: (item) => {
      item.tabIndex = 0;
    },
    isNavigableKey: (key) => NAVIGABLE_KEY_SET.has(key),
    isActivatable: (item) => !item.disabled,
  });

  private readonly internals =
    (this as HTMLElement).attachInternals();

  constructor() {
    super();
    this.internals.role = 'toolbar';
    const resizeObserver = new ResizeObserver(() => this.updateWrappedItems());
    resizeObserver.observe(this);
    if (!isServer) {
      this.addEventListener('keydown', this.listController.handleKeydown);
    }
  }

  protected override render() {
    const onClick = (e: Event) => {
      e.stopPropagation();
      this.menu.show();
    }

    return html`
      <slot
      @deactivate-items=${this.listController.onDeactivateItems}
      @request-activation=${this.listController.onRequestActivation}
      @slotchange=${this.listController.onSlotchange}></slot>
      </slot>
      ${this.wrapped ? html`
      <md-icon-button id="more" @click=${onClick}>
        <lapp-icon>more_horiz</lapp-icon>
      </md-icon-button>
      <md-menu quick anchor="more">
        <slot name="menu-start"></slot>
        ${[...this.wrappedItems].reverse().map(i => html`<slot name="${i}"></slot>`)}
        <slot name="menu-end"></slot>
      </md-menu>
      ` : nothing}
    `;
  }

  /**
   * Activates the next item in the list. If at the end of the list, the first
   * item will be activated.
   *
   * @return The activated list item or `null` if there are no items.
   */
  activateNextItem(): ToolbarItem | null {
    return this.listController.activateNextItem();
  }

  /**
   * Activates the previous item in the list. If at the start of the list, the
   * last item will be activated.
   *
   * @return The activated list item or `null` if there are no items.
   */
  activatePreviousItem(): ToolbarItem | null {
    return this.listController.activatePreviousItem();
  }


  private updateWrappedItems() {
    if (!this.slotItems || this.slotItems.length === 0) return;

    const firstItemTop = this.slotItems[0].offsetTop;
    let wrapped = false;

    this.slotItems.forEach(item => {
      // we use a threshold of 16px because some items already have an offset, for instance align-self: center
      if (item.offsetTop - firstItemTop > 16) {
        wrapped = true;
        item.classList.add('wrapped');
        if (item.hasAttribute('data-toolbar')) {
          this.wrappedItems.push(item.dataset.toolbar!);
          this.wrappedItems = [...new Set(this.wrappedItems)];
        }
      } else {
        item.classList.remove('wrapped');
        if (item.hasAttribute('data-toolbar')) {
          this.wrappedItems = this.wrappedItems.filter(i => i !== item.dataset.toolbar);
        }
      }
    });
    this.wrapped = wrapped;
    // this.listController.items;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-toolbar': lappToolbar;
  }
}
