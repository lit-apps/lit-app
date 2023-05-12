// we mock canvas template o avoid warnings
// https://github.com/jsdom/jsdom/issues/1782
window.HTMLCanvasElement.prototype.getContext = () => {
  return {};
};

