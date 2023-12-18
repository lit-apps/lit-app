import { CollectionReference, DocumentData, QuerySnapshot, WriteBatch } from 'firebase/firestore'
import { Action } from './types/action'

/**
 * Interface for global entity events
 */

export interface EntityDetail {
  id: string,
  entityName: string,
  promise?: Promise<any>
}

export interface EntityWriteDetail extends EntityDetail {
  data: any,
}
export interface EntityCreateDetail<T = any> {
  entityName: string,
  data: T,
  collection?: CollectionReference, // a ref to the collection where the entity is created
  subCollection?: string, // a string representing the subcollection path relative to this.ref
  batch?: WriteBatch,
  promise?: Promise<any>
}
export interface EntityDirtyDetail {
  entityName: string,
  promise?: Promise<any>
  dirty: boolean
}

export interface EntityActionDetail {
  action: string
}

export class BaseEvent<T extends { promise?: Promise<any> }> extends CustomEvent<T> {
  public action?: Action | undefined
  public confirmed?: boolean // true when the action is confirmed by the user
  public processed?: boolean // true when the action was already processed
  public onActionProcessed?: boolean // true when an `onAction` function was already executed
  pushPromise(promise: Promise<any>) {
    this.detail.promise = Promise.all([this.detail.promise, promise]);
  }
  get canProcess() {
    return !this.shouldConfirm && !this.processed;
    // return this.confirmed || !this.action.confirmDialog;
  }
  get shouldConfirm() {
    return !!(!this.confirmed && this.action?.confirmDialog);
  }
}

export class Write extends BaseEvent<EntityWriteDetail> {
  static readonly eventName = 'entity-write';
  readonly actionName = 'write'
  public persisted?: boolean // true when data is persisted
  constructor(
    detail: EntityWriteDetail,
    public override readonly action?: Action) {
    super(Write.eventName, {
      bubbles: true,
      composed: true,
      detail: detail
    });

  }
}

/* Update is used in realtime scenarios where the data is updated in the database 'live' */
export class Update extends BaseEvent<EntityWriteDetail> {
  static readonly eventName = 'entity-update';
  readonly actionName = 'update'
  public persisted?: boolean // true when data is persisted
  constructor(
    detail: EntityWriteDetail,
    public override readonly action?: Action) {
    super(Update.eventName, {
      bubbles: true,
      composed: true,
      detail: detail
    });
  }
}
export class Reset extends BaseEvent<EntityDetail> {
  static readonly eventName = 'entity-reset';
  readonly actionName = 'reset'
  public persisted?: boolean // true when data is persisted
  constructor(
    detail: EntityDetail,
    public override readonly action?: Action) {
    super(Reset.eventName, {
      bubbles: true,
      composed: true,
      detail: detail
    });
  }
}

export class Delete extends BaseEvent<EntityWriteDetail> {
  static readonly eventName = 'entity-delete';
  public persisted?: boolean // true when data was persisted
  readonly actionName = 'delete';
  constructor(detail: EntityWriteDetail) {
    super(Delete.eventName, {
      bubbles: true,
      composed: true,
      detail: detail
    });
  }
}

 
export class Create extends BaseEvent<EntityCreateDetail> {
  static readonly eventName = 'entity-create';
  public persisted?: boolean // true when data is persisted
  readonly actionName = 'create';
  constructor(
    detail: EntityCreateDetail,
    public override readonly action: Action) {
    super(Create.eventName, {
      bubbles: true,
      composed: true,
      detail: detail
    });
  }
}

export class Dirty extends BaseEvent<EntityDirtyDetail> {
  static readonly eventName = 'entity-dirty';
  constructor(detail: EntityDirtyDetail) {
    super(Dirty.eventName, {
      bubbles: true,
      composed: true,
      detail: detail
    });
  }
}

export class Close extends BaseEvent<EntityDetail> {
  static readonly eventName = 'entity-close';
  constructor(
    detail: EntityDetail,
    public override readonly action?: Action
  ) {
    super(Close.eventName, {
      bubbles: true,
      composed: true,
      detail: detail
    });
  }
}
export class Open extends BaseEvent<EntityDetail> {
  static readonly eventName = 'entity-open';
  constructor(
    detail: EntityDetail,
    public override readonly action?: Action) {
    super(Open.eventName, {
      bubbles: true,
      composed: true,
      detail: detail
    });
  }
}

export class Edit extends BaseEvent<EntityDetail> {
  static readonly eventName = 'entity-edit';
  constructor(
    detail: EntityDetail,
    public override  readonly action: Action) {
    super(Edit.eventName, {
      bubbles: true,
      composed: true,
      detail: detail
    });
  }
}

class BaseAction<T> extends BaseEvent<T & { promise?: Promise<any> }> {
  public bulkAction?: boolean

