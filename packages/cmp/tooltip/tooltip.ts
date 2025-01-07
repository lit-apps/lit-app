// import PwiTooltip from "@preignition/pwi-tooltip/src/pwi-tooltip.js";
import { customElement } from 'lit/decorators.js';
import '@vaadin/tooltip/vaadin-lit-tooltip.js';
import {Tooltip} from '@vaadin/tooltip/src/vaadin-lit-tooltip.js';

import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
const tooltipOverlay = css`
  [part='overlay'] {
    background: var(--color-inverse-surface) linear-gradient(var(--lumo-contrast-5pct), var(--lumo-contrast-5pct));
    color: var(--color-inverse-on-surface);
  }
`;

registerStyles('vaadin-tooltip-overlay', [tooltipOverlay], { moduleId: 'lumo-tooltip-overlay' });

/**
 * A tooltip component.
 * 
 * @example 
 * ```html
 * <lapp-tooltip text="tooltip" for="button" ></lapp-tooltip>
 * <md-filled-icon-button id="button" toggle aria-label="Label"
 *   <lapp-icon>format_bold</lapp-icon>
 * </md-filled-icon-button>
 * ``` 
 */
// @ts-expect-error = Tooltip types not properly exported
@customElement('lapp-tooltip')
export default class lappTooltip extends Tooltip {

}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-tooltip': lappTooltip;
  }
}
