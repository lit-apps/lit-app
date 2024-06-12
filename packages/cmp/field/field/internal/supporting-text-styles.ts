import { css } from 'lit';

const styles = css`
  .supporting-text > span:first-child {
    opacity: 1;
    transition: opacity var(--transition-quickly);
  }
 
  /** only display supporting-text on focus */
  :host(.textfield:not([focused]):not([persistSupportingText])) .supporting-text:not([role="alert"]) > span:not(.counter) {
      opacity: 0;
  }
  .supporting-text:not([role="alert"]) > span:not(.counter) {
      opacity: 1;
  }
`

export default styles;