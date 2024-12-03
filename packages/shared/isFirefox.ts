export default function isFirefox(): boolean {
  return !!navigator.userAgent.match(/Firefox/u)
}
export function getVersion(): number | undefined {
  const version = navigator.userAgent.match(/Firefox\/([\d\.]+)/)?.[1];
  return version ? parseFloat(version) : undefined;
}