import { type HTMLTemplateResult } from 'lit';
import  type Actor  from './actor.js';

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
    style?: string;
    renderer?: (actor: Actor<any, any>) => HTMLTemplateResult;
    confirm?: {
      heading: string;
      renderer: (actor: Actor<any, any>, data?: any) => HTMLTemplateResult;
      confirmLabel?: string;
      cancelLabel?: string;
    };
}