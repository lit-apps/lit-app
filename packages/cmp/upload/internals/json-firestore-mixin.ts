import type { MixinBase, MixinReturn } from '@material/web/labs/behaviors/mixin.js';
import { Upload } from '@vaadin/upload/src/vaadin-upload.js';
import { getApp } from 'firebase/app';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { JSONMixinInterface } from './json-mixin.js';
import { UploadFinishedEvent } from './storage-mixin.js';


export declare class UploadJSONFirestoreMixinInterface {
  // prop: string
}

type BaseT = Upload & JSONMixinInterface;

/**
 * UploadJSONFirestoreMixin - a mixin that stores metadata in a database 
 */
export const UploadJSONFirestoreMixin = <T extends MixinBase<BaseT>>(
  superClass: T
): MixinReturn<T, UploadJSONFirestoreMixinInterface> => {


  abstract class UploadJSONFirestoreMixinClass extends superClass {

    override uploadFinished(e: UploadFinishedEvent) {
      // console.log('upload finished', e.detail);
      const isMultiple = e.detail.isMultiple;
      const fieldPath = (this.fieldPath || 'upload') + (isMultiple ? '.' + this.fileName.split('.')[0] : '');
      e.detail.promise = updateDoc(doc(getFirestore(getApp(this.appName)), this.path), { [fieldPath]: { ...e.detail.data } });
      super.uploadFinished(e);
    }

  };
  return UploadJSONFirestoreMixinClass;
}

export default UploadJSONFirestoreMixin;

