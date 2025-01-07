import { LitElement, html, css, PropertyValues } from 'lit';
import '@vaadin/grid/lit-all-imports.js'
import { customElement, property, query, state } from 'lit/decorators.js';
import { MdDialog } from '@material/web/dialog/dialog.js';
import { HTMLEvent } from '@lit-app/shared/types.js';
import { Grid } from '@vaadin/grid/lit-all-imports.js';
import { LappImage } from '@lit-app/cmp/media/image';
import('./image')
import('./lazy-image')

import('@material/web/button/filled-button.js');
import('@material/web/button/outlined-button.js');
import('@material/web/dialog/dialog.js');

type ItemT = {
  src: string;
  thumbnail: string;
}

@customElement('lapp-media-gallery')
export default class Gallery extends LitElement {
  static override styles = css`
      :host {
        display: block;
        max-height: var(--lapp-media-gallery-max-height, 600px);
        min-height: var(--lapp-media-gallery-min-height, 600px);
        overflow-y: auto;
        overflow-x: hidden;
        position: relative;
        min-width: 500px;
      }

      #container {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        height: 100%;
      }

      lapp-lazy-image {
        max-width: var(--lapp-media-gallery-max-width);
        width: var(--lapp-media-gallery-width, 200px);
        height: var(--lapp-media-gallery-height, 200px);
        margin: 4px;
        flex-grow: 1;
        cursor: pointer;
      }
      
      lapp-lazy-image[hasSelection]:not([selected]) {
        opacity: 0.6;
      }

      lapp-lazy-image[selected] {
        outline: var(--color-primary) solid 3px;
      }

      .flame {
        fill-opacity: 0.3;
        fill: var(--color-primary);
      }

      circle {
        fill: var(--color-secondary-text);
        fill-opacity: 0.2;
      }

      #defs {
        display: none;
      }
      
      svg[name=placeholder] {
         background-color: var(--color-surface);
      }  
      
      #toolbar {
        padding: 4px 0 ;
        opacity: 0;
        transition: opacity var(--transition-quickly);
      }

      #toolbar[hasSelection] {
        opacity: 1;
      }

      .toolbar {
        display: flex;
      }
      
      .flex {
        flex: 1;
      }

      .icon {
        position: absolute;
        cursor: pointer;
        top: 50%;
        margin-top: -45px;
        transition: opacity var(--transition-quickly);
        fill: white;
        width: 42px;
        height: 42px;
        opacity: 0.8;
        background-color: var(--color-accent, rgba(0,0,0,0.7));
        border-radius: 50%;
        box-shadow: var(--material-shadow-elevation-24dp);
      }

      .icon:hover {
        opacity: 1;
      }

      .chevron.right {
        right: 24px;
      }

      .chevron.left {
        left: 24px;
      }

      lapp-image {
        width: 100%; 
        height: 100%; 
        max-width: 900px;
        min-height: 400px;
      }
      `

  @property() viewType: 'image' | 'table' = 'image';
  @property({ type: Number }) imageHeight: number = 200;
  @property({ type: Boolean }) multi!: boolean;
  @property({ attribute: false }) items: ItemT[] = [];
  @property({ type: Boolean }) readonly: boolean = false;
  @property({ type: Boolean }) noToolbar: boolean = false;

  @state() selected: ItemT | undefined;
  @state() selectedItems: ItemT[] = [];
  @state() previousPlaceholder!: string;

  @query('md-dialog') dialog!: MdDialog;
  @query('#slotContainer') slotContainer!: HTMLSlotElement;
  @query('#slotPlaceholder') slotPlaceholder!: HTMLSlotElement;



