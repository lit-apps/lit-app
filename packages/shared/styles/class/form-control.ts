import {css, CSSResult} from 'lit'

/**
 * CSS styles for the control elements in the application.
 * 
 * This is used in form and form builder
 * 
 * TODO: this should not be a shared style, but moved fo the form Package
 * 
 * These styles define the positioning, transitions, and responsive behavior
 * of the control elements, including floating action buttons (FABs).
 * 
 * - The `#controls` element is positioned fixed at the bottom of the screen
 *   with specific padding and z-index to ensure it appears above other elements.
 * - FABs within `#controls` have hover, focus, and active states that scale
 *   the button for visual feedback.
 * - Disabled FABs are scaled down to zero.
 * - The `.fabs` class within `#controls` has different maximum widths based on
 *   the presence of certain classes or attributes.
 * - RTL (right-to-left) support is provided by adjusting the `right` and `left`
 *   properties based on the `dir` attribute.
 * - Media queries adjust the `left` property of `#controls` for different screen
 *   widths to ensure proper layout on smaller screens.
 */
const styles: CSSResult = css`
    #controls {
      position: fixed;
      bottom: 32px;
      padding: 0 24px;
      right: 0;
      left: 340px;
      /* z-index: var(--z-index-sticky);
        we hard-code z-index because .mdc-drawer has an z-index of 6 */
      z-index: 6;
      pointer-events: none;
    }
    

    #controls md-fab:focus,
    #controls [fab]:focus,
    #controls md-fab:hover,
    #controls [fab]:hover,
    #controls md-fab:active,  
    #controls [fab]:active  {
      transform: scale(1.12);  
    }

    #controls md-fab,
    #controls [fab] {
      pointer-events: all;
      transition: transform .2s ease-in-out;
    }

    #controls md-fab[disabled],
    #controls [fab][disabled] {
      transform: scale(0);
    }

    #controls .fabs {
      max-width: calc(var(--pfo-page-max-width) + 210px);
      margin: auto;
    }
    #controls .fabs.is-first {
      max-width: calc(var(--pfo-page-max-width) + 360px);
    }
    #controls[easyread] .fabs {
      max-width: calc(1.1 * var(--pfo-page-max-width) + 300px);
      margin: auto;
    }

     /* RTL */
     :host-context([dir=rtl]) #controls {
      right: 256px;
      left: 0;
    }

    #controls:dir(rtl) {
      right: 256px;
      left: 0;
    }

    @media (max-width: 1400px) {
      #controls {
         left: 256px;
      }
    }
    
    @media (max-width: 992px) {
      #controls {
        left: 0;
      }
     
     :host-context([dir=rtl]) #controls {
       right: 0;
     }
    
     #controls:dir(rtl) {
       right: 0;
     }
    }
`;

// @deprecated
export default styles