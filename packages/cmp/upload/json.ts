import { Upload } from "@vaadin/upload/src/vaadin-upload.js";
import '@vaadin/upload/vaadin-upload.js';
import { customElement } from 'lit/decorators.js';
import UploadJSONFirestoreMixin from "./internals/json-firestore-mixin.js";
import JSONMixin from "./internals/json-mixin.js";


/**
 *  A document upload field coupled with a firestore database
 */
@customElement('lapp-upload-json')
// export default class lappUploadDocument extends UploadFirestoreMixin(Storage(Upload)) {
export default class lappUploadJSON extends UploadJSONFirestoreMixin(JSONMixin(Upload)) {

}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-upload-json': lappUploadJSON;
  }
}
