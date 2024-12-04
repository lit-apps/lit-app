function isEdge(): boolean {
  return !!navigator.userAgent.match(/Edge/u)
}
function getVersion(): number | undefined {
  const version = navigator.userAgent.match(/Edge\/([\d\.]+)/)?.[1];
  return version ? parseFloat(version) : undefined;
}

const is = isEdge();
const version = getVersion();
export default is;
export { is, version };