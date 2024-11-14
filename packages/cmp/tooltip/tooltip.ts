import PwiTooltip from "@preignition/pwi-tooltip/src/pwi-tooltip.js";
import { customElement } from 'lit/decorators.js';

/**
 * A tooltip component.
 * 
 * @example 
 * ```html
 * <pwi-tooltip skipFocus discrete message="tooltip" position="bottom">
 *   <md-filled-icon-button toggle aria-label="Label"
 *     <lapp-icon>format_bold</lapp-icon>
 *   </md-filled-icon-button>
 * </pwi-tooltip>
 * ``` 
 */
@customElement('lapp-tooltip')
export default class lappTooltip extends PwiTooltip {

}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-tooltip': lappTooltip;
  }
}
