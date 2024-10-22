import { LitElement, html, css, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import userMixin from './user-mixin';
import '@lit-app/cmp/avatar/avatar.js';
import '@preignition/lit-firebase/document';
/**
 * Displays an image for a user
 * 
 * We can either set a photoURL or uid: 
 * - photoURL will use the url as a source for the image
 * - uid will lookup user account photo
 */
export class UserImg  extends userMixin(LitElement) {

  static override styles = css`
    :host {
      display: inline-flex;
      border: 3px solid white;
      border-radius: 50%;
      --_size: var(--lapp-user-img-size, 40px); 
      --_color: var(--lapp-user-img-color, var(--color-surface-container-high, #dadce0)); 
    }

    img, lapp-avatar {
      height: var(--_size);
      width: var(--_size);
      min-width: var(--_size);
      display: inline-block;
      background-color: var(--_color);
      border-radius: 50%;
      flex-shrink: 0;
      object-fit: cover;
      overflow: hidden;
      max-width: 100%;
      vertical-align: middle;
    }
    img {
      filter: grayscale(60%);
    }

    [part=photo] {
      border-radius: 50%;
      overflow: hidden;
      position: relative;
      margin: -1px;
    }     
    `;
  
  get gravatar() {
    // TODO: create or own avatar renderer !
    return `https://api.dicebear.com/9.x/initials/svg?seed=${this.displayName}`;
  }

  override render() {
    if(this.isDeleted || this.isLoading) {
      return nothing;
    }
    const url = this.photoURL || this.gravatar;
    const img = this.photoURL ? html`<img src="${url}" loading="lazy" alt="${this.displayName}">` : html`<lapp-avatar .seed=${this.displayName}></lapp-avatar>`;
    return html `
      <div part="photo">${img}</div>
    `;
  }

}


