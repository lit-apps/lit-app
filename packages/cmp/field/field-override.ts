/**
 * Override css fields for older browser not supporting css @layer
 * 
 * ## Layer
 * 
 * For all browser not supporting css @layer, we need to extract the content of the layers and apply them directly to the style.
 * see https://developer.mozilla.org/en-US/docs/Web/CSS/@layer#browser_compatibility
 * 
 * ## :where
 * https://developer.mozilla.org/en-US/docs/Web/CSS/:where#browser_compatibility
 * 
 * ## :is 
 * https://developer.mozilla.org/en-US/docs/Web/CSS/:where#browser_compatibility
 * 
 */

import {
  chromeVersion,
  edgeVersion,
  firefoxVersion,
  isChrome,
  isEdge,
  isFirefox,
  isOpera,
  isSafari,
  operaVersion,
  safariVersion
} from '@lit-app/shared/browser';

import { styles as checkboxStyles } from '@material/web/checkbox/internal/checkbox-styles';
import { styles as filledStyles } from '@material/web/field/internal/filled-styles';
import { styles as outlinedStyles } from '@material/web/field/internal/outlined-styles';
import { styles as sharedStyles } from '@material/web/field/internal/shared-styles';
import { styles as radioStyles } from '@material/web/radio/internal/radio-styles';
import { styles as switchStyles } from '@material/web/switch/internal/switch-styles';
import { CSSResult, unsafeCSS } from 'lit';

if (
  (isChrome && (chromeVersion! < 99)) ||
  (isEdge && (edgeVersion! < 99)) ||
  (isSafari && (safariVersion! < 15.4)) ||
  (isFirefox && (firefoxVersion! < 97)) ||
  (isOpera && (operaVersion! < 85))
) {
  console.warn('Browser does not support css @layer, applying field override');
  overrideStyles();
}

if (
  (isChrome && (chromeVersion! < 88)) ||
  (isEdge && (edgeVersion! < 88)) ||
  (isSafari && (safariVersion! < 14)) ||
  (isFirefox && (firefoxVersion! < 82)) ||
  (isOpera && (operaVersion! < 74))
) {
  console.warn('Browser does not support css @layer, applying field override');
  overrideWhere();
}

function overrideStyles() {
  extractLayerContent(filledStyles);
  extractLayerContent(outlinedStyles);
  extractLayerContent(sharedStyles);
  extractLayerContent(switchStyles);
  extractLayerContent(radioStyles);
}

function overrideWhere() {
  // Extract the content of the :where selector and apply it directly to the style
  addContent(checkboxStyles, `
.checked .icon,
.checked .background {
  opacity: 1;
  transition-duration: 350ms, 50ms;
  transition-timing-function: cubic-bezier(0.05, 0.7, 0.1, 1), linear;
  transform: scale(1);
}`);
}

function extractLayerContent(style: CSSResult) {
  const text = style.cssText;
  const layers = text.split('@layer').slice(1);
  if (layers.length === 0) {
    console.warn('No layers found in the style');
    return;
  }

  const layerContents = layers.map(layer => {
    const startIndex = layer.indexOf('{');
    const endIndex = layer.lastIndexOf('}');
    if (startIndex !== -1 && endIndex !== -1) {
      return layer.slice(startIndex + 1, endIndex).trim();
    }
    return null;
  }).filter(content => content !== null);

  const newStyles = layerContents.join('\n');
  Object.assign(style, unsafeCSS(newStyles));
}

function addContent(style: CSSResult, content: string) {
  const text = style.cssText;
  const newStyles = text + content;
  Object.assign(style, unsafeCSS(newStyles));
}



/**
:host([checked]) .icon,
:host([checked]) .background {
opacity: 1;
transition-duration: 350ms, 50ms;
transition-timing-function: cubic-bezier(0.05, 0.7, 0.1, 1), linear;
transform: scale(1);
}
*/