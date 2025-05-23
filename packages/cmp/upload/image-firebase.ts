import { MixinBase } from '@lit-app/shared/types.js';
import { Upload } from "@vaadin/upload/src/vaadin-upload.js";
import '@vaadin/upload/vaadin-upload.js';
import { LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { UploadDatabaseMixin } from './internals/database-mixin.js';
import UploadImageMixin from "./internals/image-mixin.js";
import { Storage } from './internals/storage-mixin.js';


// vaadin-upload does not have a a LitElement base class, so we need to cast it
type BaseT = Upload & LitElement;
const litUpload = Upload as unknown as MixinBase<BaseT>;


/**
 *  A image upload field coupled with a firebase realtime database
 */
@customElement('lapp-upload-image-firebase')
export default class lappUploadImageFirebase extends UploadImageMixin(UploadDatabaseMixin(Storage(litUpload))) {

}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-upload-image-firebase': lappUploadImageFirebase;
  }
}
