import { registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { css, CSSResult } from "lit";


const hover: CSSResult = css`
  /**
  * Add hover style for lumo;    
  */
  :host(:not([reordering])) [part~='row']:hover:not([selected]) [part~='body-cell']:not([part~='details-cell']),
  :host(:not([reordering])) [part~='row'] [part~='body-cell'].highlight:not([part~='details-cell']) {
    background-image: linear-gradient(var(--color-surface-container), var(--color-surface-container));
    background-repeat: repeat;
  }
`

const tree: CSSResult = css`
  :host([theme~='tree'])  {
    --vaadin-grid-cell-padding: 6px 16px;
  }

  :host([theme~='tree']) [part~='level-0'] {
    font-weight: var(--font-weight-bold);
  }
  :host([theme~='tree']) [part~='level-1'] {
    font-weight: var(--font-semi-bold);
  }
  :host([theme~='tree']) [part~='level-2'] {
    font-size: var(--font-size-small);
  }
  :host([theme~='tree']) [part~='cell'] {
    min-height: 38px;
    cursor: pointer;
  }

`

const util = css`
    [part~="cell"].primary {
      color: var(--color-on-primary-container);
      background-image: linear-gradient(var(--color-primary-container), var(--color-primary-container));
    }
    [part~="cell"].removing,
    [part~="cell"].warning {
      color: var(--color-on-warning-container);
      background-image: linear-gradient(var(--color-warning-container), var(--color-warning-container));
    }
    [part~="cell"].removing:after {
      content: 'removing... ';
      position: absolute;
      font-weight: var(--font-semi-bold);
      right: 5px;
    }
    
`

export {
  hover, tree, util
};

registerStyles(
  'vaadin-grid',
  [hover, tree, util]
)