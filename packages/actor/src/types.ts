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