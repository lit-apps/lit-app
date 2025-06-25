import { DocumentReference } from "firebase/firestore";

export interface AppNeedRefreshDetail {
  /**
   * The reference or id of the item to refresh
   */
  refOrId: DocumentReference | string | null;

}

/**
 * This event is fired to indicate that a part of the app need to be refreshed. 
 * 
 * This is used for instance to reload part of a tree grid when a new item is added or removed
 */
export default class AppNeedRefreshEvent extends CustomEvent<AppNeedRefreshDetail> {
  static readonly eventName = 'AppNeedRefresh';
  constructor(detail: AppNeedRefreshDetail) {
    super(AppNeedRefreshEvent.eventName, {
      bubbles: true,
      composed: true,
      detail: detail
    });
  }
}

declare global {
  interface HTMLElementEventMap {
    'AppNeedRefresh': AppNeedRefreshEvent,
  }
}