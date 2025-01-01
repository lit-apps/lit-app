import { Upload } from "@vaadin/upload/src/vaadin-lit-upload.js";
import { customElement } from 'lit/decorators.js';
import { UploadFirestoreMixin } from './internals/firestore-mixin.js';
import { Storage } from './internals/storage-mixin.js';


/**
 *  A document upload field coupled with a firestore database
 */
@customElement('lapp-upload-firestore-document')
export default class lappUploadFirestoreDocument extends UploadFirestoreMixin(Storage(Upload)) {

}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-upload-firestore-document': lappUploadFirestoreDocument;
  }
}
