/** 
 * There are a couple of implementation of the spread directive, 
 * and it is not very clear which will be the best to use.
 * 
 * Also, some are not working with lit 2.0.0
 * 
 * We first have a naive approach as below. 
 * 
 * Then, lit has an outdated PR (2021) https://github.com/lit/lit/pull/1960
 * 
 * We will prefer this one:
 * @open-wc has a spread directive  https://open-wc.org/docs/development/lit-helpers/#spread-directives
 */

import { noChange } from 'lit';
import { Directive, directive, PartType } from 'lit/directive.js';

type config = { [attrName: string]: boolean | string }
/**
 * Allow to set component properties as object like:
 * ` <lapp-text-field ${spread(this.config)}></lapp-text-field>`
 * @deprecated = use @open-wc/lit-helpers instead (spreadProps)
 */
class SpreadDirective extends Directive {
  config!: config
  constructor(partInfo: any) {
    super(partInfo);
    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error('The `spread` directive must be used within an element (like html`<div spread(obj)></div>`)');
    }
  }
  render() {
    return noChange;
  }

  override update(part: any, [config]: [config]) {
    if (this.config === config || !config) {
      return noChange;
    }

    this.config = config;
    Object.entries(config || {}).forEach(([k, value]) => {
      part.element[k] = value;
    });
    return
  }
}
// Create the directive function
export const spread = directive(SpreadDirective);




