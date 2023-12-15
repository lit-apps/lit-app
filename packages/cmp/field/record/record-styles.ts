import { css } from 'lit';



const styles = css`
	@keyframes growShrink {
		0% {
      transform: scale(1) ;
    }
    50% {
      transform: scale(1.3);
    }
		100% {
			transform: scale(1);
		}
	}

	:host {
		display: inline-flex !important; /** we add important so that all:unset does not affect this. */
		gap: calc(2 * var(--_gap)) !important; /** we add important so that all:unset does not affect this. */
		flex-direction: column;
		--md-outlined-button-icon-size: 24px;
		--md-filled-button-icon-size: 24px;
		--_gap: var(--record-gap, 4px);
		--_supporting-text-color: var(--record-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));
    --_supporting-text-type: var(--record-supporting-text-type, 400 0.75rem / 1rem var(--md-ref-typeface-plain, Roboto));
	}

	:host > .ct {
		gap: calc(2 * var(--_gap));
		width: 100%;
		min-height: 56px;
	}

	:host([recording]) lapp-icon.animate {
		animation: growShrink 1s ease-in-out infinite;
	}
	:host([pausing]) lapp-icon.animate {
		animation: unset;
	}
	
	md-linear-progress[data-almost-complete] {
	--md-linear-progress-active-indicator-color: var(--color-warning, #ff1100);
	}



	.ct {
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-wrap: wrap;
		gap: var(--_gap);
	}

	.supporting-text {
		align-self: center
	}


	#display {
		flex: 1;
	}

	#display:has(md-linear-progress) {
    padding: 25px;
    border-radius: 25px;
    background: var(--color-surface-container-lowest);
	}

	#controls {
		width: 280px;
	}

	#controls.narrow {
		width: 208px;
	}



	.flex {
		flex: 1;
	}
	md-linear-progress, audio {
		width: 100%;
	}
	
	audio {
		min-width: 200px;
	}
	.supporting-text {
		color: var(--_supporting-text-color);
    font: var(--_supporting-text-type);
	}

`;
export default styles;	