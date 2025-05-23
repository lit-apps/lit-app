import { ToastEvent } from '@lit-app/shared/event/index.js';
import type { MixinBase, MixinReturn } from '@material/web/labs/behaviors/mixin.js';
import pathReady from '@preignition/lit-firebase/src/pathReady.js';
import { OrderBy, Where } from '@preignition/lit-firebase/src/types.js';
import { Upload } from '@vaadin/upload/src/vaadin-upload.js';
import { getApp } from 'firebase/app';
import { QueryConstraint, Unsubscribe, addDoc, collection, doc, getFirestore, limit, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { LitElement } from 'lit';
import { property } from 'lit/decorators/property.js';
import { FirebaseUploadFile, StorageInterface, UploadFinishedEvent } from './storage-mixin.js';


export declare class UploadFirestoreMixinInterface {
  // prop: string
}

type BaseT = Upload & StorageInterface & LitElement;

/**
 * UploadFirestoreMixin - a mixin that stores metadata in a database 
 */
export const UploadFirestoreMixin = <T extends MixinBase<BaseT>>(
  superClass: T
): MixinReturn<T, UploadFirestoreMixinInterface> => {


  abstract class UploadFirestoreMixinClass extends superClass {
    declare _isMultiple: (maxFiles: number) => boolean;
    @property({ attribute: false }) where!: Where | Where[];
    @property({ attribute: false }) orderBy!: OrderBy | OrderBy[];
    @property({ type: Number }) limit!: number;
    private _unsubscribe: Unsubscribe | undefined;

    override uploadFinished(e: UploadFinishedEvent) {
      console.log('upload finished', e.detail);
      const isMultiple = e.detail.isMultiple;
      const firestore = getFirestore(getApp(this.appName));
      // when multiple, and no fieldpath, we store as individual documents
      if (isMultiple && !this.fieldPath) {
        // only add doc if it is not already in the database
        const fineName = e.detail.file.name;
        const exists = Array.isArray(this.metaData) && this.metaData?.find((f: FirebaseUploadFile) => f.name === fineName);
        if (exists) {
          console.warn('File already exists in database', fineName);
          this.dispatchEvent(new ToastEvent('this image already exists in the database'));
          return e.detail.promise = Promise.resolve();
        }

        return e.detail.promise = addDoc(collection(firestore, this.path), { ...e.detail.file });

      }
      const fieldPath = this.fieldPath + (isMultiple ? '.' + this.fileName.split('.')[0] : '');
      return e.detail.promise = updateDoc(doc(firestore, this.path), { [fieldPath]: { ...e.detail.file } });
    }

    override subscribeMetaData(path: string, fieldPath?: string) {
      if (this.preventRead || !pathReady(path)) return;
      if (this._unsubscribe) {
        this._unsubscribe();
      }
      const firestore = getFirestore(getApp(this.appName));
      const isMulti = this._isMultiple(this.maxFiles)

      if (isMulti && !this.fieldPath) {
        const ref = collection(firestore, path);
        const constraint: QueryConstraint[] = []
        if (this.where) {
          (Array.isArray(this.where) ? this.where : [this.where]).forEach((w: Where) => {
            constraint.push(where(w.field, w.op, w.value));
          })
        }
        if (this.limit || this.limit === 0) {
          constraint.push(limit(this.limit))
        }
        if (this.orderBy) {
          const orderBys = (Array.isArray(this.orderBy[0]) ? this.orderBy : [this.orderBy]) as OrderBy[];
          orderBys.forEach((o) => {
            constraint.push(orderBy(o[0], o[1] || 'asc'));
          })
        }

        this._unsubscribe = onSnapshot(query(ref, ...constraint), (querySnapshot) => {
          if (querySnapshot.empty) {
            this.metaData = [];
          } else {
            this.metaData = querySnapshot.docs.map((doc) => {
              const data = doc.data();
              data.ref = doc.ref;
              return data
            }) as FirebaseUploadFile[];
          }
          this.i18n = { ...this.i18n };
        }, error => {
          console.error('Error getting documents:', error);
        })
        return
      }

      this._unsubscribe = onSnapshot(doc(getFirestore(getApp(this.appName)), path), (doc) => {
        this.metaData = fieldPath ? doc.get(fieldPath) : doc.data();
        this.i18n = { ...this.i18n };

        console.log("Current metaData: ", this.metaData, this.i18n.addFiles?.one);
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

