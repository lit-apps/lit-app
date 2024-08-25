import type { Plugin, HtmlTagDescriptor } from 'vite';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

export function litHMRPlugin(): Plugin {
  let config: any;

  return {
    name: 'custom-element-hmr',
    configResolved(resolvedConfig) {
      // store the resolved config
      config = resolvedConfig;
    },
    transform: (code, id, opt) => {
      if (
        !opt?.ssr &&
        config.command === 'serve' &&
        !id.includes('node_modules') &&
        (code.includes('customElements.define') ||
          code.includes('customElement('))
      ) {
        const lines = code.split('\n');
        const indexOfSourceMap = lines.findIndex((line) =>
          line.includes('//# sourceMappingURL')
        );
        const spicyString = `if (import.meta.hot) {import.meta.hot.accept(() => {});}`;

        if (indexOfSourceMap === -1) {
          lines.push(spicyString);
        } else {
          lines.splice(indexOfSourceMap, 0, spicyString);
        }

        code = lines.join('\n');
      }

      return code;
    },
    transformIndexHtml: (html) => {
      if (config.command === 'serve') {
        const result: HtmlTagDescriptor[] = [
          {
            tag: 'script',
            injectTo: 'head-prepend',
            attrs: {
              type: 'module',
              // src: require.resolve('@lit-labs/hmr'),
              src: '/lit-hmr.ts',
            },
          },
        ];

        return result;
      }

      return html;
    },
    handleHotUpdate: ({ modules }) => {
      return modules;
    },
  };
}
