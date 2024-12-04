function isOpera(): boolean {
  return !!navigator.userAgent.match(/Opera|OPR/u);
}
function getVersion(): number | undefined {
  const version = navigator.userAgent.match(/Opera|OPR\/([\d\.]+)/)?.[1];
  return version ? parseFloat(version) : undefined;
}

const is = isOpera();
const version = getVersion();
export default is;
export { is, version };