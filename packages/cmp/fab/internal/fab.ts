import { Fab as WebFab } from "@material/web/fab/internal/fab";
import { property } from "lit/decorators.js";

export class Fab extends WebFab {

  @property({ type: Boolean, reflect: true }) fab = true;

  protected override getRenderClasses() {
    const isExtended = !!this.label;
    // this allows large to be used with extended
    return {
      ...super.getRenderClasses(),
      'lowered': this.lowered,
      'small': this.size === 'small' && !isExtended,
      'large': this.size === 'large',
      'extended': isExtended,
    };
  }
}