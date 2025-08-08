import { css, CSSResult } from 'lit';

/**
 * CSS styles for the Table of Contents (TOC) component.
 * 
 * This stylesheet defines various CSS custom properties and styles for the TOC component,
 * including its container, items, and icons. The styles are designed to be responsive and 
 * adaptable to different states such as active, emphasis, and invalid.
 * 
 * Custom Properties:
 * - `--_toc-color`: Color for the TOC text.
 * - `--_toc-hover-color`: Color for the TOC text on hover.
 * - `--_toc-supporting-color`: Color for supporting text in the TOC.
 * - `--_toc-container-color`: Background color for the TOC container.
 * - `--_toc-icon-color`: Color for the TOC icons.
 * - `--_toc-icon-container-color`: Background color for the TOC icon containers.
 * - `--_toc-icon-border-color`: Border color for the TOC icons.
 * - `--_toc-icon-size`: Size of the TOC icons.
 * 
 * Styles:
 * - `:host`: Defines the custom properties for the TOC component.
 * - `md-list[toc]`: Styles for the TOC list, including margin and width.
 * - `[toc] [md-list-item]`: Styles for individual TOC items, including background, text colors, and hover states.
 * - `[narrow] [toc] [md-list-item]`: Styles for TOC items in narrow view, including height and margins.
 * - `[narrow] [toc] [large]`: Styles for large TOC items in narrow view, including width and padding.
 * - `[toc] [emphasis]`: Styles for emphasized TOC items, including icon colors.
 * - `[toc] [invalid]`: Styles for invalid TOC items, including icon colors.
 * - `[toc] [active]`: Styles for active TOC items, including text and background colors.
 * - `[toc] [slot=start]`: Styles for the TOC icons, including size, border, and alignment.
 * - `[toc] [slot=start] > *`: Styles for the content inside TOC icons.
 * - `[toc] [large]`: Styles for large TOC items, including icon size and text weight.
 * - `[toc] [large] [slot=start]`: Styles for large TOC icons, including margin.
 * - `[toc] [large] lapp-icon`: Styles for large TOC icons, including width and height.
 * - `[toc] [md-list-item]:not(:first-of-type) [slot=start]::before, [toc] [md-list-item]:not(:last-of-type) [slot=start]::after`: Styles for the lines connecting TOC icons.
 * - `[toc] [slot=start]:before`: Styles for the line above TOC icons.
 * - `[toc] [slot=start]:after`: Styles for the line below TOC icons.
 */
const style: CSSResult = css`

  :host {
    --_toc-color: var(--color-on-surface);
    --_toc-hover-color: var(--color-primary);
    --_toc-supporting-color: var(--color-on-surface-variant);
    --_toc-container-color: var(--toc-container-color, var(--color-surface));
    --_toc-icon-color: var(--toc-icon-color, var(--color-on-surface));
    --_toc-icon-container-color: var(--toc-icon-container-color, var(--color-surface));
    --_toc-icon-border-color: var(--toc-icon-border-color, var(--color-outline));
    --_toc-icon-size:  var(--toc-icon-size, 38px);
  }

  
  md-list[toc] {
    margin-bottom: 150px; /* adding a margin to make scroll work in fixed menu */
    /* min-width: 100%; */
  }

  /** this is the item */
  [toc] [md-list-item] {
    background: var(--_toc-container-color);
    --md-list-item-label-text-color: var(--_toc-color);
    --md-list-item-supporting-text-color: var(--_toc-supporting-color);
    --md-list-item-hover-label-text-color: var(--_toc-color);
    --md-list-item-pressed-label-text-color: var(--_toc-color);
    --md-list-item-focus-label-text-color: var(--_toc-color);
    --md-list-item-two-line-container-height: 65px;
    --md-list-item-hover-state-layer-color: var(--color-primary);
    --md-list-item-hover-label-text-color: var(--_toc-hover-color);
   }
   
   [narrow] [toc] [md-list-item] {
      max-height: 60px;
      margin-left: -8px;
      margin-right: -22px;
      align-items: center;
      overflow: hidden;
   }

   [narrow] [toc] [large] {
    width: 97px;
    padding: 3px 0px;
   }
  
  [toc] [emphasis] {
    --_toc-icon-container-color: var(--color-primary);
    --_toc-icon-color: var(--color-on-primary);
    --_toc-icon-border-color: transparent;
  }
  [toc] [invalid] {
    --_toc-icon-container-color: var(--color-on-error);
    --_toc-icon-color: var(--color-error);
    --_toc-icon-border-color:  var(--toc-icon-border-color, var(--color-outline));
  }
  [toc] [active] {
    --_toc-color: var(--color-on-primary);
    --_toc-hover-color: var(--color-on-primary);
    --_toc-supporting-color: var(--color-on-primary);
    --_toc-container-color: var(--color-primary);
    // --md-list-item-hover-state-layer-color: var(--color-secondary);
  } 


  /** this is the graphic */
  [toc] [slot=start] {
    overflow: visible;
    position:relative;
    border: 3px solid var(--_toc-icon-border-color);
    display: flex;
    background-color: var(--_toc-icon-container-color);
    border-radius: 50%;
    color: var(--_toc-icon-color);
    width: var(--_toc-icon-size);
    height: var(--_toc-icon-size);
    align-items: center;
    justify-content: space-around;
  }
  [toc] [slot=start] > * {
    margin: auto;
  }

  [toc] [large] {
    --_toc-icon-size:  56px;
    --md-list-item-label-text-weight: 500;
  }
  [toc] [large] [slot=start] {
    margin-inline-start: -9px;
  }
  [toc] [large] lapp-icon {
    width: 32px;
    height: 32px;
  }
  
  [toc] [md-list-item]:not(:first-of-type) [slot=start]::before,[toc] [md-list-item]:not(:last-of-type) [slot=start]::after {
    content: '';
    color: var(--color-on-background, rgba(0, 0, 0, 0.38));
    display: block;
    position: absolute;
    border-left: 2px solid;
    height: 30px;
  }
  [toc] [slot=start]:before {
    top: -30px;
    left: 50%;
    right: 50%;
  }
  [toc] [slot=start]:after {
    top: var(--_toc-icon-size);
    left: 50%;
    right: 50%;
  }



 `;

export default style;
