import {css, CSSResult} from 'lit'


/**
 * Styles for the bottom bar component.
 * 
 * The difference with action-bar is that bottom-nav-bar is thought to be used 
 * with a `nav` element.
 * 
 * - The `#controls` element is positioned fixed at the bottom with padding and a z-index of 6.
 * - The `#controls .fab` elements scale up when focused, hovered, or active, and have a transition effect.
 * - The `#controls .layout` element has a gap defined by the `--space-large` CSS variable.
 * - Disabled `#controls .fab` elements are scaled down to 0.
 * - The `#controls .fabs` element is displayed as a flex container with row-reverse direction, centered margin, and a gap defined by the `--space-medium` CSS variable.
 */
const styles: CSSResult = css`
    #controls {
      position: fixed;
      bottom: 45px;
      padding: 0 50px;
      right: 0;
      left: 0;
      /* z-index: var(--z-index-sticky);
       we hard-code z-index because .mdc-drawer has an z-index of 6 */
      z-index: 6;
      pointer-events: none;
    }
    
    #controls .fab:focus,
    #controls .fab:hover,
    #controls .fab:active{
      transform: scale(1.12);  
    }
    #controls .fab  {
      pointer-events: all;
      transition: transform .2s ease-in-out;
    }
    #controls .layout {
      gap: var(--space-large);
    }
    #controls .fab[disabled] {
      transform: scale(0);
    }
    #controls .fabs {
			display: flex;
			flex-direction: row-reverse;
      margin: auto;
      gap: var(--space-medium);
    }
   
`
export default styles