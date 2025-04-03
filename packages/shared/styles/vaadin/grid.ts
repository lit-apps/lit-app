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
    /* --vaadin-grid-cell-padding: 6px 16px; */
  }

  :host([theme~='tree']) [part~='level-0'] {
    font-weight: var(--font-weight-bold);
  }
  :host([theme~='tree']) [part~='level-1'] {
    font-weight: var(--font-semi-bold);
  }
  /* :host([theme~='tree']) [part~='level-2'] {
    font-size: var(--font-size-small);
  } */
  :host([theme~='tree']) [part~='level-3'], 
  :host([theme~='tree']) [part~='level-4'] {
    font-size: var(--font-size-small);
  }
  :host([theme~='tree']) [part~='cell'] {
    min-height: 38px;
    cursor: pointer;
  }

`

// TODO: replace class by part
const util = css`
    [part~="cell"][part~="no-padding"] {
      --vaadin-grid-cell-padding:  var(--lumo-space-xs);
    }

    [part~="cell"].strong {
      font-weight: var(--font-weight-bold);
    }
    
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

// TODO: remove this when we do not use structure of form theme (Version 1)
const temp = css`
  :host([theme~="form"]) [part~="cell"].page,
  :host([theme~="form"]) [part~="cell"].templatePage,
  :host([theme~="form"]) [part~="cell"].dimension {
    font-weight: 600;
  }
  
  :host([theme~="form"]) [part~="cell"].section {
    font-size: 14px;
    font-weight: 500;
  }
  :host([theme~="form"]) [part~="cell"].question,
  :host([theme~="form"]) [part~="cell"].field,
  :host([theme~="form"]) [part~="cell"].option {
    font-size: 12px;
    min-height: 24px;
  }
  
  [part~="row"]>[part~="body-cell"].templatePage {
    background: var(--color-surface-container);
    color: var(--color-secondary-text);
  }
  
  :host([theme~="form"]) [part~="cell"].option {
    color: var(--color-secondary-text);
  }
  :host([theme~="form"][theme~="structure"]) [part~="cell"] {
    cursor: pointer;
  }

  :host([theme~="form"][theme~="structure"]) [part~="header-cell"] {
    cursor: pointer;
  }
  
  :host([theme~="form"][theme~="structure"]) [part~="header-cell"][first-column]:hover,
  :host([theme~="machine"][theme~="structure"]) [part~="header-cell"][first-column]:hover {
    background: var(--color-accent);
    color: var(--color-on-tertiary);
  }
  `

export {
  hover, temp, tree, util
};

registerStyles(
  'vaadin-grid',
  [hover, tree, util, temp]
)