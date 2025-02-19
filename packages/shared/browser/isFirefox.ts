function isFirefox(): boolean {
  return !!navigator.userAgent.match(/Firefox/u)
}
function getVersion(): number | undefined {
  const version = navigator.userAgent.match(/Firefox\/([\d\.]+)/)?.[1];
  return version ? parseFloat(version) : undefined;
}

const is = isFirefox();
const version = getVersion();
export default is;
export { is, version };