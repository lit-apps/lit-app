
export interface RecordDetail {
  blob: Blob;
  src: string;
  type: string;
  promise?: Promise<any>;
}
/**
 * This event is fired to trigger the main application hoist an element
 */

export default class RecordEvent extends CustomEvent<RecordDetail> {
  static readonly eventName = 'record-changed';
  constructor(detail: RecordDetail) {
    super(RecordEvent.eventName, {
      bubbles: true,
      composed: true,
      detail: detail
    });
  }
}

declare global {
  interface HTMLElementEventMap {
    'Record': RecordEvent;
  }
}
