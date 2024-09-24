import { LifSpan } from '@preignition/lit-firebase/span';
import { css, html } from 'lit';
import userMixin from './user-mixin';

/**
 *  
 */

export class UserName extends userMixin(LifSpan) {

  static override styles = css`
    :host {
      display: inline-flex;
    }
    `;

  override render() {
    if (this.isLoading) {
      return html`<span>Loading ...</span>`;
    }
    if (this.isDeleted) {
      return html`<span>User Deleted</span>`;
    }
    return html`<span>${this.displayName || ''} </span>`
  }

}

