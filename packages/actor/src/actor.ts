/**
 * A factory for creating State from xstate 
 */

import { property, State } from '@lit-app/state';
import type {
  ActorLogicFrom,
  ActorOptions,
  AnyActorLogic, AnyStateMachine, ContextFrom, EventFromLogic,
  MachineSnapshot,
  StateNode,
  StateValue
} from 'xstate';
import {
  createActor,
  EmittedFrom,
  Actor as XstateActor
} from 'xstate';
import Registry from "./registry";
import { type EventMetaT } from './types';

/**
 * Remove undefined values from snapshot
 * 
 * refs from invoked ans spawned actors
 */
// function getPersistedSnapshot<TContext extends MachineContext,
//   TEvent extends EventObject,
//   TChildren extends Record<string, AnyActorRef | undefined>,
//   TStateValue extends StateValue,
//   TTag extends string,
//   TOutput>(snapshot: MachineSnapshot<
//     TContext,
//     TEvent,
//     TChildren,
//     TStateValue,
//     TTag,
//     TOutput, 
//     any
//   >
//   ): Snapshot<unknown> {
//   return JSON.parse(JSON.stringify(snapshot))
// }

/**
 * type for event meta data
 */

const persistedSnapshotLogic = (actorLogic: any) => {
  // actorLogic.getPersistedSnapshot = getPersistedSnapshot
  return actorLogic
}

import type { ActorIdT, DOMHostT } from './types';
export type HostT = 'client' | 'server'
/**
 * Actor State - a state holding an xstate actor
 * We use extend State to be able to use state reactive controllers
 * and simplify the reuse of the same actor across different components
 * 
 * An actor state is in one of the following type:
 * - client only [clientOnly]: the actor is only created at client level and is not persisted in the db. it has no actorId.
 * - client and server [client]: the actor is created and persist at server level (it has an actorId). 
 *   Actions and event handling are executed on the client. State change are persisted in the db (from client to server)
 * - server only[server]: the actor is created at server level. It has an actorId.
 *   Actions and event handling are executed on the server via cloud functions. State change are received via firestoreController
 * 
 * Base class only supports `clientOnly` types. 
 * 
 * ### Example
 * ```js
 * const actor = new Actor(workflow)
 * 
 * export default class fsmTest extends LitElement {
 * 	bindActor = new StateController(this, actor)
 * 	override render() {
 * 		const send = () => actor.send({ type: 'NewPatientEvent', name: 'John', condition: 'healthy' })
 * 		return html`
 * 			<div>
 * 				<div>machineId: ${actor.machineId}</div>
 * 				<div>status: ${actor.status}</div>
 * 				<div>value: ${JSON.stringify(actor.value)}</div>
 * 			</div>
 * 			<md-filled-button @click=${send}>NewPatientEvent</md-filled-button>
 * 		`;
 * 	}
 * }
 * ```
 * 
 * @param machine - The state machine associated with the actor - or an actor instance
 * @param options - The options for the actor.
 * @param actorId - The ID of the actor.
 * @param rootPath - The root path of the actor in the db - for subclasses.
 * 
 */
export default class Actor extends State {

  declare ['constructor']: typeof Actor;
  static hostType: HostT = 'client'
  domHost: HTMLElement | undefined;
  constructor(
    public machine: AnyStateMachine,
    protected options: ActorOptions<AnyActorLogic> & { domHost?: DOMHostT } = {},
    actorId: ActorIdT,
    protected rootPath: string = 'actor') {
    super();
    this.actorId = actorId
    this.domHost = typeof options.domHost === 'function' ? options.domHost() : options.domHost;
    this.setupActor();
  }

  /**
   * Actor snapshot - requestUpdate is called whenever snapshot is updated
  */
  // @property({ type: Object }) snapshot!: SnapshotFrom< typeof this['machine']>;
  @property({ type: Object }) snapshot!: MachineSnapshot<
    ContextFrom<this['machine']>, EventFromLogic<this['machine']>, any, any, any, any, any, any
  >;

