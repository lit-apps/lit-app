import { css, CSSResult } from 'lit';

/**
 * CSS styles for badge components.
 *
 * This style defines the appearance of badges, including their size, color, background color,
 * text alignment, and other visual properties. It supports customization through CSS variables.
 *
 *
 * Additional classes for specific badge types:
 * - `.secondary.badge` and `code.badge`: Default color and background color, with a border.
 * - `.success.badge`: Background color for success state.
 */
const style: CSSResult = css`
    
    .badge {
      max-width: var(--badge-max-width, 150px);
      min-width: calc( var(--badge-font-size, var(--font-size-x-small)) + 5px);
      text-align: center;
      opacity: var(--badge-opacity, 1.0);
      color: var(--badge-color, var(--mdc-theme-on-primary));
      background-color: var(--badge-background-color, var(--color-accent));
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      border-radius: var(--badge-border-radius, 2px);
      font-size:  var(--badge-font-size, var(--font-size-x-small));
      padding: 2px 3px;
      cursor: pointer;
      margin-left: var(--badge-margin-left, 2px);
      margin-right: var(--badge-margin-right, 2px);
      vertical-align: middle;
    }

    .secondary.badge, code.badge {
        color: initial;
        background-color: initial;
        border: var(--badge-color, var(--color-secondary-text)) 1px solid;
    }
    .success.badge {
      background-color: var(--color-success);
      
  }
    
`;

export default style;
