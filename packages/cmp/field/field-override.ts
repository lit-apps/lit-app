/**
 * Override css fields for older browser not supporting css @layer
 * 
 * For all browser not supporting css @layer, we need to extract the content of the layers and apply them directly to the style.
 * see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis#browser_compatibility
 */

import isChrome, { getVersion as chromeVersion } from '@lit-app/shared/isChrome';
import isSafari, { getVersion as safariVersion } from '@lit-app/shared/isSafari';
import isFirefox, { getVersion as firefoxVersion } from '@lit-app/shared/isFirefox';
import isOpera, { getVersion as operaVersion } from '@lit-app/shared/isOpera';

import { styles as filledStyles } from '@material/web/field/internal/filled-styles';
import { styles as outlinedStyles } from '@material/web/field/internal/outlined-styles';
import { styles as sharedStyles } from '@material/web/field/internal/shared-styles';
import { styles as switchStyles } from '@material/web/switch/internal/switch-styles';
import { styles as radioStyles } from '@material/web/radio/internal/radio-styles';
import { CSSResult, unsafeCSS } from 'lit';

if (
  (isChrome() && (chromeVersion()! < 99))||
  (isSafari() && (safariVersion()! < 15.4))||
  (isFirefox() && (firefoxVersion()! < 97)) ||
  (isOpera() && (operaVersion()! < 58))
) {
  console.warn('Browser does not support css @layer, applying field override');
  overrideStyles();
}

function overrideStyles() {
  extractLayerContent(filledStyles);
  extractLayerContent(outlinedStyles);
  extractLayerContent(sharedStyles);
  extractLayerContent(switchStyles);
  extractLayerContent(radioStyles);
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

