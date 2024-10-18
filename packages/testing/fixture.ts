import {HTMLTemplateResult, render, LitElement} from 'lit'
export const cachedWrappers: Node[] = [];
const container = document.createElement('div');
container.style.display = 'none';
document.body.appendChild(container);

/**
 * Creates a wrapper as a direct child of `<body>` to put the tested element into.
 * Need to be in the DOM to test for example `connectedCallback()` on elements.
 *
 * @param {Element} [parentNode]
 * @returns {Element} wrapping node
 */
function fixtureWrapper(parentNode = document.createElement('div')) {
  container.appendChild(parentNode);
  cachedWrappers.push(parentNode);
  return parentNode;
}

/**
 * Cleans up all defined fixtures by removing the actual wrapper nodes.
 * Common usecase is at the end of each test.
 */
export function fixtureCleanup() {
  if (cachedWrappers) {
    cachedWrappers.forEach(wrapper => {
      container.removeChild(wrapper);
    });
  }
  cachedWrappers.length = 0; // reset it like this as we can't reassign it
}

const fixture = async <T extends LitElement>(template: HTMLTemplateResult) => {
		const container = fixtureWrapper()
		render(template, container);
		const el = container.firstElementChild as T;
		await el.updateComplete;
		return el as T;
}

export default fixture;


/**
 * This registers the fixture cleanup as a side effect
 */
try {
  // we should not assume that our users load mocha types globally
  // @ts-expect-error  - we are cheating
  if ('afterEach' in window) {
    // @ts-expect-error  - we are cheating
    afterEach(() => {
      fixtureCleanup();
    });
  }
  // @ts-expect-error  - we are cheating
  if ('teardown' in window) {
    // @ts-expect-error  - we are cheating
    teardown(() => {
      fixtureCleanup();
    });
  }
} catch (error) {
  /* do nothing */
}



