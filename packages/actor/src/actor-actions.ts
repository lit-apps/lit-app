import { css, LitElement, nothing, HTMLTemplateResult } from "lit";
import { customElement, property, state } from 'lit/decorators.js';
import { ConsumeActorMixin } from "./context-actor";
import { html, literal } from 'lit/static-html.js';
import Actor, { EventMetaT } from "./actor";
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/button/text-button.js';

import '@material/web/iconbutton/filled-icon-button.js';
import '@material/web/iconbutton/outlined-icon-button.js';
import '@material/web/iconbutton/icon-button.js';

const filledButtonTag = literal`md-filled-button`;
const outlineButtonTag = literal`md-outlined-button`;
const defaultButtonTag = literal`md-text-button`;

const filledIconButtonTag = literal`md-filled-icon-button`;
const outlineIconButtonTag = literal`md-outlined-icon-button`;
const defaultIconButtonTag = literal`md-icon-button`;

const tags = {
  button: {
    filled: filledButtonTag,
    outlined: outlineButtonTag,
    default: defaultButtonTag,
  },
  iconButton: {
    filled: filledIconButtonTag,
    outlined: outlineIconButtonTag,
    default: defaultIconButtonTag,
  }
}

type MappedT = [string, EventMetaT, boolean];

/**
 *  
 */

export default class actorActions extends ConsumeActorMixin(LitElement) {

  /**
   * when true, actions are not displayed (instead of being disabled)
   */
  @property({ type: Boolean }) hideGuarded: boolean = false;

  /**
   * when true, actions are displayed as icon buttons
   */
  @property({ type: Boolean }) iconButton: boolean = false;

  override render() {
    if (!this.actor) {
      return nothing;
    }

    return displayActions(this.actor, this.hideGuarded);

  }

}

export function displayActions(actor: Actor<any, any>, hideGuarded: boolean = false) {
  const nextEvents = actor.getNextEvents();
  const nextAllowedEvents = actor.getNextAllowedEvents();

  return html`
      ${nextEvents
      .map((event: string): MappedT => {
        const disabled = !nextAllowedEvents.includes(event);
        const eventConfig = actor.getEventDescriptors(event) || {}

        return [event, eventConfig, disabled];
      })

      .sort(([_ka, a, _ba], [_kb, b, _bb]) => {
        const orderA = (a.meta?.filled ? 1 : a.meta?.outlined ? 2 : 3);
        const orderB = (b.meta?.filled ? 1 : b.meta?.outlined ? 2 : 3);
        return orderA - orderB;
      })
      .map(([_k, event, disabled]) => {
        if (hideGuarded && disabled) {
          return nothing;
        }
        const { label, helper, filled, outlined, icon, renderer } = event.meta || {}
        if (renderer) {
          return renderer(actor);
        }

        const onClick = () => actor.send({ type: event });

        const tag = tags[icon ? 'iconButton' : 'button'][filled ? 'filled' : outlined ? 'outlined' : 'default'];

        return html`
          <${tag}
            soft-disabled
            ?disabled=${disabled}
            @click=${onClick}
          >
            ${icon ? html`<lapp-icon>${icon}</lapp-icon>` : nothing}
            ${label}
          </${tag}>
        `;
      })}
  `;
}

