import { LitElement, html, css, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import userMixin from './user-mixin';
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

    img {
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
      filter: grayscale(60%);
    }

    [part=photo] {
      border-radius: 50%;
      overflow: hidden;
      position: relative;
      margin: -1px;
    }     
    `;
  
  @property() gravatarSize!: string;
  @property() gravatarType: string = 'mm';
  @property() gravatarURL: string ='https://www.gravatar.com/avatar';
  @property() photoURL!: string;
  @state() displayName!: string;

  override render() {
    return html `
      ${this.uid ? html`
        <lif-document @data-changed=${this.setPhotoURL} .path=${this.photoPath}></lif-document>
        <lif-document @data-changed=${(e: CustomEvent) => this.displayName = e.detail.value} .path=${this.namePath}></lif-document>
      ` : nothing}
      ${this.photoURL ? html`<div part="photo"><img src="${this.photoURL}" loading="lazy" alt="${this.displayName}"></div>` : nothing}
    `;
  }

  setPhotoURL(e: CustomEvent) {
    if (e && e.detail.value) {
      this.photoURL = e.detail.value;
      return;
    }
    this.photoURL = `${this.gravatarURL}/${this.uid}?d=${this.gravatarType}${this.gravatarSize ? ('size=' + this.gravatarSize) : ''}`;
  }

}


