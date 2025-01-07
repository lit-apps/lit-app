import { MixinBase, MixinReturn } from '@material/web/labs/behaviors/mixin.js';
import { Upload } from '@vaadin/upload/src/vaadin-lit-upload.js';
import { getApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';
import { UploadFinishedEvent } from './storage-mixin.js';
import { JSONMixinInterface } from './json-mixin.js';


export declare class UploadJSONDatabaseMixinInterface {
  // prop: string
}

type BaseT = Upload & JSONMixinInterface;

/**
 * UploadJSONDatabaseMixin - a mixin that stores metadata in a database 
 */
export const UploadJSONDatabaseMixin = <T extends MixinBase<BaseT>>(
  superClass: T
): MixinReturn<T, UploadJSONDatabaseMixinInterface> => {


  abstract class UploadJSONDatabaseMixinClass extends superClass {

    override uploadFinished(e: UploadFinishedEvent) {
      // console.log('upload finished', e.detail);
      const db = getDatabase(getApp(this.appName));
      e.detail.promise = set(ref(db, this.path), { ...e.detail.data });
      super.uploadFinished(e);
    }


  };
  return UploadJSONDatabaseMixinClass;
}

export default UploadJSONDatabaseMixin;

