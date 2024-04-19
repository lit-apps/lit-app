import { Fab as WebFab } from "@material/web/fab/internal/fab";
import { property } from "lit/decorators.js";

export class Fab extends WebFab {

  /**
   * if true take primary color as background color - as per filled-button
   */
  @property({ type: Boolean}) filled = false;

  protected override getRenderClasses() {
    const isExtended = !!this.label;
    // const isFilled = !!this.filled;
    // this allows large to be used with extended
    return {
      ...super.getRenderClasses(),
      'lowered': this.lowered,
      'small': this.size === 'small' && !isExtended,
      'large': this.size === 'large',
      'extended': isExtended,
      // 'filled': isFilled,
    };
  }
}