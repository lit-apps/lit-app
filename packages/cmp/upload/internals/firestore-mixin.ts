import { MixinBase, MixinReturn } from '@material/web/labs/behaviors/mixin.js';
import pathReady from '@preignition/lit-firebase/src/pathReady.js';
import { Upload } from '@vaadin/upload/src/vaadin-lit-upload.js';
import { getApp } from 'firebase/app';
import { doc, getFirestore, onSnapshot, updateDoc,  Unsubscribe } from 'firebase/firestore';
import { StorageInterface, UploadFinishedEvent } from './storage-mixin.js';


export declare class UploadFirestoreMixinInterface {
  // prop: string
}

type BaseT = Upload & StorageInterface;

/**
 * UploadFirestoreMixin - a mixin that stores metadata in a database 
 */
export const UploadFirestoreMixin = <T extends MixinBase<BaseT>>(
  superClass: T
): MixinReturn<T, UploadFirestoreMixinInterface> => {


  abstract class UploadFirestoreMixinClass extends superClass {

    private _unsubscribe: Unsubscribe | undefined;

    override uploadFinished(e: UploadFinishedEvent) {
      console.log('upload finished', e.detail);
      const isMultiple = e.detail.isMultiple;
      const fieldPath = (this.fieldPath || 'upload') + (isMultiple ? '.' + this.fileName.split('.')[0] : '');
      e.detail.promise = updateDoc(doc(getFirestore(getApp(this.appName)), this.path), { [fieldPath ]: { ...e.detail.file }});
    }

    override subscribeMetaData(path: string, fieldPath?: string) {
      if (this.preventRead || !pathReady(path)) return;
      if (this._unsubscribe) {
        this._unsubscribe();
      }
      this._unsubscribe = onSnapshot(doc(getFirestore(getApp(this.appName)), path), (doc) => {
        this.metaData = fieldPath ? doc.get(fieldPath) : doc.data();
        this.i18n = {...this.i18n};

        console.log("Current metaData: ", this.metaData, this.i18n.addFiles.one);
      }, error => {
        console.error('Error getting document:', error);
      }
      )
    }

    override disconnectedCallback() {
      super.disconnectedCallback();
      if (this._unsubscribe) {
        this._unsubscribe();
        delete this._unsubscribe;
      }
    }

    override connectedCallback() {
      super.connectedCallback();
      if (this.path) {
        this.subscribeMetaData(this.path, this.fieldPath);
      }
    }

  };
  return UploadFirestoreMixinClass;
}

export default UploadFirestoreMixin;

