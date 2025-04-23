import type { MixinBase, MixinReturn } from '@material/web/labs/behaviors/mixin.js';
import { DragStore } from './drag-store.js';


export declare class DragMixinInterface<D> {
  handleDragStart: (e: DragEvent, data: D) => void
  handleDragOver: (e: DragEvent) => void
  handleDrop: (e: DragEvent) => D | undefined
}

type BaseT = HTMLElement & {}
/**
 * DragMixin - a mixin that allows passing data between drag and drop events as the native  only allows text.
 */
export const DragMixin = <D = any>() => <T extends MixinBase<BaseT>>(
  superClass: T
): MixinReturn<T, DragMixinInterface<D>> => {


  abstract class DragMixinClass extends superClass {

    protected dragStore = DragStore.getInstance<D>();

    handleDragStart(e: DragEvent, data: D) {
      if (!e.dataTransfer) return;

      // Store the actual data object
      this.dragStore.setDragData(data);

      // Set a marker in dataTransfer to identify our drag operation
      e.dataTransfer.setData('application/drag-id', 'custom-drag');

      // Optional: Set allowed effects
      // e.dataTransfer.effectAllowed = 'move';
    }

    handleDragOver(e: DragEvent) {
      // Prevent default to allow drop
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move';
      }
    }

    handleDrop(e: DragEvent): D | undefined {
      // e.preventDefault();
      if (!e.dataTransfer) return;

      // Check if this is our drag operation
      const dragId = e.dataTransfer.getData('application/drag-id');
      if (dragId !== 'custom-drag') return;

      // Retrieve the actual data
      return this.dragStore.getDragData();
    }


  };
  return DragMixinClass;
}

export default DragMixin;


