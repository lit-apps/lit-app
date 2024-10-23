import { css, CSSResult } from 'lit';

/**
 * Tooltip styles for elements with the `data-title` attribute, excluding elements with the `lapp-youtube` tag.
 * 
 * The styles include positioning, transitions, and appearance for tooltips displayed on hover, focus, or active states.
 * 
 * - The tooltip content is displayed using the `::before` pseudo-element.
 * - An arrow pointing to the element is displayed using the `::after` pseudo-element.
 * - The tooltip can be positioned at the top, right, left, or bottom of the element.
 * - Custom properties (CSS variables) are used for colors, font properties, and z-index.
 * 
 * @example
 * ```html
 * <div data-title="Tooltip text">Hover over me</div>
 * ```
 */
const style: CSSResult = css`
  
  [data-title]:not(lapp-youtube) {
    position: relative;
  }
  
  [data-title]:not(lapp-youtube)::before,  [data-title]:not(lapp-youtube)::after {
    position: absolute;
    opacity: 0;
    will-change: opacity;
    transition: opacity 150ms;
    transform: translateX(-50%);
    left: 50%;
  }

  [data-title]:not(lapp-youtube)::before {
    content: attr(data-title);
    bottom: -32px;
    display: inline-block;
    padding: 5px 10px;
    border-radius: 3px;
    font-family: var(--mdc-typography-body2-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));
    font-size: var(--mdc-typography-body2-font-size, 0.875rem);
    line-height: var(--mdc-typography-body2-line-height, 1.25rem);
    font-weight: var(--mdc-typography-body2-font-weight, 400);
    letter-spacing: var(--mdc-typography-body2-letter-spacing, 0.0178571em);
    text-transform: var(--mdc-typography-body2-text-transform, inherit);
      background-color: var(--tooltip-background-color, rgb(51, 51, 51));
      color: var(--tooltip-color, rgba(255, 255, 255, 0.87));
      white-space: nowrap;
    }
    
    [data-title]:not(lapp-youtube)::after {
      bottom: -3px;
      border-bottom: 5px solid var(--tooltip-background-color, rgb(51, 51, 51));
      border-right: 5px solid transparent;
      border-left: 5px solid transparent;
      content: " ";
    }
    
    [data-title][top]:not(lapp-youtube)::before {
      top: -32px;
      bottom: unset;
    }

    [data-title][top]:not(lapp-youtube)::after {
      border-top: 5px solid var(--tooltip-background-color, rgb(51, 51, 51));
      top: -3px;
      border-bottom: unset;
    }
  
    [data-title][right]:not(lapp-youtube)::after, [data-title][right]:not(lapp-youtube)::before {
      transform: translateX(-100%);
      left: 100%;
    }
    [data-title][right]:not(lapp-youtube)::after {
      left: 80%;
    }

    [data-title][left]:not(lapp-youtube)::after, [data-title][left]:not(lapp-youtube)::before {
      transform: translateX(0%);
      left: 0;  
      /* right: 100%; */
    }
    [data-title][left]:not(lapp-youtube)::after {
      /* right: 80%; */
    }
   
   
    [data-title]:not(lapp-youtube):hover::before, [data-title]:not(lapp-youtube):hover::after,
    [data-title]:not(lapp-youtube):active::before, [data-title]:not(lapp-youtube):active::after,
    [data-title]:not(lapp-youtube):focus::before, [data-title]:not(lapp-youtube):focus::after {
      opacity: 1;
      z-index: var(--z-index-popup, 950);
    }
`;

export default style;
