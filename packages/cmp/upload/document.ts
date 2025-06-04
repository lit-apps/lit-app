import { MixinBase } from "@lit-app/shared/types.js";
import { UploadMixinClass } from "@vaadin/upload/src/vaadin-upload-mixin.js";
import { Upload } from "@vaadin/upload/src/vaadin-upload.js";
import '@vaadin/upload/vaadin-upload.js';
import { LitElement } from "lit";
import { customElement } from 'lit/decorators.js';
import { UploadFirestoreMixin } from './internals/firestore-mixin.js';
import { Storage } from './internals/storage-mixin.js';

// vaadin-upload does not have a a LitElement base class, so we need to cast it
type BaseT = UploadMixinClass & LitElement;
const litUpload = Upload as unknown as MixinBase<BaseT>;


/**
 *  A document upload field coupled with a firestore database
 */
@customElement('lapp-upload-document')
export default class lappUploadDocument extends UploadFirestoreMixin(Storage(litUpload)) {

}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-upload-document': lappUploadDocument;
  }
}
