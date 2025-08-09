/**
 * A custom element that handles smooth transitions between slotted elements.
 * 
 * @element lapp-slot-transition
 * 
 * @slot current - Slot for the currently visible element
 * @slot previous - Slot for the previously visible element that is transitioning out
 * 
 * @cssproperty --slot-transition-duration - Duration of the transition animation (default: 0.3s)
 * @cssproperty --slot-transition-delay - Delay before the transition starts (default: 0.3s)
 * @cssproperty --slot-transition-transform - Transform applied during transition (default: scale(0.8))
 * @cssproperty --slot-transition - Custom transition property (default: all var(--_transition-duration) var(--_transition-delay) cubic-bezier(.5, 0, .5, 1))
 */
import { css, html, LitElement } from "lit";
import { customElement, property } from 'lit/decorators.js';

type TransitionPrimitiveT = 'fade' | 'slide' | 'scale' | '';
type TransitionT = `${TransitionPrimitiveT} ${TransitionPrimitiveT} ${TransitionPrimitiveT}` | '';
/**
 * An element to handle smooth transition using slots
 */
@customElement('lapp-slot-transition')
export default class slotTransition extends LitElement {

  static override styles = css`
      :host {
        display: grid;
        --_transition-duration: var(--slot-transition-duration, var(--time-slow, 0.5s));
        --_transition-delay: var(--slot-transition-delay, var(--time-slow, 0.5s));
        --_transition-transform-previous: var(--slot-transition-transform-previous, scale(0.8));
        --_transition-transform-next: var(--slot-transition-transform-next, scale(0.8));
        --_transition: var(--slot-transition, all var(--_transition-duration) var(--_transition-delay) cubic-bezier(.5, 0, .5, 1));
      }

      :host([theme~=fade]) {
        --_transition-transform-previous: scale(1);
        --_transition-transform-next: scale(1);
        --_transition-delay: 0s;
      }
      :host([theme~=slide]) {
        --_transition-transform-previous: translateX(-100%);
        --_transition-transform-next: translateX(100%);
        --_transition-delay: 0s;
      }
      :host([theme~=scale]) {
        --_transition-transform-previous: scale(0.7);
        --_transition-transform-next: scale(0.7);
      }
      
      ::slotted(*) {
        grid-area: 1/1;
        transition: var(--_transition);
        transition-property: opacity, transform;
      }

      slot[name="previous"]::slotted(*), 
      slot[name="next"]::slotted(*) {
        opacity: 0;
        max-height: 90vh;  
        overflow: hidden;
      }

      slot[name=next]::slotted(*) {
        transition-delay: var(--_transition-delay);
        transform: var(--_transition-transform-next);
      }
      slot[name=previous]::slotted(*) {
        transition-delay: 0s; 
        transform: var(--_transition-transform-previous);
      }

      /* :host {
        --_transition-duration: unset;
        --_transition-transform: unset;
      } */

    `;

  /**
   * Transition type
   */
  @property({ reflect: true }) theme: TransitionT = '';

  override render() {
    return html`
      <slot name="current" ></slot>
      <slot name="previous" ></slot>
      <slot name="next" ></slot>
      
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-slot-transition': slotTransition;
  }
}
