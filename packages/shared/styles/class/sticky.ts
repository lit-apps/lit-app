import { CSSResult, css } from 'lit';

/**
 * A helper css for handling sticky element 
 * 
 * This is used by entity holder to make action bar sticky
 * 
 * it exposes 1 classes:
 * - .sticky : to make element sticky
 * 
 * TODO: implement class stuck being added when element is stuck,
 * see https://stackoverflow.com/questions/16302483/event-to-detect-when-positionsticky-is-triggered
 * 
 */
const style: CSSResult = css`
  .sticky {
    padding-bottom: var(--space-small);
    padding-top: var(--space-large);
    margin-bottom: calc( -1 * var(--space-small));
    margin-top: calc( -1 * var(--space-large));
    position: sticky;
    top: calc(64px - 0.5 * var(--space-small));
    /* 
    using z-index-sticky conflicts with z-index of header
    z-index: var(--z-index-sticky);  */
    z-index: 2;
    background-color: var(--color-background);
  }
  
`

export default style;