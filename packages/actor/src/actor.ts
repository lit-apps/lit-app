/**
 * A factory for creating State from xstate 
 */

import { State, property } from '@lit-app/state';
import Registry from "./registry";
import type { Actor as XstateActor, Snapshot, AnyActorRef, ActorOptions, EventFromLogic, EventObject, MachineContext, MachineSnapshot, StateMachine, StateValue, AnyStateMachine } from 'xstate';
import { createActor } from 'xstate';

/**
 * Remove undefined values from snapshot
 * 
 * @deprecated - not to be used as it removes all refs from invoked ans spanwed actors
 */
function getPersistedSnapshot<TContext extends MachineContext,
  TEvent extends EventObject,
  TChildren extends Record<string, AnyActorRef | undefined>,
  TStateValue extends StateValue,
  TTag extends string,
  TOutput>(snapshot: MachineSnapshot<
    TContext,
    TEvent,
    TChildren,
    TStateValue,
    TTag,
    TOutput
  >
  ): Snapshot<unknown> {
  return JSON.parse(JSON.stringify(snapshot))
}

const persistedSnapshotLogic = (actorLogic: any) => {
  // actorLogic.getPersistedSnapshot = getPersistedSnapshot
  return actorLogic
}

export type HostT = 'client' | 'server'
type ActorIdT = string | undefined | null
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
 * @param actor - the xstate actor
 * 
 */
export default class Actor<
  TContext extends MachineContext, TEvent extends EventObject = EventObject
> extends State {

  declare ['constructor']: typeof Actor<{}>;
  static hostType: HostT = 'client'
 

  /**
   * Actor snapshot - requestUpdate is called whenever snapshot is updated
  */
  @property({ type: Object }) snapshot!: MachineSnapshot<TContext, TEvent, any, any, any, any>

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
  get context() {
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
  set actorId(actorId) {
    this._actorId = actorId;
    this.setupActorID(actorId);
    if(actorId) {
      Registry.register(this)
    }

  }
  /**
   * setup remote actor if need be - this need to be overridden in the child class
   * this is we would add a controller listening to the actor change in the db
   */
  protected async setupActorID(_actorId: ActorIdT) {
  }

  private _actor!: XstateActor<AnyStateMachine>;

  get actor() {
    return this._actor;
  }
  set actor(actor) {
    this._actor = actor;
    this.subscribeActor(actor);
  }

  protected subscribeActor(actor: XstateActor<AnyStateMachine>) {
    actor.subscribe((snapshot) => {
      // console.log('actor subscription snapshot', snapshot.value, snapshot)
      this.snapshot = snapshot;

    });
    if(this.beforeStart) {
      this.beforeStart(actor)
    }
    actor.start()
  }
  protected setupActor() {
    // create actor if remote is not involved
    this.actor = createActor(persistedSnapshotLogic(this.machine), this.options);
  }

  constructor(
    public machine: StateMachine<TContext, TEvent, any, any, any, any, any, any, any, any, any> & {stateActor?: Actor<TContext, TEvent>},
    protected options: ActorOptions<any> = {},
    actorId: ActorIdT, 
    protected beforeStart?: (actor: XstateActor<AnyStateMachine>) => void){
    super();
    this.actorId = actorId
    this.setupActor();
    machine.stateActor = this;
  }

  send(event: TEvent, _clientLevel = false) {
    return this.actor.send(event);
  }

  start() {
    return this.actor.start();
  }
  stop() {
    return this.actor.stop();
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
    return this.snapshot.hasTag(tag);
  }
  /**
   * Determines whether sending the `event` will cause a non-forbidden transition
   * to be selected, even if the transitions have no actions nor
   * change the state value.
   * 
   * @param  {TEvent} event
   */
  can(event: EventFromLogic<this['machine']>) {
    return this.snapshot.can(event);
  }

  /**
   * get meta data from the current snapshot
   */
  getMeta() {
    return this.snapshot?.getMeta();
  }

}

