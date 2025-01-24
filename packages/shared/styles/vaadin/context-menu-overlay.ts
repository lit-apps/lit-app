import { registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { css, CSSResult } from "lit";

const style: CSSResult = css`
  /**
  * Add hover style for lumo;    
  */
  :host([theme~='dense']) [part~='content'] {
    padding: 0;
  }
`

export default style;

registerStyles(
  'vaadin-context-menu-overlay',
  style
)