import { Upload } from "@vaadin/upload/src/vaadin-lit-upload.js";
import '@vaadin/upload/theme/lumo/vaadin-lit-upload.js'
import { customElement } from 'lit/decorators.js';
import { UploadFirestoreMixin } from './internals/firestore-mixin.js';
import { Storage } from './internals/storage-mixin.js';


/**
 *  A document upload field coupled with a firestore database
 */
@customElement('lapp-upload-document')
export default class lappUploadDocument extends UploadFirestoreMixin(Storage(Upload)) {

}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-upload-document': lappUploadDocument;
  }
}
