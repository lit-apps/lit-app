import { MixinBase, MixinReturn } from '@material/web/labs/behaviors/mixin.js';
import { Upload } from '@vaadin/upload/src/vaadin-lit-upload.js';
import { property } from 'lit/decorators.js';
import { UploadFinishedEvent, FirebaseUploadFile } from './storage-mixin.js';


export declare class JSONMixinInterface {
  validateJSON: (data: unknown) => boolean
  uploadFinished(e: UploadFinishedEvent): void
  clearFile(file: FirebaseUploadFile): void
  // uploadFinished: (e: UploadFinishedEvent) => void;
  appName: string | undefined
  /**
   * The path to the storage bucket - if not provided, will use the path
   */
  store: string
  /**
   * the fileName to store the file - if not provided, will use the file name
   */
  fileName: string
  /**
   * The path to store metaData in the database 
   * 
   */
  path: string
  fieldPath: string | undefined
  /**
   * Whether to log events
   */
  log: boolean

  /**
   * Whether the component is readonly
   */
  readonly: boolean
}

type BaseT = Upload;

/**
 * JSONMixin - a mixin that stores metadata in a database 
 */
export const JSONMixin = <T extends MixinBase<BaseT>>(
  superClass: T
): MixinReturn<T, JSONMixinInterface> => {


  abstract class JSONMixinClass extends superClass {

    @property({ attribute: false }) validateJSON!: (data: unknown) => boolean;
    @property() appName!: string;
    @property() fileName!: string;
    @property() store!: string;
    @property() path!: string;
    @property() fieldPath!: string;
    @property({ type: Boolean }) log: boolean = false;
    @property({ type: Boolean, reflect: true }) readonly: boolean = false; // reflect is used by upload image


    declare _renderFileList: () => void;
    declare _removeFile: (file: FirebaseUploadFile) => void;

    constructor(..._args: any[]) {
      super(_args);
      this.maxFiles = 1;
      this.accept = 'application/json';
      // this.addEventListener(UploadFinishedEvent.eventName, this.uploadFinished.bind(this));
    }

    async uploadFinished(e: UploadFinishedEvent) {
      console.log('upload finished - need override', e.detail);
      // await e.detail.promise;
      this.clearFile(e.detail.file);
    }

    get uploading() {
      return this.files.filter((file) => file.uploading).length;
    }

    /**
     * upload file for firestore and save metaData to database
     * @param  {UploadFile} file
     */
    // @override a private method from Upload
    _uploadFile(file: FirebaseUploadFile) {
      if (file.uploading || this.readonly) {
        return;
      }
      const errorHandler = (file: FirebaseUploadFile, errorMessage: string) => {
        file.indeterminate = undefined;
        file.status = '';
        file.error = errorMessage;
        this._renderFileList();
        this.dispatchEvent(new CustomEvent('upload-error', { detail: { file, error: errorMessage } }));
      };


      // handle upload if event is not prevented. if it is, it is (for instance to let user check
      // some conditions on hte file, the _uploadFirebaseFile needs to be retriggered ).
      if (this.dispatchEvent(new CustomEvent('upload-start', { detail: { file }, cancelable: true }))) {
        const reader = new FileReader();
        reader.addEventListener('load', async () => {
          if (reader.result === null) {
            return;
          }
          let ok: boolean | string = true;
          let data;
          try {
            data = JSON.parse(reader.result as string);
          } catch (e) {
            ok = 'invalid json';
          }
          if (this.validateJSON && ok === true) {
            ok = this.validateJSON.call(this, data);
          }

          if (ok !== true) {
            errorHandler(file, ok as string);
            return;
          }
          try {
            if (this.dispatchEvent(new CustomEvent('upload-store', { detail: { file: file, data: data }, cancelable: true }))) {
              this.log && console.log('uploaded, stored in firebase');
              file.complete = true;
              // file.dbPath = this.path;
              file.status = '';
              this._renderFileList();
              file = this.normalizeFile(file)
              const event = new UploadFinishedEvent(file, false, data);
              if(this.dispatchEvent(event)) {
                this.uploadFinished(event);
              };
              return event.detail.promise;
            }
          } catch (error) {
            errorHandler(file, (error as Error).message);
          }
        });
        reader.readAsText(file);
      }

    }

    clearFile(file: FirebaseUploadFile) {
      // Note(cg): remove file from list after a delay.
      setTimeout(() => {
        this._removeFile(file);
        this._renderFileList();
      }, 6000);
    }
    protected getTimestamp() {
      return new Date().toISOString();
    }
    private normalizeFile(file: FirebaseUploadFile): FirebaseUploadFile {
      return {
        ...file,
        timestamp: this.getTimestamp(),
      }
    }

  };


  return JSONMixinClass;
}

export default JSONMixin;

