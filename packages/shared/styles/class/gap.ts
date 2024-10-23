import { CSSResult, css } from 'lit';

/**
 * Defines CSS styles for layout gaps with various sizes and orientations.
 * 
 * - `.layout`: Base layout class with a small gap.
 * - `.small`: Applies an extra small gap.
 * - `.layout.medium`: Applies a medium gap.
 * - `.layout.large`: Applies an extra large gap.
 * - `.layout.no-gap`: Removes the gap.
 * - `.layout.vertical .no-gap`: Adjusts the margin to simulate no gap in vertical layouts.
 * - `.layout.horizontal .no-gap`: Adjusts the margin to simulate no gap in horizontal layouts.
 * 
 * The gap sizes are controlled by CSS custom properties:
 * - `--space-small`
 * - `--space-xx-small`
 * - `--space-medium`
 * - `--space-x-large`
 * 
 * The `--_layout-gap` custom property is used internally to manage the gap size.
 */
const style: CSSResult = css`
.layout {
  --_layout-gap: var(--space-small);
   gap: var(--_layout-gap, var(--space-small));
}

.small {
  --_layout-gap: var(--space-xx-small);
  gap: var(--_layout-gap, var(--space-xx-small));
 }

.layout.medium {
  --_layout-gap: var(--space-medium);
  gap: var(--_layout-gap, var(--space-medium));
}

.layout.large {
  --_layout-gap: var(--space-x-large);
  gap: var(--_layout-gap, var(--space-x-large));
}
.layout.no-gap {
  gap: unset;
}

/** Do as if there is no gap */
.layout.vertical .no-gap {
  margin-bottom: calc( -1 * var(--_layout-gap, var(--space-small)));
}

/** Do as if there is no gap */
.layout.horizontal .no-gap {
  margin-right: calc( -1 * var(--_layout-gap, var(--space-small)));
}
`

export default style;