export default function isFirefox(): boolean {
  return !!navigator.userAgent.match(/Opera|OPR/u);
}
export function getVersion(): number | undefined {
  const version = navigator.userAgent.match(/Opera|OPR\/([\d\.]+)/)?.[1];
  return version ? parseFloat(version) : undefined;
}