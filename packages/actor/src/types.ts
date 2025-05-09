import { type TemplateResult } from 'lit';
import type Actor from './actor.js';

/**
 * Utils type constructor for events
 * inspired by https://www.sandromaglione.com/articles/getting-started-with-xstate-and-effect-audio-player
 * 
 * Example of usage:
 * ```ts
 * type EventT = MachineParams<{
 *   'context.id': { readonly id: string }
 *   'NEXT': {}
 * }>;
 * 
 * const machine = setup({
 *   types: {} as {
 *     events: EventT
 *   },
 *   actions: {
 *     setID: assign({
 *       id: ({ event }) => {
 *         assertEvent(event, 'context.id');
 *         return event.params.id
 *       },
 *     })
 *   }...})
 * 
 * ```
 * 
 */
export type MachineParams<A extends Record<string, Record<string, any>>> =
  keyof A extends infer Type
  ? Type extends keyof A
  ? keyof A[Type] extends ""
  ? { readonly type: Type }
  : { readonly type: Type; readonly params: A[Type] }
  : never
  : never;

export type ActorIdT = string | undefined | null

/**
 * type for event meta data 
 * 
 * event meta is used in machines to provide additional information about an event 
 * and allows to know how to render as buttons or other UI elements
 */
export type EventMetaT = {
  label?: string;
  helper?: string;
  filled?: boolean;
  outlined?: boolean;
  icon?: string;
  isIconButton?: boolean;
  style?: string;
  renderer?: (html: TemplateT, actor: Actor) => TemplateResult;
  /**
   * a function that returns true if the action should be hidden when guarded
   */
  hideGuarded?: boolean | ((actor: Actor) => boolean);
  confirm?: {
    heading: string;
    renderer: (html: TemplateT, actor: Actor, data?: any) => TemplateResult;
    confirmLabel?: string;
    cancelLabel?: string;
  };
}

/**
 * type for lit - we use this in actor renderer
 */
export type TemplateT = (str: TemplateStringsArray, ...values: any[]) => TemplateResult
export type RendererMetaT = {
  renderer: (html: TemplateT, state: Actor) => TemplateResult
}
export type DOMHostT = HTMLElement | (() => HTMLElement) | undefined;