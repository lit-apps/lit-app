import { FirestoreCollectionController, FirestoreDocumentController } from '@preignition/lit-firebase';
import { type Query, DocumentReference, type DocumentData } from 'firebase/firestore';
import { State } from '@lit-app/state';
import { type ReactiveElement } from 'lit';
import { type Collection } from "@lit-app/model";

/**
 * Creates a Firestore collection handler that subscribes to a Firestore collection
 * and updates the state with the data from the collection.
 *
 * @template T The type of the state object.
 * @template D The type of the data in the Firestore collection.
 * @param {T} state The state object to subscribe to.
 * @param {keyof T | ((keyof T)[])} stateProperty The property or properties of the state object to subscribe to.
 *                                                 If an array of properties is provided, the subscription will only
 *                                                 be triggered if at least one of the properties is not undefined.
 * @param {(state: T) => Query<D>} queryBuilder A function that builds the Firestore query based on the current state.
 * @param {(data: Collection<D> | undefined, state: T) => void} callback A callback function that is called when the data in the
 *                                                              Firestore collection changes. The callback function
 *                                                              receives the data from the collection and the current state
 *                                                              as arguments.
 * @param {boolean} [run] Whether to run the subscription immediately if the state property is already defined.
 * @returns {() => void} A function that can be called to unsubscribe from the state.
 */
function createFirestoreCollectionHandler<T extends State, D>(
  state: T,
  stateProperty: keyof T | ((keyof T)[]),
  queryBuilder: (state: T) => (Query<D> | undefined),
  callback: (data: Collection<D> | undefined, state: T) => void,
  run?: boolean 
) {
  let controller: FirestoreCollectionController<unknown> | undefined;
  const subscribe = (_key?: string, _value?: string | undefined) => {
    let query = undefined;
    try {
      query = queryBuilder(state);
    } catch (e) {
      console.warn("Error building query:", e);
      return
    }
    if (!query) return;
    if (controller) {
      controller.ref = query;
    } else {
      controller = new FirestoreCollectionController<D>(
        state as unknown as ReactiveElement,
        query,
        (c) => callback(c.data, state)
      );
      controller.subscribe();
    }
  };
  const r = run !== undefined ? run : Array.isArray(stateProperty) ?
    stateProperty.some(prop => state[prop] !== undefined) :
    state[stateProperty] !== undefined;
  if (r) {
    subscribe();
  }
  return state.subscribe(subscribe, stateProperty as string[] | string);
}


/**
 * Creates a Firestore document handler that subscribes to a Firestore document and updates the state.
 *
 * @template T The type of the state object.
 * @template D The type of the Firestore document data.
 * @param {T} state The state object to subscribe to.
 * @param {keyof T | (keyof T)[]} stateProperty The state property or properties to trigger the subscription.
 * @param {(state: T) => DocumentReference<D>} refBuilder A function that builds the Firestore document reference from the state.
 * @param {(data: Collection<D> | undefined, state: T) => void} callback A callback function that is called when the Firestore document data changes.
 * @param {string} [fieldPath] An optional field path to subscribe to within the document.
 * @param {boolean} [run] An optional boolean to determine if the subscription should run immediately. Defaults to true if any of the state properties are defined.
 * @returns {() => void} A function to unsubscribe from the state.
 */
function createFirestoreDocumentHandler<T extends State, D extends DocumentData>(
  state: T,
  stateProperty: keyof T | ((keyof T)[]),
  refBuilder: (state: T) => (DocumentReference | undefined),
  callback: (data: D | undefined, state: T) => void,
  fieldPath?: string,
  run?: boolean 
) {
  let controller: FirestoreDocumentController<unknown> | undefined;
  const subscribe = (_key?: string, _value?: string | undefined) => {
    let ref = undefined;
    try {
      ref = refBuilder(state);
    } catch (e) {
      console.warn("Error building document reference:", e);
      return
    }
    if (!ref || !(ref instanceof DocumentReference)) return;
    if (controller) {
      controller.ref = ref;
    } else {
      controller = new FirestoreDocumentController<D>(
        state as unknown as ReactiveElement,
        ref,
        fieldPath,
        (c) => callback(c.data, state)
      );
      controller.subscribe();
    }
  };
  const r = run !== undefined ? run : Array.isArray(stateProperty) ?
    stateProperty.some(prop => state[prop] !== undefined) :
    state[stateProperty] !== undefined;
  if (r) {
    subscribe();
  }
  return state.subscribe(subscribe, stateProperty as string[] | string);
}



export {
  createFirestoreCollectionHandler,
  createFirestoreDocumentHandler 
}