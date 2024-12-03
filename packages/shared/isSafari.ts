export default function isSafari(): boolean {
  return !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)
}
export function getVersion(): number | undefined {
  const version = navigator.userAgent.match(/Version\/([\d\.]+)/)?.[1];
  return version ? parseFloat(version) : undefined;
}