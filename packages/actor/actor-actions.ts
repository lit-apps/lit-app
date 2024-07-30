import { css } from 'lit';
import { customElement } from 'lit/decorators.js';
import ActorActions from './src/actor-actions';


/**
 * Component to display actions of an actor
 * 
 * @element lapp-actor-actions
 * 
 */
@customElement('lapp-actor-actions')
export class LappActorActions extends ActorActions {
  static override styles = css`
  :host {
    display: inline-flex;
    gap: var(--lapp-actor-actions-gap, var(--space-medium));
  }
`;
}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-actor-actions': LappActorActions;
  }
}