import { html } from "lit";
import { customElement, property } from 'lit/decorators.js';
import MediaSelectBase from "./select-base.js";
import('./gallery.js');
import('../upload/document.js');

/**
 *  
 */

@customElement('lapp-media-select')
export default class lappMediaSelect extends MediaSelectBase {

  // static override styles = css`
  //     :host {}
  //   `;

  // @property() name!: string;

  // override render() {
  //   return html`
  //     <div>

  //     </div>
  //   `;
  // }
  /**
   * firebase database collection
   */
  @property() collectionPath!: string


  protected override renderImage() {
    const onMetaChanged = (e: CustomEvent) => {
      this.gallery.items = e.detail.value;
    }

    return html`
      <h4><span>Image</span>${this.renderTab()}</h4>
      <lapp-upload-document
          max-file-size="5000000" 
          accept="image/*, video/*" 
          .path=${this.collectionPath} 
          .store=${this.collectionStore}
          @meta-data-changed=${onMetaChanged} 
          >
          <vaadin-button slot="add-button" theme="primary">
            Upload Media Files ...
          </vaadin-button>
            <lapp-media-gallery 
              viewType="image" 
              noToolbar
              @selected-items-changed=${(e: CustomEvent) => {
        if (e.detail.value[0]) {
          this._dataImage = { ...e.detail.value[0], ...initImage };
        }
      }}>
        <slot name="gallery"></slot>
    </lapp-media-gallery>
    </lapp-upload-document>`;
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-media-select': lappMediaSelect;
  }
}



const initImage = { mediaType: 'image', _tag: 'image' };
