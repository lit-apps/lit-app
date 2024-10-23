import { css, CSSResult } from 'lit';
import accessibilityLinks from './accessible-links';

/**
 * Defines the typography styles for the application.
 * 
 * - Sets the default font family for the body and html elements.
 * - Applies specific font families and styles to heading elements (h1-h6).
 * - Sets margins for headings, paragraphs, and unordered lists.
 * - Optimizes text rendering for headings and anchor elements.
 * - Defines font sizes, weights, letter spacing, and line heights for headings.
 * - Provides styles for anchor elements, including transitions and hover/active states.
 * - Specifies font family for code elements.
 * - Includes utility classes for underline, capitalization, secondary text color, and ellipsis text overflow.
 * - Contains a commented-out section for body color overrides.
 * - Integrates accessibility links.
 * 
 */
const style: CSSResult = css`
body, html {
  font-family: var(--font-family-text);
  -webkit-font-smoothing: antialiased;  /* OS X subpixel AA bleed bug */
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-family-heading, Roboto);
}

h1, h2, h3, h4, h5, h6, p, ul{
  margin: 0 0 var(--margin-header-bottom, 20px) 0;
}

h1, h2, h3, h4, h5, h6, a {
  text-rendering: optimizeLegibility;
}

h1 {
  font-size: var(--font-size-xxx-large, 45px);
  font-weight: var(--font-weight-normal, 400);
  letter-spacing: -.018em;
  line-height: 1.1;
}

h2 {
  font-size: var(--font-size-xx-large, 34px);
  font-weight: var(--font-weight-normal, 400);
  letter-spacing: var(--letter-spacing-heading, -.01em);
  line-height: 1.1;
}

h3 {
  font-size: var(--font-size-x-large, 24px);
  font-weight: var(--font-weight-normal, 400);
  letter-spacing: var(--letter-spacing-heading, -.012em);
  line-height: 1.35;
}

h4 {
  font-size: var(--font-size-large, 16px);
  font-weight: var(--font-weight-normal, 400);
  line-height: 1.5;
}

h5, h6 {
  font-size: var(--font-size-medium, 14px);
  font-weight: var(--font-weight-semi-bold, 500);
  line-height: 1.7;
}

/* Overrides */
/* TODO: review this as it breaks dark mode by default ! */
/* body {
  color: #212121; 
  color: var(--color-on-background);
} */

a {
  transition: var(--transition-quickly);
  color: var(--color-primary);
}

a:hover {
  color: var(color-primary-dark);
  text-decoration: none;
}

a:active {
  transition: none;
  opacity: var(--opacity-75);
}

code {
   font-family: var(--font-family-code, Mono);
}

.underline {
  border-bottom: solid 1px var(--color-divider);
}

.capitalize {
  text-transform: capitalize;
}

.secondary {
  color: var(--color-secondary-text);
}

.ellipsis {
  text-overflow: ellipsis;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  flex: 1;
  /**
  width: 100%;
  display: block; 
  **/
}

h2:has(.ellipsis) {
  min-width: 0;
}

${accessibilityLinks}
`;

export default style