  override render() {
    return html`
      <slot name="placeholder" id="slotPlaceholder"></slot>
      <svg id="defs">
        <defs>
           <g id="placeholder-svg" transform="" class="transform">
              <circle r="500" cy="50" cx="50" />
              <g transform="matrix(1.3303735,0,0,1.3303735,-371.93908,-408.3476)" class="flame">
                <path d="m 318.56,11.056 c 0,0 161.025,88.342 166.732,166.734 10.064,138.22 -188.875,195.44 -201.28,333.47 -5.556,61.8 35.745,166.735 35.745,166.735 0,0 -164.224,-86.598 -170.332,-165.535 C 138.652,373.25 341.445,316.823 354.305,177.79 360.019,116.005 318.558,11.056 318.558,11.056 Z" class="flame-1 d" />
                <path d="m 365.725,40.35 c 0,0 143.535,92.18 148.622,162.056 8.97,123.205 -168.357,160.773 -179.415,283.81 -4.95,55.085 31.863,148.62 31.863,148.62 0,0 -146.385,-77.19 -151.83,-147.552 C 205.363,363.197 386.125,312.9 397.59,188.97 402.682,133.898 365.726,40.35 365.726,40.35 Z" class="flame-2 d" />
                <path d="m 270.77,54.767 c 0,0 143.535,78.746 148.622,148.622 8.97,123.204 -168.357,174.207 -179.415,297.243 -4.952,55.086 31.862,148.622 31.862,148.622 0,0 -146.385,-90.624 -151.829,-160.987 C 110.407,364.18 291.17,327.317 302.633,203.389 307.727,148.314 270.77,54.766 270.77,54.766 Z" class="flame-3 d" />
              </g>
            </g>
        </defs>
      </svg>
      ${this.noToolbar ? '' : html`
      <div id="toolbar" ?hasSelection=${this.hasSelection} part="toolbar">
        <slot name="toolbar">
          <div class="toolbar">
            <span class="flex"></span>
            ${this.readonly ? '' : html`<md-outlined-button delete @click=${this.delete} icon="delete" >Delete ${this.selectedItems?.length} item${this.selectedItems?.length > 1 ? 's' : ''}</md-outlined-button>`}
            <md-filled-button @click=${this.download} >Download ${this.selectedItems?.length} item${this.selectedItems?.length > 1 ? 's' : ''}</md-filled-button>
          </div>
        </slot>
      </div>
      `}
      <div id="container">
        <slot id="slotContainer"></slot>
        ${this.viewType === 'image' ? this.renderImage() : this.renderGrid()}
      </div>
      ${this.renderDialog()}

    `;
  }

