import { css, CSSResult } from 'lit';

/**
 * Defines the CSS styles for card components including custom properties for background, border, and padding.
 * 
 * - `:host`:
 *   - `--_card-background`: Background color of the card, defaults to `--card-background` or `--lumo-shade-5pct`.
 *   - `--_card-border-radius`: Border radius of the card, defaults to `--card-border-radius` or `--space-xxx-large`.
 *   - `--_card-border-width`: Border width of the card, defaults to `--card-border-width` or `3px`.
 *   - `--_card-border-color`: Border color of the card, defaults to `--card-border-color` or `--lumo-contrast-20pct`.
 *   - `--_card-border-radius-hover`: Border radius of the card on hover, defaults to `--card-border-radius-hover` or `--space-large`.
 *   - `--_card-padding`: Padding of the card, defaults to `--card-padding` or `--lumo-space-m`.
 * 
 * - `.card`, `vaadin-card`, `lapp-card`:
 *   - Applies a transition effect to the border-radius property.
 * 
 * - `.card`:
 *   - Sets the background, border-radius, border-width, border-color, padding, and border-style properties using the custom properties defined in `:host`.
 * 
 * - `vaadin-card`, `lapp-card`:
 *   - Sets the Vaadin card component's background, border-radius, border-width, border-color, and padding using the custom properties defined in `:host`.
 * 
 * - `.card:hover`, `vaadin-card:hover`, `lapp-card:hover`:
 *   - Changes the border-radius property on hover using the `--_card-border-radius-hover` custom property.
 */
const style: CSSResult = css`

    :host {
     
    }
    .card, vaadin-card, lapp-card {
      --_card-background: var(--card-background, var(--lumo-shade-5pct));
      --_card-border-radius: var(--card-border-radius, var(--space-xxx-large));
      --_card-border-width: var(--card-border-width, 3px);
      --_card-border-color: var(--card-border-color, var(--lumo-contrast-20pct));
      --_card-border-radius-hover: var(--card-border-radius-hover, var(--space-large));
      --_card-padding: var(--card-padding, var(--space-large));
      transition: all var(--transition-quickly);
    }
    .card {
      background: var(--_card-background);
      border-radius: var(--_card-border-radius);
      border-width: var(--_card-border-width);
      border-color: var(--_card-border-color);
      padding: var(--_card-padding);
      border-style: solid;
    }

     vaadin-card, lapp-card {
      --vaadin-card-background: var(--_card-background);
      --vaadin-card-border-radius: var(--_card-border-radius);
      --vaadin-card-border-width: var(--_card-border-width);
      --vaadin-card-border-color: var(--_card-border-color);
      --vaadin-card-padding: var(--_card-padding);
    }

    .card:hover, vaadin-card:hover,  lapp-card:hover {
      border-radius: var(--_card-border-radius-hover);
    }
    
`;

export default style;
