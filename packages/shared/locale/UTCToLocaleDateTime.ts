/**
 * Converts a UTC date string to a locale date and time string in the format YYYY-MM-DDTHH:mm.
 *
 * @param date - The UTC date string to convert. Can be undefined.
 * @returns The locale date and time string in the format YYYY-MM-DDTHH:mm. Returns an empty string if the input date is undefined.
 */
export function UTCToLocaleDateTime(date: string | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  // YYYY-MM-DDTHH:mm
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}