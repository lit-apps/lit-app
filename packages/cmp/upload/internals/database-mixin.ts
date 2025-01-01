import { MixinBase, MixinReturn } from '@material/web/labs/behaviors/mixin.js';
import pathReady from '@preignition/lit-firebase/src/pathReady.js';
import { Upload } from '@vaadin/upload/src/vaadin-lit-upload.js';
import { getApp } from 'firebase/app';
import { DataSnapshot, getDatabase, onValue, push, ref, set, Unsubscribe } from 'firebase/database';
import { StorageInterface, UploadFinishedEvent } from './storage-mixin.js';


export declare class UploadDatabaseMixinInterface {
  // prop: string
}

type BaseT = Upload & StorageInterface;

/**
 * UploadDatabaseMixin - a mixin that stores metadata in a database 
 */
export const UploadDatabaseMixin = <T extends MixinBase<BaseT>>(
  superClass: T
): MixinReturn<T, UploadDatabaseMixinInterface> => {


  abstract class UploadDatabaseMixinClass extends superClass {

    private _unsubscribe: Unsubscribe | undefined;

    override uploadFinished(e: UploadFinishedEvent) {
      console.log('upload finished', e.detail);
      const isMultiple = e.detail.isMultiple;
      const db = getDatabase(getApp(this.appName));
      const path = this.path + (isMultiple ? '/' + push(ref(db, this.path)).key : '');
      e.detail.promise = set(ref(db, path), { ...e.detail.file });
    }

    override subscribeMetaData(path: string, _fieldPath?: string) {
      if (this.preventRead || !pathReady(path)) return;
      if (this._unsubscribe) {
        this._unsubscribe();
      }
      this._unsubscribe = onValue(ref(getDatabase(getApp(this.appName)), path), (snap: DataSnapshot) => {
        this.metaData = snap.val();
        this.i18n = {...this.i18n};
      })
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
  return UploadDatabaseMixinClass;
}

export default UploadDatabaseMixin;

