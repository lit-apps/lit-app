import { html, css, LitElement } from "lit";
import { customElement, property, state } from 'lit/decorators.js';
import watch from '@lit-app/shared/decorator/watch.js';
import distributeUniformly from "./distributeUniformly.js";
/**
 *  an element that creates an avatar for a a seed
 */

@customElement('lapp-avatar')
export default class lappAvatar extends LitElement {

  static override styles = css`
      :host {
        display: inline-block;
      }
      text {
        fill: var(--color-on-primary, #fff);
      }
    `;

  /**
   * The colors to use for the avatar background, when css --color-brand-* is not available
   */
  @property({ attribute: false }) colors = [
    '#00acc1', '#1e88e5', '#5e35b1', '#7cb342', '#8e24aa', '#039be5', '#43a047', '#00897b', '#3949ab', '#c0ca33', '#d81b60', '#e53935', '#f4511e', '#fb8c00', '#fdd835', '#ffb300'
  ];

  /** 
   * Then number of different colors to use
   */
  @property({ type: Number }) colorLength = 9

  /**
   * The seed to generate the avatar
   */
  @property() seed!: string;
  @watch('seed') seedChanged(seed: string) {
    if (!seed) {
      return
    }
    this._indexColor = distributeUniformly(seed, this.colorLength);
    this._initials = getInitials(seed);
  }

  private _indexColor: number = 0;
  private _initials!: string;

  override render() {
    return html`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <g>
            <rect fill="var(--color-brand-${this._indexColor}, ${this.colors[this._indexColor]})" width="100" height="100" x="0" y="0" />
            <text x="50%" y="50%" font-family="Roboto, Arial, sans-serif" font-size="50" font-weight="500"  text-anchor="middle" dy="17.800">${this._initials}</text>
          </g>
        </svg>
      `;
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-avatar': lappAvatar;
  }
}


export function getInitials(seed: string, discardAtSymbol = true): string {
  const input = discardAtSymbol ? seed.replace(/@.*/, '') : seed;
  const matches = input.match(/(\p{L}[\p{L}\p{M}]*)/gu);

  if (!matches) {
    // Re-run without discarding `@`-symbol, if no matches
    return discardAtSymbol ? getInitials(seed, false) : '';
  }

  if (matches.length === 1) {
    return matches[0].match(/^(?:\p{L}\p{M}*){1,2}/u)![0].toUpperCase();
  }

  const firstCharacter = matches[0].match(/^(?:\p{L}\p{M}*)/u)![0];
  const secondCharacter =
    matches[matches.length - 1].match(/^(?:\p{L}\p{M}*)/u)![0];

  return (firstCharacter + secondCharacter).toUpperCase();
}