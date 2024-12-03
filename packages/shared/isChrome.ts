export default function isChrome(): boolean {
  return !!navigator.userAgent.match(/Chrome/u) && !!navigator.vendor.match(/Google Inc/u);
}

export function getVersion(): number | undefined {
  const version = navigator.userAgent.match(/Chrome\/([\d\.]+)/)?.[1];
  return version ? parseFloat(version) : undefined;
}