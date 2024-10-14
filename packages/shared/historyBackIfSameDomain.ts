/**
 * Navigates back in the browser history if the referrer is from the same domain.
 *
 * This function checks the current domain and the referrer domain. If the referrer
 * domain matches the current domain, it navigates back in the browser history.
 * Otherwise, it logs a message indicating that the referrer is from a different domain
 * and does not navigate back.
 *
 * @returns {boolean} - Returns `true` if the navigation back was performed, otherwise `false`.
 */
export default function goBackIfSameDomain() {
  const currentDomain = window.location.hostname;
  const referrer = document.referrer;

  if (referrer) {
    const referrerDomain = new URL(referrer).hostname;

    if (currentDomain === referrerDomain) {
      history.back();
      return true;
    } else {
      console.log('Referrer is from a different domain. Not going back.');
      return false
    }
  } else {
    console.log('No referrer found. Still going back.');
    history.back();
    return true
  }
}

