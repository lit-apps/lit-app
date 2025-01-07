import { css } from 'lit';
const style = css`
		:host(:not([nodrop])) [droppable] {
		transition: border-color 0.6s;
		position: relative;
	}

	:host([dragover-valid]) [droppable] {
		// border-color: var(--color-primary);
		border: solid 2px var(--color-primary);
		transition: border-color 0.1s;
	}

	/* Ripple */
	[droppable]::before {
		content: "";
		position: absolute;
		width: 100px;
		height: 100px;
		border-radius: 50%;
		top: 50%;
		left: 50%;
		pointer-events: none;
		background-color: var(--color-primary);
		opacity: 0;
		z-index: 1;
		transform: translate(-50%, -50%) scale(0);
		transition: transform 0s cubic-bezier(.075, .82, .165, 1), opacity 0.4s linear;
		transition-delay: 0.4s, 0s;
	}

	:host([dragover-valid]) [droppable]::before {
		transform: translate(-50%, -50%) scale(20);
		opacity: 0.1;
		transition-duration: 2s, 0.1s;
		transition-delay: 0s, 0s;
	}
`;

export default style
