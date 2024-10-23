import { css, CSSResult } from 'lit';

/**
 * CSS styles for slot elements within a `md-list` or `md-select-option` element.
 *
 * - Defines default sizes for slot elements using CSS custom properties.
 * - Customizes the appearance of elements with specific slot attributes (`start` and `end`).
 * - Adjusts the size and appearance of elements with classes such as `avatar`, `video`, `icon`, and `illustration`.
 * - Sets specific styles for `lapp-icon` elements based on their slot and class attributes.
 * 
 * @example
 * ```html
 * <md-list style="max-width: 300px;">
 *	 <md-list-item>
 *	   Cat
 *	   <img slot="start" class="avatar" src="https://placekitten.com/112/112">
 *	 </md-list-item>
 *	 <md-divider></md-divider>
 *	 <md-list-item>
 *	   Kitty Cat
 *	   <img slot="start" class="avatar" src="https://placekitten.com/114/114">
 *	 </md-list-item>
 *	 <md-divider></md-divider>
 *	 <md-list-item>
 *	   Cate
 *	   <img slot="start" class="avatar" src="https://placekitten.com/116/116">
 *	 </md-list-item>
 * </md-list>
 * ```
 */
const style: CSSResult = css`
		:host {
			--_slot-start-size: var(--slot-start-size, 32px);
			--_slot-end-size: var(--slot-end-size, 32px);
		}

		[slot="start"].avatar {
			--_slot-start-size: var(--slot-start-size, 40px);
			--_slot-end-size: var(--slot-end-size, 40px);
			border-radius: 50%;
			background-color: var(--color-surface-container-highest);
		}

		[slot="start"].video {
			--_slot-start-size: var(--slot-start-size, 100px);
			--_slot-end-size: var(--slot-end-size, 100px);
		}

    [slot="start"].icon,
    [slot="start"].avatar,
    [slot="start"].video,
    [slot="start"].illustration {
			width: var(--_slot-start-size);
		}
		[slot="end"].icon,
    [slot="end"].avatar,
    [slot="end"].video,
    [slot="end"].illustration {
			width: var(--_slot-end-size);
		}

		lapp-icon[slot="start"], lapp-icon[slot="end"]{
			height: var(--_slot-start-size);
		}
		lapp-icon[slot="start"].avatar, lapp-icon[slot="end"].avatar {
			--lapp-icon-margin: 5px;
		}
`;

export default style;
