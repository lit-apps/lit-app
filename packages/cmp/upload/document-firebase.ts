import { Upload } from "@vaadin/upload/src/vaadin-lit-upload.js";
import '@vaadin/upload/vaadin-lit-upload.js'
import { customElement } from 'lit/decorators.js';
import { UploadDatabaseMixin } from './internals/database-mixin.js';
import { Storage } from './internals/storage-mixin.js';

/**
 *  A document upload field coupled with a firebase realtime database
 */
@customElement('lapp-upload-document-firebase')
export default class lappUploadDocumentFirebase extends UploadDatabaseMixin(Storage(Upload)) {

}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-upload-document-firebase': lappUploadDocumentFirebase;
  }
}
