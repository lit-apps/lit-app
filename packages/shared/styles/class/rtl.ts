import { CSSResult, css } from 'lit';

/**
 * Style for rotating element by 180 deg when rtl
 */
const styles: CSSResult = css`
  :host-context([dir=rtl]) .rtl-mirror {
    transform: rotate(180deg);
  }
`;

export default styles; 