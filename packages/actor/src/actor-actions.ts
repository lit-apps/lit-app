import { css, LitElement, nothing, HTMLTemplateResult, html } from "lit";
import { customElement, property, query, state } from 'lit/decorators.js';
import {ifDefined} from 'lit/directives/if-defined.js';
import { ConsumeActorMixin } from "./context-actor";
import { html as htmlStatic, literal } from 'lit/static-html.js';
import Actor from "./actor";
import { type EventMetaT } from "./types";
import ('@material/web/button/filled-button.js');
import ('@material/web/button/outlined-button.js');
import ('@material/web/button/text-button.js');

import ('@material/web/iconbutton/filled-icon-button.js');
import ('@material/web/iconbutton/outlined-icon-button.js');
import ('@material/web/iconbutton/icon-button.js');
import ('@material/web/dialog/dialog.js');
import type { MdDialog } from '@material/web/dialog/dialog';

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

type MappedT = [string, {meta?:EventMetaT}, boolean];

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

  /**
   * data to be passed to action renderer - this is useful when we need to add data on the dialog
   */
  @property({ attribute: false }) data: unknown;

  /**
   * the current Event for an action
   */
  @state() currentEvent: string = '';

  @query('md-dialog') dialog!: MdDialog;

  override render() {
    if (!this.actor) {
      return nothing;
    }

    return [
      this.renderActions(this.actor, this.hideGuarded, this.iconButton),
      this.renderDialog(this.currentEvent)
    ]
  }

  private renderDialog(event: string) {
    if (!event) {
      return nothing;
    }
    const eventConfig = this.actor.getEventDescriptors(event) || {}
    const { confirm } = eventConfig.meta || {};
    if (!confirm?.renderer) {
      return nothing;
    }

    const onClose = () => {
      if (this.dialog.returnValue === 'ok') {
        this.actor.send({ type: event })
      }
      this.currentEvent = '';
    };
    
    return html`
    		<md-dialog 
					id="confirmActionDialog" 
          .open=${!!this.currentEvent}
					@close=${onClose}>
					<div slot="headline">${confirm?.heading || 'Please Confirm'}</div>
						<form slot="content" method="dialog" id="form-confirm-action">
              ${confirm?.renderer.call(this, html, this.actor, this.data)}
  				  </form>
					<div slot="actions">
          <md-outlined-button
            form="form-confirm-action"
            value="close">${confirm.cancelLabel || 'Cancel'}</md-outlined-button>
					<md-filled-button
          form="form-confirm-action"
          value="ok">${confirm.confirmLabel || 'Confirm' }</md-filled-button>
					</div>
				</md-dialog>
    `
  }

  private renderActions(
    actor: Actor<any, any>, 
    hideGuarded: boolean = false, 
    iconButton: boolean = false
  ) {
    const nextEvents = actor.getNextEvents();
    const nextAllowedEvents = actor.getNextAllowedEvents();

    return htmlStatic`
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
        .map(([event, eventConfig, disabled]) => {
          if (hideGuarded && disabled || !eventConfig.meta) {
            return nothing;
          }
          const { 
            label, 
            helper, 
            filled, 
            outlined, 
            icon, 
            renderer, 
            confirm, 
            style 
          } = eventConfig.meta || {}
          if (renderer) {
            return renderer.call(this, html, actor);
          }

          const onClick = () => {
            if (confirm) {
              this.currentEvent = event;
            } else {
              actor.send({ type: event });
            }
          };

          const tag = tags[iconButton ? 'iconButton' : 'button'][filled ? 'filled' : outlined ? 'outlined' : 'default'];

          return htmlStatic`
            <${tag}
              ?soft-disabled=${disabled}
              @click=${onClick}
              style=${ifDefined(style)} 
            >
              ${icon ? html`<lapp-icon slot="icon">${icon}</lapp-icon>` : nothing}
              ${label}
            </${tag}>
          `;
        })}
    `;
  }

}

// export function displayActions(actor: Actor<any, any>, hideGuarded: boolean = false, iconButton: boolean = false) {
//   const nextEvents = actor.getNextEvents();
//   const nextAllowedEvents = actor.getNextAllowedEvents();

//   return html`
//       ${nextEvents
//       .map((event: string): MappedT => {
//         const disabled = !nextAllowedEvents.includes(event);
//         const eventConfig = actor.getEventDescriptors(event) || {}

//         return [event, eventConfig, disabled];
//       })

//       .sort(([_ka, a, _ba], [_kb, b, _bb]) => {
//         const orderA = (a.meta?.filled ? 1 : a.meta?.outlined ? 2 : 3);
//         const orderB = (b.meta?.filled ? 1 : b.meta?.outlined ? 2 : 3);
//         return orderA - orderB;
//       })
//       .map(([_k, event, disabled]) => {
//         if (hideGuarded && disabled) {
//           return nothing;
//         }
//         const { label, helper, filled, outlined, icon, renderer } = event.meta || {}
//         if (renderer) {
//           return renderer(actor);
//         }

//         const onClick = () => actor.send({ type: event });

//         const tag = tags[iconButton ? 'iconButton' : 'button'][filled ? 'filled' : outlined ? 'outlined' : 'default'];

//         return html`
//           <${tag}
            
//             ?soft-disabled=${disabled}
//             @click=${onClick}
//           >
//             ${icon ? html`<lapp-icon slot="icon">${icon}</lapp-icon>` : nothing}
//             ${label}
//           </${tag}>
//         `;
//       })}
//   `;
// }

