import type { RedefinedCustomElementDetail } from './redefine-custom-elements.js';
import './redefine-custom-elements.js';
import { LitElement } from 'lit';
import {
  adoptStyles,
  supportsAdoptingStyleSheets,
} from 'lit';

declare const elem: Element;

interface NodeButMaybeMore extends Node {
  host?: Element;
  matches?: typeof elem.matches;
  msMatchesSelector?: typeof elem.matches;
  assignedSlot?: typeof elem.assignedSlot;
  shadowRoot?: typeof elem.shadowRoot;
}

function* shadowPiercingWalk(node: NodeButMaybeMore): IterableIterator<Node> {
  yield node;
  if ((node as Element).localName === 'slot') {
    const slot = node as HTMLSlotElement;
    const slotNodes = slot.assignedNodes({ flatten: true });
    for (let i = 0; i < slotNodes.length; i++) {
      yield* shadowPiercingWalk(slotNodes[i]);
    }
  }
  if (node.shadowRoot) {
    const shadowRootNodes = node.shadowRoot.childNodes;
    for (let i = 0; i < shadowRootNodes.length; i++) {
      yield* shadowPiercingWalk(shadowRootNodes[i]);
    }
  } else if (node.childNodes) {
    for (let i = 0; i < node.childNodes.length; i++) {
      yield* shadowPiercingWalk(node.childNodes[i]);
    }
  }
}

const cludgeClass = (
  oldClass: typeof LitElement,
  newClass: typeof LitElement
) => {
  // There's lots of things that this doesn't handle, but probably the
  // biggest is updates to the constructor. That means that changes to event
  // handlers won't go through when they're defined as arrow function
  // property initializers. We could potentially hack that together, via
  // some really wild tricks, but I'm inclined not to. Periodically
  // reloading the page while developing with HMR is a good habit for people
  // to get into.
  //
  // One thing I'd like to support is live updating of CSS defined in a
  // css file with lit_css_module.
  const existingProps = new Set(Object.getOwnPropertyNames(oldClass.prototype));
  const newProps = new Set(Object.getOwnPropertyNames(newClass.prototype));
  for (const prop of Object.getOwnPropertyNames(newClass.prototype)) {
    Object.defineProperty(
      oldClass.prototype,
      prop,
      Object.getOwnPropertyDescriptor(newClass.prototype, prop)!
    );
  }
  for (const existingProp of existingProps) {
    if (!newProps.has(existingProp)) {
      // tslint:disable-next-line:no-any Yep, this is hacky.
      delete (oldClass.prototype as any)[existingProp];
    }
  }

  // This new class object has never been finalized before. Need to finalize
  // so that instances can get any updated styles.
  (newClass as any).finalize();
};

const notifyOnHotModuleReload = function (
  tagname: string,
  classObj: typeof LitElement
) {
  const cludgedClasses = new Set<typeof LitElement>();

  for (const node of shadowPiercingWalk(document)) {
    if (
      node instanceof LitElement &&
      node.tagName.toLowerCase() === tagname.toLowerCase()
    ) {
      const myNode = node as LitElement;

      const nodeCtor = myNode.constructor as typeof LitElement;

      if (!cludgedClasses.has(nodeCtor)) {
        cludgeClass(nodeCtor, classObj);
        cludgedClasses.add(nodeCtor);
      }

      Object.setPrototypeOf(myNode, classObj.prototype);

      // Get updated styling. Need to test that this works in all the
      // different browser configs, only tested on recent Chrome so far,
      // where overriding adopted stylesheets seems to just work.
      const styles = (myNode.constructor as typeof LitElement).elementStyles;
      const renderRoot = myNode.renderRoot;
      if (styles && renderRoot instanceof ShadowRoot) {
        if (supportsAdoptingStyleSheets) {
          adoptStyles(renderRoot, styles);
        } else {
          // Remove all existing shimmed styles from the node.
          const nodes = Array.from(renderRoot.children);
          for (const node of nodes) {
            if (node.tagName.toLowerCase() === 'style') {
              renderRoot.removeChild(node);
            }
          }
          // `myNode.renderOptions.renderBefore` needs to be updated
          // because it refers to the first shimmed adopted style, which was
          // just removed. So, keep track of the last child in `renderRoot`
          // because the first new shimmed adopted style to be added by
          // `adoptStyles` will be its next sibling once `adoptStyles` is
          // finished.
          const lastChild = renderRoot.lastChild;
          adoptStyles(renderRoot, styles);
          if (lastChild) {
            myNode.renderOptions.renderBefore = lastChild.nextSibling;
          } else {
            delete myNode.renderOptions.renderBefore;
          }
        }
        // Ask for a re-render.
        myNode.requestUpdate();
      }
    }
  }
};

document.addEventListener('redefined-custom-element', ((
  e: CustomEvent<RedefinedCustomElementDetail>
) => {
  const { tagName, newConstructor } = e.detail;
  notifyOnHotModuleReload(tagName, newConstructor as typeof LitElement);
}) as any);