  /**
   * Gets the type of the host for the actor state.
   * The actor base class is always clientOnly - no interaction with the server.
   * @returns The type of the host, which is always 'clientOnly'.
   */
  get hostType() {
    // actor base class is always clientOnly - no interaction with the server
    return 'clientOnly'
  }
  /**
   * Gets the context of the actor state.
   * @returns The context of the actor state.
   */
  get context(): ContextFrom<this['machine']> {
    return this.snapshot?.context;
  }
  /**
   * Gets the status of the actor.
   * @returns The status of the actor.
   */
  get status() {
    return this.snapshot?.status || '';
  }
  /**
   * Gets the error from the actor's snapshot.
   * @returns The error from the snapshot, or undefined if there is no error.
   */
  get error() {
    return this.snapshot?.error;
  }
  /**
   * Gets the value of the actor state.
   * If a snapshot exists, it returns the snapshot's value. Otherwise, it returns an empty string.
   * @returns The value of the actor state.
   */
  get value() {
    return this.snapshot?.value || '';
  }
  /**
   * Checks if the actor's status is 'done'.
   * @returns {boolean} True if the actor's status is 'done', false otherwise.
   */
  get done() {
    return this.status === 'done';
  }
  /**
   * Checks if the actor has encountered an error.
   * @returns {boolean} True if the actor has encountered an error, false otherwise.
   */
  get hasError() {
    return this.status === 'error';
  }
  /**
   * Gets the ID of the machine associated with this actor state.
   * @returns The ID of the machine.
   */
  get machineId() {
    return this.machine.id;
  }
  /**
   * Actor persisted state 
  */
  get persistedSnapshot() {
    return this.actor.getPersistedSnapshot()
  }
  /**
   * The id of the actor - mostly to be used in sub-classes dealing with the db
   * If null, we create an actor calling cloud functions
   * If not null, we set a reactive controller linking to the actor in the db
   * If undefined, we do nothing => the actor only exists at client level
  */
  private _actorId!: ActorIdT
  get actorId() {
    return this._actorId;
  }
  set actorId(actorId: ActorIdT) {
    this._actorId = actorId;
    this.setupActorID(actorId);
    if (actorId) {
      // TODO: find a way to automatically unregister actors from registry
      Registry.register(this)
    }

  }
  /**
   * setup remote actor if need be - this need to be overridden in the child class
   * this is we would add a controller listening to the actor change in the db
   */
  protected async setupActorID(_actorId: ActorIdT) {
  }

  private _actor!: XstateActor<ActorLogicFrom<this['machine']>>;
  // private _actor!: XstateActor<this['machine']>;
  //  XstateActor<StateMachine<TContext, TEvent, any, any, any, any, any, any, any, any, any, any, any, any>>;

  get actor() {
    return this._actor;
  }
  set actor(actor) {
    this._actor = actor;
    this.subscribeActor(actor);
  }

  // protected subscribeActor(actor) {
  protected subscribeActor(actor: XstateActor<typeof this['machine']>) {
    actor.subscribe((snapshot) => {
      // console.log('actor subscription snapshot', snapshot.value, snapshot)
      this.snapshot = snapshot;

    });
    actor.start()
  }
  protected setupActor() {

    // if machine is already an actor, we use it
    if (this.machine instanceof XstateActor) {
      this.actor = this.machine
      this.snapshot = this.actor.getSnapshot();
      return
    }

    // create actor if remote is not involved
    this.actor = createActor(persistedSnapshotLogic(this.machine), this.options);
  }

  send(event: EventFromLogic<this['machine']>, _clientLevel = false) {
    return this.actor.send(event);
  }

  start() {
    return this.actor.start();
  }
  stop() {
    if (this.actorId) {
      // unregister 
      Registry.unregister(this)
    }
    return this.actor.stop();
  }

  on<TType extends EmittedFrom<this['machine']>['type']>(type: TType, handler: (emitted: any) => void) {
    return this.actor.on<TType>(type, handler);
  }

  /**
   * Whether the current state value is a subset of the given parent state value.
   * @param  {StateValue} testValue
   */
  matches(testValue: StateValue) {
    return this.snapshot.matches(testValue);
  }
  /**
   * Whether the current state nodes has a state node with the specified `tag`.
   * @param  {string} tag
   */
  hasTag(tag: string) {
    return this.snapshot?.hasTag(tag);
  }
  /**
   * Determines whether sending the `event` will cause a non-forbidden transition
   * to be selected, even if the transitions have no actions nor
   * change the state value.
   * 
   * @param  {TEvent} event
   */
  can(event: EventFromLogic<this['machine']>) {
    return this.snapshot?.can(event);
  }

  /**
   * get meta data from the current snapshot
   */
  getMeta() {
    return this.snapshot?.getMeta();
  }

  /**
   * get next available events for the given snapshot
   */
  getNextEvents() {
    if (!this.snapshot) {
      return []
    }
    return [...new Set([...this.snapshot._nodes.flatMap((sn) => sn.ownEvents)])];
  }

  /**
   * get next allowed events for the given snapshot
   */
  getNextAllowedEvents() {
    if (!this.snapshot) {
      return []
    }
    return [...this.getNextEvents()].filter((event) => {
      return this.can({ type: event } as EventFromLogic<this['machine']>);
    })
  }

  /**
   * get event config descriptor for the given event
   * @param event - the event name
   */
  getEventDescriptors(event: string): { meta?: EventMetaT } {
    if (!this.snapshot) {
      return {}
    }
    return this.snapshot._nodes.reduce((acc, node) => {
      // @ts-expect-error - explicitly ignore the error 
      return { ...acc, ...node.config?.on?.[event] }
    }, {} as StateNode<
      ContextFrom<this['machine']>, EventFromLogic<this['machine']>>)

  }

}