  private renderDialog() {
    const onkeydown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        this.next(e);
      }
      if (e.key === 'ArrowLeft') {
        this.previous(e);
      }
    };
    const setListener = () => window.addEventListener('keydown', onkeydown);
    const unsetListener = () => {
      if (this.dialog.returnValue === 'ok') {
        this.toggleItemsSelected(this.selected!);
      } else {
        this.selected = undefined;
      }
      window.removeEventListener('keydown', onkeydown);
    };
    return html`
          <md-dialog 
        @open=${setListener} 
        @close=${unsetListener}>
        <form id="form-switch" method="dialog" slot="content">
          <lapp-image sizing="contain" .src="${this.selected && this.selected.thumbnail || this.selected && this.selected.src || ''}" .placeholder="${this.previousPlaceholder || ''}" fade preload></lapp-image>
          <div>
            <slot name="toolbar">
              ${this.isFirst ? '' : html`
              <svg class="icon chevron left" viewBox="0 0 24 24" @click=${this.previous.bind(this)}>
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>`}
              ${this.isLast ? '' : html`
              <svg class="icon chevron right" viewBox="0 0 24 24" @click=${this.next.bind(this)}>
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>`}
            </slot>
          </div>
        </form>
        <div slot="actions"> 
          <md-outlined-button value="close">Cancel</md-outlined-button>
          <md-filled-button value="ok">Select</md-filled-button>
        </div>
      </md-dialog>
    `
  }

  private renderImage() {
    return (this.items || []).map((item) => html`
      <lapp-lazy-image 
        ?hasSelection=${this.hasSelection}
        @loaded-changed=${this.onLoaded}
        @click=${(e: MouseEvent) => {
        this.onClickImage(item, e);
      }}
        ?selected="${this.selectedItems.indexOf(item) > -1}" 
        .src="${item.thumbnail || item.src || ''}">
        <svg name="placeholder" viewBox="-500 -500 1100 1100" slot="placeholder"><use xlink:href="#placeholder-svg"></use></svg> 
      </lapp-lazy-image>`
    );
  }

  private renderGrid() {
    const onSelectedItemsChanged = (e: HTMLEvent<Grid>) => {
      this.selectedItems = [...e.target.selectedItems];
    }
    return html`
      <vaadin-grid 
        .items=${this.items}
        @selected-items-changed=${onSelectedItemsChanged}>
        <slot name="grid-columns"> 
         <vaadin-grid-selection-column auto-select></vaadin-grid-selection-column>
         <vaadin-grid-sort-column path="name" header="Name" flex-grow="2"></vaadin-grid-sort-column>
         <vaadin-grid-sort-column header="Date" path="timestamp" ></vaadin-grid-sort-column>
         <vaadin-grid-sort-column header="size" path="totalStr" ></vaadin-grid-sort-column>
         <vaadin-grid-sort-column path="type" header="type"></vaadin-grid-sort-column>
        </slot>
      </vaadin-grid>`;
  }

  onLoaded(e: HTMLEvent<LappImage>) {
    const target = e.target;
    const image = target.img;

    const w = Math.min(this.imageHeight * image?.naturalWidth / image?.naturalHeight, 1.8 * this.imageHeight);
    target.style.width = w + 'px';
  }

  get isFirst() {
    return this.selected && this.items[0] === this.selected;
  }

  get isLast() {
    return this.selected && this.items[this.items.length - 1] === this.selected;
  }

  get hasSelection() {
    return !!this.selectedItems?.length;
  }

  onClickImage(item: ItemT, e: MouseEvent) {
    if (!this.multi) {
      this.toggleItemsSelected(item);
      return;
    }

    // Note(cg): select if ctrl key is pressed.
    if (e.ctrlKey) {
      return this.toggleItemsSelected(item);
    }

    // Note(cg): otherwise open image.
    this.open(item);
  }

  delete() {
    this.dispatchEvent(new CustomEvent('gallery-delete', { detail: { items: [...this.selectedItems] }, bubbles: true, composed: true }));
    this.unselectAll();
  }

  download() {
    this.dispatchEvent(new CustomEvent('gallery-download', { detail: { items: [...this.selectedItems] }, bubbles: true, composed: true }));
    this.unselectAll();
  }

  toggleItemsSelected(item: ItemT) {
    if (!this.multi) {
      this.selectedItems = this.selectedItems[0] === item ? [] : [item];
      return;
    }
    let isSelected = false;
    const selectedItems = this.selectedItems.filter(el => {
      if (el === item) {
        isSelected = true;
        return false;
      }
      return true;
    });
    if (!isSelected) {
      selectedItems.push(item);
    }

    this.selectedItems = selectedItems;
  }

  selectAll() {
    this.selectedItems = this.items;
  }

  unselectAll() {
    this.selectedItems = [];
  }

  override firstUpdated(props: PropertyValues<this>) {
    if (!props.has('items')) {
      this.updateItemsFromDom();
      this.slotContainer.addEventListener('slotchange', this.updateItemsFromDom.bind(this));
    }
    super.firstUpdated(props);
  }

  override updated(props: PropertyValues<this>) {
    if (props.has('selected')) {
      this.toggleSelected(this.selected, props.get('selected'));
      this.dispatchEvent(new CustomEvent('selected-changed', { detail: { value: this.selected } }));
    }
    if (props.has('selectedItems')) {
      this.dispatchEvent(new CustomEvent('selected-items-changed', { detail: { value: this.selectedItems } }));
    }
    super.updated(props);
  }

  toggleSelected(_selected: ItemT | undefined, previous: ItemT | undefined) {
    if (previous) {
      this.previousPlaceholder = previous.src;
    }
  }

  updateItemsFromDom() {
    this.items = this.slotContainer.assignedNodes()
      .filter(node => node.nodeType === Node.ELEMENT_NODE)
      .filter(node => Object.keys((node as HTMLElement).dataset).length)
      .map(node => (node as HTMLElement).dataset as ItemT);
  }

  open(item: ItemT) {
    this.selected = item;
    this.dialog.show()
  }

  change(step: number) {
    const index = this.items.indexOf(this.selected!);
    const nextItem = this.items[index + step];
    if (!nextItem) {
      return;
    }
    this.selected = nextItem;
  }

  previous(e: Event) {
    this.eventPostHandle(e);
    this.change(-1);
  }

  next(e: Event) {
    this.eventPostHandle(e);
    this.change(1);
  }

  eventPostHandle(e: Event) {
    if (e.type === 'click') {
      // Note(cg): re-focus overlay so that key-binding continue to work.
      // this.overlay._cycleTab(0, 0);
    } else {
      e.preventDefault();
    }
  }
}


