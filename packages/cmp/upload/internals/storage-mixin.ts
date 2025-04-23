/** 
 * A mixin to handle file upload to firebase storage
 */

import watch from '@lit-app/shared/decorator/watch.js';
import { ToastEvent } from '@lit-app/shared/event/index.js';
import type { MixinBase, MixinReturn } from '@material/web/labs/behaviors/mixin.js';
import { Upload } from '@vaadin/upload/src/vaadin-lit-upload';
import type { UploadFile } from '@vaadin/upload/src/vaadin-upload.js';
import { getApp } from "firebase/app";
import { DocumentReference } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, StorageReference, uploadBytesResumable, UploadTask } from 'firebase/storage';
import { PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { normalizeFile } from './normalizeFile.js';

export interface uploadFinishedDetail {
  file: FirebaseUploadFile | UploadFile;
  isMultiple: boolean;
  data?: any;
  promise?: Promise<any>;
}

/**
 * This event is fired to trigger the main application hoist an element
 */
export class UploadFinishedEvent extends CustomEvent<uploadFinishedDetail> {
  static readonly eventName = 'upload-finished';
  constructor(file: FirebaseUploadFile | UploadFile, isMultiple: boolean, data?: any) {
    super(UploadFinishedEvent.eventName, {
      cancelable: true,
      detail: { file, isMultiple, data }
    });
  }
}

declare global {
  interface HTMLElementEventMap {
    'upload-finished': UploadFinishedEvent,
  }
}


export declare class StorageInterface {
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
   * Whether to store file without extension
   */
  noFileExtension: boolean
  /**
   * Whether to store file with unique name
   */
  uniqueName: boolean

  /**
   * Whether to prevent reading the file
   */
  preventRead: boolean

  /**
   * Whether the component is readonly
   */
  readonly: boolean

  /**
   * Whether to prevent reading the file
   */
  metaData: FirebaseUploadFile
    | { [key: string]: FirebaseUploadFile }
    | FirebaseUploadFile[]
    | undefined

  uploading: number

  uploadFinished(e: UploadFinishedEvent): void
  subscribeMetaData(path: string, fieldPath?: string): void
}

type BaseT = Upload

export type FirebaseUploadFile = UploadFile & {
  /** storage reference */
  url: string | undefined,
  thumbnail: string | undefined,
  ref: DocumentReference | undefined,
  timestamp: string,
  indeterminate: boolean | undefined,
}

// TODO: aria-described by for button

/**
 * Storage - a mixin to handle file upload to firebase storage
 */
export const Storage = <T extends MixinBase<BaseT>>(
  superClass: T
): MixinReturn<T, StorageInterface> => {

  abstract class StorageClass extends superClass {

    private _oldMaxFiles!: number;
    declare error: string; // error message
    declare _renderFileList: () => void;
    declare _setStatus: (file: FirebaseUploadFile, total: number, loaded: number, elapsed: number) => void;
    declare _removeFile: (file: FirebaseUploadFile) => void;
    declare _isMultiple: (maxFiles: number) => boolean;

    @property() appName!: string;
    @property() fileName!: string;
    @property() store!: string;
    @property() path!: string;
    @property() fieldPath!: string;
    @property({ type: Boolean }) log: boolean = false;
    @property({ type: Boolean }) noFileExtension: boolean = false;
    @property({ type: Boolean }) uniqueName: boolean = false;
    @property({ type: Boolean }) preventRead: boolean = false;
    @property({ type: Boolean, reflect: true }) readonly: boolean = false; // reflect is used by upload image
    @state() metaData: FirebaseUploadFile | { [key: string]: FirebaseUploadFile } | undefined;

    @watch('metaData') metaDataChanged(metaData: FirebaseUploadFile) {
      if (!metaData) return;
      let files: FirebaseUploadFile[] = [];
      if (this._isMultiple(this.maxFiles)) {
        files = (Array.isArray(metaData) ? metaData : Object.values(metaData))
          .filter(meta => meta.name)
          .filter(meta => !(this.files as FirebaseUploadFile[]).some(file => file.url === meta.url));

      } else {
        files = [metaData];
      }
      this.uploadFiles(files);
      this.dispatchEvent(new CustomEvent('meta-data-changed', { detail: { value: metaData }, bubbles: true, composed: true }));
    }

    @watch('readonly') readonlyChanged(readonly: boolean, oldReadonly: boolean) {
      if (readonly) {
        this._oldMaxFiles = this.maxFiles;
        this.maxFiles = 0;
      }
      if (oldReadonly && !readonly) {
        this.maxFiles = this._oldMaxFiles;
      }
    }

    constructor(...args: any[]) {
      super(...args);
      // this.addEventListener(UploadFinishedEvent.eventName, this.uploadFinished.bind(this));
    }

    override willUpdate(props: PropertyValues) {
      super.willUpdate(props);
      if ((props.has('path') || props.has('fieldPath')) && !!this.path && !this.preventRead) {
        this.subscribeMetaData(this.path, this.fieldPath);
      }
    }

    uploadFinished(e: UploadFinishedEvent) {
      console.log('upload finished - need override', e.detail);
      // e.detail.promise = Promise.resolve(null);
    }

    subscribeMetaData(_path: string, _fieldPath?: string) {
      console.log('getMetaData - need override');
    }


    get uploading() {
      return this.files.filter((file) => file.uploading).length;
    }

    /**
     * the base path to use for storage - will be overridden 
     */
    get storageBasePath() {
      return this.store || this.path || '';
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
      if (file.complete === true) {
        // Note(cg): file is already in firestore. no need to upload.
        file.loaded = 1000;
        file.status = '';
        this._renderFileList();
        // Note(cg): remove file from list after a delay. if maxFiles !== 1`
        if (this.maxFiles !== 1) {
          setTimeout(() => {
            const index = this.files.indexOf(file);
            if (index > -1) {
              this.files.splice(index, 1);
              this._renderFileList();
            }
          }, 100);
        }
        return;
      }

      // Note(cg): really upload.
      const ini = Date.now();
      file.status = this.i18n.uploading.status.connecting;
      file.uploading = file.indeterminate = true;
      file.complete = file.abort = file.held = false;
      file.error = '';

      let last;
      let uploadTask: UploadTask;
      let fileRef: StorageReference
      const isMulti = this._isMultiple(this.maxFiles)
      const name = this.fileName || file.name;
      try {
        fileRef = getFileRef(this.appName, this.storageBasePath, name, !isMulti, this.noFileExtension);
        uploadTask = uploadBytesResumable(fileRef, file, { contentType: file.type });
      } catch (e) {
        console.error('cannot upload document', e);
        const message = (e as Error).message;
        file.error = message;
        return
      }
      file.status = this.i18n.uploading.status.connecting;
      file.uploading = file.indeterminate = true;
      file.complete = file.abort;
      file.error = '';
      this._renderFileList();

      // handle upload if event is not prevented. if it is, it is (for instance to let user check
      // some conditions on hte file, the _uploadFirebaseFile needs to be retriggered ).
      if (this.dispatchEvent(new CustomEvent('upload-start', { detail: { file }, cancelable: true }))) {

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            last = Date.now();
            const loaded = snapshot.bytesTransferred;
            const total = snapshot.totalBytes;
            const elapsed = (last - ini) / 1000;
            const progress = ~~(loaded / total * 100);

            file.loaded = loaded;
            file.progress = progress;
            file.indeterminate = loaded <= 0 || loaded >= total;
            file.status = this.i18n.uploading.status.processing;

            this.log && console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                this.log && console.log('Upload is paused');
                break;
              case 'running': // or 'running'
                this.log && console.log('Upload is running');
                break;
            }
            this._setStatus(file, total, loaded, elapsed);
            this._renderFileList();
            this.dispatchEvent(new CustomEvent('upload-progress', { detail: { file } }));

          },
          (e) => {
            file.indeterminate = undefined
            file.status = '';
            file.error = e.message;
            // this.uploading = this.uploading - 1;
            this.dispatchEvent(new CustomEvent('upload-error', { detail: { file, error: e } }));

            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (e.code) {
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break;

              case 'storage/canceled':
                file.abort = true;
                // User canceled the upload
                break;

              case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                break;
            }
            this._renderFileList();
            this.log && console.error('cannot upload document', e);

            this.dispatchEvent(new ToastEvent(`error while uploading document (${e.message})`, 'error'));

          },
          async () => {
            this.log && console.log('uploaded, now storing at db level');
            file.loadedStr = file.totalStr;
            file.uploading = false;
            file.status = this.i18n.uploading.status.processing;
            // this._setStatus(file, total, loaded, elapsed);
            this._renderFileList();
            this.dispatchEvent(new CustomEvent('upload-success', { detail: { file } }));
            // Upload completed successfully, now we can get the download URL
            try {
              const downloadURL = await getDownloadURL(fileRef);
              file.url = downloadURL;
              // Try to get the thumbnail URL, fallback to empty string if it fails
              try {
                // Create a thumbnail URL by inserting 'thumbnails/' before the last segment of the path
                // and adding '_200x200' before the file extension
                const urlObj = new URL(downloadURL);
                const pathParts = urlObj.pathname.split('%2F');
                const lastIndex = pathParts.length - 1;
                let lastSegment = pathParts[lastIndex];

                // Add '_200x200' before the file extension
                const lastSegmentParts = lastSegment.split('.');
                if (lastSegmentParts.length > 1) {
                  const ext = lastSegmentParts.pop();
                  lastSegment = lastSegmentParts.join('.') + '_200x200.' + ext;
                } else {
                  lastSegment = lastSegment + '_200x200';
                }

                pathParts[lastIndex] = `thumbnails%2F${lastSegment}`;
                urlObj.pathname = pathParts.join('%2F');
                const thumbnailURL = urlObj.toString();
                file.thumbnail = thumbnailURL || '';
              } catch (err) {
                console.error('Failed to create thumbnail URL:', err);
              }
              this.log && console.log('File available at', downloadURL);
              file.complete = true;
              file.status = '';
              this._renderFileList();
              const event = new UploadFinishedEvent(normalizeFile(file), isMulti);
              if (this.dispatchEvent(event)) {
                this.uploadFinished(event);
              };
              this.clearFile(file);
              this.log && console.log('All done');
            } catch (error) {
              this.log && console.error('cannot save metaData', error);
              this.dispatchEvent(new ToastEvent(`error while saving document metaData  (${(error as Error).message})`, 'error'));
            }
          }
        );
      }

    }
    private clearFile(file: FirebaseUploadFile) {
      // Note(cg): remove file from list after a delay.
      setTimeout(() => {
        this._removeFile(file);
        this._renderFileList();
      }, 6000);
    }

    protected getTimestamp() {
      return new Date().toISOString();
    }


  };
  return StorageClass;
}

export default Storage;


function getFileRef(appName: string, path: string, name: string, uniqueName: boolean, noFileExtension: boolean) {
  const app = getApp(appName);
  const extension = name.split('.').pop();
  const nameWithoutExtension = name.split('.')[0]

  let fileName = uniqueName ? `${nameWithoutExtension}-${Date.now()}` : nameWithoutExtension;
  if (!noFileExtension) {
    fileName = `${fileName}.${extension}`;
  }
  const storePath = `${path}${path.endsWith('/') ? '' : '/'}${fileName}`;

  return ref(getStorage(app), storePath)
}