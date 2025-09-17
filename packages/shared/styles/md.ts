import { css, CSSResult } from 'lit';

import typography from './class/typography.js';
import showWhenAccessibility from './class/show-when-accessibility.js';
import liteYoutube from './class/lite-youtube.js';
import { Layouts, Factors } from './flex/index.js';
import alignIcon from './class/alignIcon.js';
import tooltip from './class/tooltip.js';
import responsiveMedia from './class/responsive-media.js';

const style: CSSResult = css`
summary {
  cursor: pointer;
  position: relative;
}

summary::after {
  content: "";
  position: absolute;
  inset: 0;
  right: -4px;
  border-radius: 4px;
}

summary:hover::after {
  background-color: var(--pwi-tooltip-decoration-color, var(--color-primary));
  opacity: 0.25;
}

table {
  margin-bottom: var(--space-large);
}

/* This is for embedded content */
iframe {
  border: none;
  width: 100%;
  display: block;
  aspect-ratio: 6 / 4;
}

`
export default [
  typography,
  alignIcon,
  showWhenAccessibility,
  tooltip,
  liteYoutube,
  style,
  responsiveMedia,
  Layouts, 
  Factors
];
