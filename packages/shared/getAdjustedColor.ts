
/**
 * Adjusts the text color based on the provided background color.
 * 
 * source: https://stackoverflow.com/questions/11867545/change-text-color-based-on-brightness-of-the-covered-background-area
 * 
 * TODO: check if there are better alternatives. We could warn user if the color contrast is not enough.
 * 
 * Interesting article:
 * - https://www.smashingmagazine.com/2022/09/realities-myths-contrast-color/
 * - https://medium.com/@think_ui/visualizing-color-contrast-a-guide-to-using-black-and-white-text-on-colored-backgrounds-14346a2e5680
 * - https://www.w3.org/TR/WCAG20-TECHS/G18.html
 * 
 * @param color - The background color to adjust the text color for.
 * @param black - The default black color to use if the contrast is high.
 * @param white - The default white color to use if the contrast is low.
 * @returns The adjusted text color (either black or white).
 */
export default function getAdjustedColor(color: string, black: string = '#000', white: string = '#fff'): string {
  let r: number, g: number, b: number;

  const parseHex = (c: string): number => parseInt(c, 16);

  if (color.startsWith('rgb')) {
    // Handle rgb or rgba color
    const rgbValues = color.match(/\d+/g);
    if (rgbValues) {
      r = parseInt(rgbValues[0], 10);
      g = parseInt(rgbValues[1], 10);
      b = parseInt(rgbValues[2], 10);
    } else {
      throw new Error('Invalid RGB color format');
    }
  } else {
    // Handle hex color
    if (color.startsWith('#')) {
      color = color.slice(1);
    }

    if (color.length === 3) {
      // Convert shorthand hex to full hex
      color = color.split('').map(c => c + c).join('');
    }

    if (color.length !== 6) {
      throw new Error('Invalid hex color format');
    }

    r = parseHex(color.substr(0, 2));
    g = parseHex(color.substr(2, 2));
    b = parseHex(color.substr(4, 2));
  }

  // Calculate YIQ ratio
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  // Return black or white based on YIQ ratio
  return yiq >= 128 ? black : white;
} 