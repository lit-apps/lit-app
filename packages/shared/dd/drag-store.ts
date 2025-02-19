/**
 * DragStore - a singleton store to pass data between drag and drop events.
 */
export class DragStore<D = any> {
  private static instance: DragStore;
  private _currentDragData!: D | undefined;

  static getInstance<D = any>(): DragStore {
    if (!DragStore.instance) {
      DragStore.instance = new DragStore<D>();
    }
    return DragStore.instance;
  }

  setDragData(data: D) {
    this._currentDragData = data;
  }

  getDragData() {
    const data = this._currentDragData;
    this._currentDragData = undefined
    return data;
  }
}