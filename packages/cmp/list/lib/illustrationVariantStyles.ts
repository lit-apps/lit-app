/**
 * Style useful for list items with illustration variant (e.g. options in forms)
 */

import { css, CSSResult } from 'lit';
const styles: CSSResult = css`

/* This is to make slotted ent an start align horizontally*/
:host([data-variant='horizontal']) .start,
:host([data-variant='horizontal']) .end {
	flex-direction: row;
	align-items: center;
} 


slot[name="start"]::slotted([data-variant="illustration"]),
slot[name="end"]::slotted([data-variant="illustration"]) {
	width: max(140px, 12vw);
	height: max(140px, 12vw);
}

@media (max-width: 980px) {
	slot[name="start"]::slotted([data-variant="illustration"]),
	slot[name="end"]::slotted([data-variant="illustration"]) {
		width: max(110px, 12vw);
		height: max(110px, 12vw);
	}
}
`

export default styles;