  override get shouldConfirm() {
    return !!(!this.confirmed && (this.action?.confirmDialog || this.bulkAction));
  }

}

export interface ActionDetail<T = any> {
  entityName: string,
  id?: string,
  data?: T,
  selectedItems?: any[],
  promise?: Promise<any>
}

export interface ActionI {
  actionName: string
  detail: any
  entityName?: string // the entityName is not required for all actions
}
export class EntityAction<T extends ActionI = ActionI> extends BaseAction<ActionDetail<T['detail']>> {
  static readonly eventName = 'entity-action';

  constructor(
    detail: ActionDetail<T['detail']>,
    public override readonly action: Action,
    public readonly actionName: T['actionName'],
    public override  confirmed?: boolean,
    public override  bulkAction?: boolean) {
    super(EntityAction.eventName, {
      bubbles: true,
      composed: true,
      detail: detail
    });
  }
}



export class AppAction extends BaseAction<ActionDetail> {
  static readonly eventName = 'app-action';

  constructor(
    detail: ActionDetail,
    public override readonly action: Action,
    public readonly actionName: string,
    public override  confirmed?: boolean,
    public override  bulkAction?: boolean) {
    super(AppAction.eventName, {
      bubbles: true,
      composed: true,
      detail: detail
    });
  }
}

export type Email = {
  to?: string
  from?: string
  subject: string
  text?: string
  html?: string
  cc?: string
  bcc?: string
  replyTo?: string
}

export type Template = {
  $id: string,
  name: string,
  description: string,
  data: {
    subject: string
    body: string
    hasCallToAction?: boolean
    callToAction?: string
  }
}


type EntityType = 'user' | 'organisation'
export type CallToAction = {
  id?: string
  entity: {
    [key in EntityType]: string
  }
}
export type ActionLookup = {
  code: string
  label: string
  description: string


}

type Target = {
  entity: string
  entityId: string
}
export interface ActionEmailDetail extends ActionDetail {
  emailData?: Email | Promise<Email>,
  template?: Template | Template[] | Promise<QuerySnapshot<DocumentData>>,
  actionLookup?: ActionLookup[],
  target: Target
  isTest?: boolean
}

export class AppActionEmail extends BaseAction<ActionEmailDetail> {
  static readonly eventName = 'app-email-action';
  readonly actionName = 'app-email-action';
  constructor(
    detail: ActionEmailDetail,
    public override readonly action: Action,
    public override  confirmed?: boolean,
    public override  bulkAction?: boolean) {
    super(AppActionEmail.eventName, {
      bubbles: true,
      composed: true,
      detail: detail
    });
  }
  // override get shouldConfirm() {
  //   return !!(!this.confirmed);
  // }
}


type AnyEntityEvent =  Write | Update | Reset | Delete | Create | Dirty | Close | Open | Edit  
type AnyAppEvent =  EntityAction | AppAction | AppActionEmail
// type AccessEvent = AddAccess | RemoveAccess | SetAccess | AccessInvite | AccessInviteRevoke;
export type AnyEvent =  AnyEntityEvent | AnyAppEvent 
export type TypeofAnyEvent = typeof Write | typeof Update | typeof Reset | typeof Delete |  typeof Create | typeof Dirty | typeof Close | typeof Open | typeof Edit | typeof EntityAction<any> | typeof AppAction | typeof AppActionEmail ; 
// export type TypeofAnyEvent = {new(detail: any, action: Action, confirmed?: boolean, bulkAction?: boolean): AnyEntityEvent} | 
//   {new(detail: any, action: Action, actionName: string, confirmed?: boolean, bulkAction?: boolean): AnyAppEvent} |
//   {new(detail: EntityAccessDetail | EntityAccessInviteRevokeDetail, action: Action): AccessEvent} 
declare global {
  interface HTMLElementEventMap {
    'entity-reset': Reset, // reset entity to original state (database state)
    'entity-write': Write, // commit local changes to database
    'entity-update': Update, // commit local changes to database - realtime
    'entity-delete': Delete, // delete entity from database
    // 'entity-mark-deleted': MarkDeleted, // mark entity as deleted
    // 'entity-restore': Restore, // delete entity from database
    'entity-create': Create, // create new entity in database
    'entity-dirty': Dirty, // mark entity as dirty (local changes)
    'entity-edit': Edit, // mark entity as editable
    'entity-open': Open, // open an entity (eg. from list)
    'entity-close': Close, // close an entity (eg. from detail, or from top-menu like in survey-app)
    'entity-action': EntityAction, // perform an action on an entity (for instance, mark public or private). 
    'app-action': AppAction, // perform an action on action on app level 
    'app-action-email': AppActionEmail, // send message - we need a distinct event for this as some components might add content to the message sent
  }
}