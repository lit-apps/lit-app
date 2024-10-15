import { type TemplateResult } from 'lit';
import  type Actor  from './actor.js';
import { AnyEventObject, EventObject, MachineContext } from 'xstate';

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
    renderer?: (html: TemplateT, actor: Actor<any, any>) => TemplateResult;
    confirm?: {
      heading: string;
      renderer: (html: TemplateT, actor: Actor<any, any>, data?: any) => TemplateResult;
      confirmLabel?: string;
      cancelLabel?: string;
    };
}

/**
 * type for lit - we use this in actor renderer
 */
export type TemplateT = (str: TemplateStringsArray, ...values: any[]) => TemplateResult
export type RendererMetaT<
  TContext extends MachineContext, 
  TEvent extends EventObject = AnyEventObject
> = {
  renderer: (html: TemplateT, state: Actor<TContext, TEvent>) => TemplateResult
}