function isSafari(): boolean {
  return !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)
}
function getVersion(): number | undefined {
  const version = navigator.userAgent.match(/Version\/([\d\.]+)/)?.[1];
  return version ? parseFloat(version) : undefined;
}

const is = isSafari();
const version = getVersion();
export default is;
export { is, version };