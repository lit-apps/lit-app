
import '@preignition/firebase-upload/document-upload';
import type { TemplateResult } from 'lit';
import { html } from 'lit';
import { property, query } from 'lit/decorators.js';
import { Generic } from '../../generic/generic';
import { createValidator } from '@material/web/labs/behaviors/constraint-validation';
import { Validator } from '@material/web/labs/behaviors/validators/validator';
import { UploadValidator } from './uploadValidator';

// import type {FirebaseDocumentUpload} '@preignition/firebase-upload/document-upload';

/**
 * A field component for uploading files to firebase storage.
 * 
 * TODO: 
 * - [ ] fix validation: 
 *   - [ ] user required validation
 *   - [ ] listen to firebase-document-upload error-related events
 * - [x] react on focus / blur
 * - [x] ~~always use a11y variant~~
 * - [x] ~~possibly use ripple for effect while uploading~~
 * - [x] add a class, just for forms, which will deal with path and store
 * - [x] verify how path are set in the form class - not sure `organisation` is WAI    
 * - [x] review focused and disabled props 
 * - [x] improve styles: 
 *     - [x] border around firebase upload (get inspiration from pwi-form-upload)
 *     - [x] review height of a11y variant label
 * - [x] add aria-label and aria-describedby to vaadin-button. 
 */
export abstract class Upload extends Generic {

  protected fieldName = 'upload';

  // override variant: string = 'a11y'

  @query('firebase-document-upload') override readonly input!: HTMLInputElement;
  @query('firebase-document-upload') override readonly inputOrTextarea!: HTMLInputElement;


  /**
   * when true, store metaData in firestore and not in the realtime database
   * as per default
   */
  @property({ type: Boolean }) useFirestore!: boolean

  /* 
 * `fieldPath` path to the field in firestore document where metaData is stored. 
 * Only used when `useFirestore` is set to true
 */
  @property() fieldPath!: string

  /*
   * `path` where firebase metaData is stored.
   */
  @property() path!: string;

  /*
   * `appName` name of firebaseApp
   */
  @property() appName!: string;

  /*
   * `metaData` (name, path, type, timestamp) stored in firebase
   */
  @property({ attribute: false }) metaData!: any;

  /*
   * `store` path to set at firestore level. if not set, will deduct from meta
   */
  @property() store!: string;

  /*
   * `fileName` the name of the file to store at firestore level. If not set,
   * will deduct it from original filename and add a timestamp
   */
  @property() fileName!: string;

  /*
   * Limit of files to upload, by default it is unlimited. If the value is
   * set to one, native file browser will prevent selecting multiple files.
   */
  @property({ type: Number }) maxFiles!: number

  /*
   * `debug` true for debug mode
   */
  @property({ type: Boolean }) debug!: boolean;

  @property({ type: Boolean, reflect: true }) readonly!: boolean;

  /*
   * `hideExisting` if true, will not display the list of files
   * already present in the db. This is useful for instance when
   * we refresh a page with an image gallery.
   */
  @property({ type: Boolean }) hideExisting!: boolean;

  /*
   * `preventRead` if set to true, only push new files and avoid reading
   * metaDate. This is useful in situation where we do not count the
   * number of files (e.g. images in a blog post.)
   */
  @property({ type: Boolean }) preventRead!: boolean;

  /*
   * `buttonText` text on upload button
   @property() * example: {one: 'upload image ...', many; 'upload images ...'}
   */
  @property({ type: Object }) buttonText!: any

  /*
   * `dropText` text on dop button
   @property() * example: {one: 'drop image ...', many; 'drop images ...'}
   */
  @property({ type: Object }) dropText!: any;

  /*
   * `uploading` flag to indicate that we are loading the image
   */
  @property({ type: Number }) uploading!: number

  /*
   * `noFileExtension` set true to prevent filename extension to be used for
   * storage path.
   */
  @property({ type: Boolean }) noFileExtension!: boolean;

  constructor() {
    super()

    this.addEventListener('focusin', () => this.focused = true);
    this.addEventListener('focusout', () => this.focused = false);
  }

  override renderInputOrTextarea(): TemplateResult {
    
    return html`
    <firebase-document-upload
      ?inert=${this.disabled || this.readonly}
      .label=${this.label}
      .useFirestore=${this.useFirestore}
      .fieldPath=${this.fieldPath}
      .path=${this.path}
      .appName=${this.appName}
      .metaData=${this.metaData}
      .store=${this.store}
      .fileName=${this.fileName}
      .maxFiles=${this.maxFiles}
      .readonly=${this.readonly}
      .hideExisting=${this.hideExisting}
      .preventRead=${this.preventRead}
      .buttonText=${this.buttonText}
      .dropText=${this.dropText}
      .uploading=${this.uploading}
      .noFileExtension=${this.noFileExtension}
      ></firebase-document-upload>
    
		`
  }


  // handleChange(e: Event) {
  //   const event = new CustomEvent('input', {
  //     detail: {value: this.value},
  //     bubbles: true,
  //     composed: true
  //   })
  //   redispatchEvent(this, event)
  // }

  [createValidator](): Validator<unknown> {
  	return new UploadValidator(() => this.inputOrTextarea as unknown as HTMLInputElement || { 
      required: this.required, 
      value: this.value});
  }

}


