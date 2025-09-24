
/**
 * Checks if the text direction is right-to-left (RTL).
 * 
 * @returns {boolean} - A boolean flag indicating whether the text direction is right-to-left.
 */
export function isRtl() {
  const { dir = 'ltr' } = document.documentElement;
  return dir === 'rtl';
}

/**
 * Returns the icon name for the chevron direction based on the given direction and RTL (right-to-left) flag.
 * 
 * @param {DirectionT} direction - The direction of the chevron ('next' or 'previous').
 * @returns {string} - The icon name for the chevron direction.
 */
