import { css, CSSResult } from 'lit';

/**
 * Defines CSS styles for `md-tabs` component with `inverted` and `inverted.secondary` variants.
 * 
 * - `md-tabs.inverted`:
 *   - Sets the surface color to transparent.
 *   - Sets the primary color to the value of `--color-on-primary`.
 *   - Sets the on-surface-variant color to the value of `--color-surface-variant`.
 *   - Sets the on-surface color to the value of `--color-inverse-on-surface`.
 * 
 * - `md-tabs.inverted.secondary`:
 *   - Sets the primary color to the value of `--color-on-secondary`.
 *   - Sets the on-surface-variant color to the value of `--color-surface-variant`.
 *   - Sets the on-surface color to the value of `--color-inverse-on-surface`.
 */
const style: CSSResult = css`
    
    md-tabs.inverted {
			--md-sys-color-surface: transparent;
			--md-sys-color-primary: var(--color-on-primary);
			--md-sys-color-on-surface-variant: var(--color-surface-variant);
			--md-sys-color-on-surface: var(--color-inverse-on-surface);
    }

		md-tabs.inverted.secondary {
			--md-sys-color-primary: var(--color-on-secondary);
			--md-sys-color-on-surface-variant: var(--color-surface-variant);
			--md-sys-color-on-surface: var(--color-inverse-on-surface);
    }
    
`;

export default style;
