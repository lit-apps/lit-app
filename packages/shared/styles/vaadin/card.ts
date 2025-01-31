import { registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { css, CSSResult } from "lit";


/**
 * User theme for vaadin-card
 */
const user: CSSResult = css`
  :host([theme~='user']) [part~='media'] {
    max-height: 350px;
    filter: grayscale(80%);
  }
  /* :host([theme~='user']) [part~='tile'] {
    font-size: var(--font-size-large);
  } */
`
registerStyles(
  'vaadin-card',
  user
)
export { user };
