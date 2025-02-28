/**
 * DragStore - a singleton store to pass data between drag and drop events.
 */
export class DragStore<D = any> {
  private static instance: DragStore;
  private _currentDragData!: D | undefined;

  static getInstance<D = any>(): DragStore<D> {
    if (!DragStore.instance) {
      DragStore.instance = new DragStore<D>();
    }
    return DragStore.instance as DragStore<D>;
  }

  setDragData(data: D) {
    this._currentDragData = data;
  }

  getDragData() {
    const data = this._currentDragData;
    return data;
  }
  clearDragData() {
    this._currentDragData = undefined;
  }
}