import type { Grid } from '@vaadin/grid';
import { announce } from '../a11y/announce.js';
type activeGrid = Grid & { previousActive: any }


/**
 * Handles the `activeItemChanged` event for a grid component.
 * 
 * @param e - The custom event triggered when the active item changes.
 * 
 * The function performs the following actions:
 * 1. Checks if the event target exists.
 * 2. Casts the event target to an `activeGrid` type.
 * 3. Closes the details of the previously active item if it exists.
 * 4. Opens the details of the new active item if it exists.
 * 5. Sets the new active item as the previous active item.
 * 6. Sets focus on the element with the `focus-on-activate` attribute after a short delay.
 */
export const activeItemChanged = (e: CustomEvent) => {
  if (!e.target) { return }
  const grid: activeGrid = (e.target as activeGrid);
  const { previousActive } = grid;
  if (previousActive) {
    grid.closeItemDetails(previousActive);
    announce('Item details closed');
  }
  if (e.detail.value) {
    grid.openItemDetails(e.detail.value);
    grid.previousActive = e.detail.value;
    const id = e.detail.value.$id;
    const selector = id ? `*[focus-on-activate="${id}"]` : '*[focus-on-activate]';
    announce('Item details opened');
    // this is for improving the accessibility. Without this, the focus is not set on detail cell.
    setTimeout(() => {
      const focus = grid.querySelector(selector) as HTMLInputElement;
      if (focus) {
        focus.focus();
      }
    }, 50);
  }
};
