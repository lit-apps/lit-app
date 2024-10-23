import { CSSResult, css } from 'lit';

/**
 * A helper css for handling screen reader only elements
 * 
 * it exposes 1 classes:
 * - .sr-only : only visible to screen reader
 * 
 */
const style: CSSResult = css`
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
  
`

export default style;