import { CSSResult, css } from 'lit';

/**
 * Global style for all components that user <lapp-icon>
 * See https://github.com/material-components/material-web/issues/4679
 */
const styles: CSSResult = css`
  md-icon {
    font-variation-settings: 'FILL' 1;
  }
`;

// @deprecated
export default styles;