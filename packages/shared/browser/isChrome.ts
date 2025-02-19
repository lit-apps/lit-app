function isChrome(): boolean {
  return !!navigator.userAgent.match(/Chrome/u) && !!navigator.vendor.match(/Google Inc/u);
}

function getVersion(): number | undefined {
  const version = navigator.userAgent.match(/Chrome\/([\d\.]+)/)?.[1];
  return version ? parseFloat(version) : undefined;
}

const is = isChrome();
const version = getVersion();
export default is;
export { is, version };