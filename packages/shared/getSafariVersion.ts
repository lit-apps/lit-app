export default function getSafariVersion(): string | undefined {
  return navigator.userAgent.match(/Version\/([\d\.]+)/)?.[1];
}