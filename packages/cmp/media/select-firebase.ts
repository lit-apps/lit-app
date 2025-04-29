import '@preignition/lit-firebase/query';
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FirebaseUploadFile } from '../upload/internals/storage-mixin.js';
import MediaSelectBase from './select-base.js';
import('./gallery.js');
import('../upload/document-firebase.js');


export type CollectionType = 'illustration' | 'easyread'



const toMediaItems = (obj: FirebaseUploadFile) => {
  // TODO(cg): handle thumbnail and getDownloadURL for each file.
  return Object.entries(obj || {}).map(([_k, v]) => Object.assign({ src: v.url }, v));
};

const initImage = { mediaType: 'image', _tag: 'image' };


/**
 *  A widget to select a media item (image or video) and show the selection
 */
@customElement('lapp-media-select-firebase')
export default class LappMediaSelect extends MediaSelectBase {


  /**
   * firebase database collection
   */
  @property() collectionPath!: string


  protected override renderImage() {
    const onMetaChanged = (e: CustomEvent) => {
      this.gallery.items = toMediaItems(e.detail.value);
    }

    return html`
      <h4><span>Image</span>${this.renderTab()}</h4>
      <lapp-upload-document-firebase 
          max-files-size="5000000" 
          accept="image/*, video/*" 
          .path=${this.collectionPath} 
          .store=${this.collectionStore}
          @meta-data-changed=${onMetaChanged} 
          .hideExisting=${true}>
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
    </lapp-upload-document-firebase>`;
  }


}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-media-select-firebase': LappMediaSelect;
  }
}
