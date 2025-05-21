import { Upload } from "@vaadin/upload/src/vaadin-upload.js";
import '@vaadin/upload/vaadin-upload.js'
import { customElement } from 'lit/decorators.js';
import { UploadJSONDatabaseMixin } from './internals/json-database-mixin.js';
import { JSONMixin } from './internals/json-mixin.js';

/**
 *  A document upload field coupled with a firebase realtime database
 */
@customElement('lapp-upload-json-firebase')
export default class lappUploadJSONFirebase extends UploadJSONDatabaseMixin(JSONMixin(Upload)) {

}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-upload-json-firebase': lappUploadJSONFirebase;
  }
}
