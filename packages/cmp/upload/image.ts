import { Upload } from "@vaadin/upload/src/vaadin-lit-upload.js";
import { customElement } from 'lit/decorators.js';
import { UploadDatabaseMixin } from './internals/database-mixin.js';
import { Storage } from './internals/storage-mixin.js';
import UploadImageMixin from "./internals/image-mixin.js";

/**
 *  A image upload field coupled with a firebase realtime database
 */
@customElement('lapp-upload-image')
export default class lappUploadImage extends UploadImageMixin(UploadDatabaseMixin(Storage(Upload))) {

}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-upload-image': lappUploadImage;
  }
}