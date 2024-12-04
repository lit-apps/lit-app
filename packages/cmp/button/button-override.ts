import { Button } from '@material/web/button/internal/button';
import isSafari  from '@lit-app/shared/isSafari';
/**
 * Override initial version of button to make sure buttons are accessible with 
 * Safari + VoiceOver
 * The problem we are having is https://bugs.webkit.org/show_bug.cgi?id=264410
 * 
 * We shall remove this override once the issue is fixed and deployed in Safari!
 * 
 * The bug is fixed on Safari 17.2 (11/12/2023) https://developer.apple.com/documentation/safari-release-notes/safari-17_2-release-notes
 * We shall remove this end of Jan. 2023.
 */


if (isSafari) {

	// @ts-expect-error - firstUpdated is a protected method
	const firstUpdated = Button.prototype.firstUpdated;
	// @ts-expect-error - firstUpdated is a protected method
	Button.prototype.firstUpdated = function (props) {
		const slot = this.renderRoot.querySelector('slot:not([name])');
		const onSlotchange = (e) => {
			if (!this.ariaLabel) {
				this.ariaLabel = e.target.assignedNodes().map(n => n.textContent).join(' ').trim()
			}
		}
		slot?.addEventListener('slotchange', onSlotchange);
		firstUpdated?.(props);
	}

}