type DirectionT = 'next' | 'previous';

/**
 * Checks if the text direction is right-to-left (RTL).
 * 
 * @returns {boolean} - A boolean flag indicating whether the text direction is right-to-left.
 */
export function isRtl() {
  const {dir = 'ltr'} = document.documentElement;
  return dir === 'rtl';
}

/**
 * Returns the icon name for the chevron direction based on the given direction and RTL (right-to-left) flag.
 * 
 * @param {DirectionT} direction - The direction of the chevron ('next' or 'previous').
 * @returns {string} - The icon name for the chevron direction.
 */
export function getChevron(direction: DirectionT) {
  const rtl = isRtl();
  const rl = ['left', 'right'];
  const l = rtl ? rl[1] : rl[0];
  const r = rtl ? rl[0] : rl[1];
  return `chevron_${direction === 'next' ? r : l}`;
}