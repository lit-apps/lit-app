// export interface appDialogOkDetail {
// data: any;
// }

/**
 * This event is fired when a dialog is closed with an `ok` action
 */
export class AppDialogOkEvent<D = any> extends CustomEvent<D> {
  static readonly eventName = 'app-dialog-ok';
  constructor(detail: D) {
    super(AppDialogOkEvent.eventName, {
      bubbles: true,
      composed: true,
      detail: detail
    });
  }
}

export function AppDialogOkEventFactory<T>() {
  return class TypedAppDialogOkEvent extends AppDialogOkEvent<T> {
  };
}

declare global {
  interface HTMLElementEventMap {
    [AppDialogOkEvent.eventName]: AppDialogOkEvent<any>,
  }
}

export default AppDialogOkEvent