import { CSSResult, css } from 'lit';

/**
 * This CSSResult defines styles for setting maximum width and height using CSS variables.
 *
 * It provides classes to set the `--_mw` CSS variable based on predefined max-width sizes
 * (x-small, small, medium, large, x-large, xx-large, xxx-large).  The `.mw` class then
 * applies this `--_mw` variable to the `max-width` property.
 * 
 * **Default values for max-width:**
 * 
 * - x-small: 200px
 * - small: 300px
 * - medium: 400px
 * - large: 600px
 * - x-large: 800px
 * - xx-large: 1200px
 * - xxx-large: 1400px  
 *
 * It also defines a `.mh` class that sets `max-height` to the value of the `--_mh` CSS variable.
 */
const style: CSSResult = css`
  .mw.s-x-small {
    --_mw: var(--max-width-x-small);
  }
  .mw.s-small {
    --_mw: var(--max-width-small);
  }
  .mw.s-medium {
    --_mw: var(--max-width-medium);
  }
  .mw.s-large {
    --_mw: var(--max-width-large);
  }
  .mw.s-x-large {
    --_mw: var(--max-width-x-large);
  }
  .mw.s-xx-large {
    --_mw: var(--max-width-xx-large);
  }
  .mw.s-xxx-large {
    --_mw: var(--max-width-xxx-large);
  }
  .mw {
    max-width: var(--_mw);	
  }
  .mh {
    max-height: var(--_mh);	
  }

`

export default style;