import { css } from "lit";

/**
 * CSS styles for the top card component.
 * 
 * exposes a class .top-card to style a card that is centered in the page
 * with a max-width of 900px and a box shadow.
 */
const styles = css`
  .top-card {
	  max-width: min(900px, calc(100% - 150px));
    margin: 10vh auto;
    min-height: 300px;
    padding: 50px;
    box-shadow: var(--shadow-material);
  }
`

export default styles;