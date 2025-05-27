import { css, CSSResult } from 'lit'


/**
 * Styles for the action bar component.
 * 
 * The styles include:
 * - Positioning the action bar fixed at the bottom-right corner of the viewport.
 * - Using CSS variables for spacing and z-index values.
 * - Displaying the action bar as a flex container with row-reverse direction.
 * - Adding a transition effect to the floating action buttons (FAB) within the action bar.
 * - Scaling the FAB on focus, hover, and active states.
 * - Hiding the FAB when it is disabled.
 * - Adjusting the right position of the action bar for viewports with a max-width of 1280px.
 */
const styles: CSSResult = css`
	#actions {
		position: fixed;
		bottom: calc( 2 * var(--space-large, 36px));
		right: calc( 2 * var(--space-xx-large, 36px));
		display: flex;
		gap: var(--space-large);
		/* z-index:var(--z-index-sticky, 300); */
  	/* we hard-code z-index because .mdc-drawer has an z-index of 6 */
		z-index: 6;
		flex-direction: row-reverse;
	}
	
	#actions .fab  {
		transition: transform .2s ease-in-out;
	}

	#actions .fab:focus,
	#actions .fab:hover,
	#actions .fab:active{
		transform: scale(1.12);  
	}

	#actions .fab[disabled] {
		transform: scale(0);
	}
	@media (max-width: 1280px) {
		#actions {
			right: calc( 2 * var(--space-large, 36px));
		}
	}
   
`
export default styles