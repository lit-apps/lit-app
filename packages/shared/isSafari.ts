export default function isSafari(): boolean {
  return !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)
}
