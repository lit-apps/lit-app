import { CollectionReference, DocumentData, DocumentReference, QuerySnapshot, WriteBatch } from 'firebase/firestore'
import { Action } from './types'

/**
 * Interface for global entity events
 */

 export interface EntityDetail {
  entityName:string,
  id: string, 
  promise?: Promise<any>
}

export interface EntityWriteDetail extends EntityDetail {
  data: any, 
}
export interface EntityCreateDetail {
  entityName:string,
  data: any,
	collection?: CollectionReference, // a ref to the collection where the entity is created
  subCollection?: string, // a string representing the subcollection path relative to this.ref
  batch?: WriteBatch,
  promise?: Promise<any>
}
export interface EntityDirtyDetail extends EntityDetail {
	dirty: boolean
}

export interface EntityActionDetail {
	action: string
}

export class BaseEvent<T extends {promise?:Promise<any>}> extends CustomEvent<T> {
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
    return !!(!this.confirmed && this.action?.confirmDialog );
  }	
}

export class Write extends BaseEvent<EntityWriteDetail> {
  static readonly eventName = 'entity-write';
  readonly actionName = 'write'
  // public debounce: number = 5000;
  public persisted?: boolean // true when the was persisted
  constructor(
    detail: EntityWriteDetail,
    public override readonly action: Action) {
    super(Write.eventName, {
      bubbles: true,
      composed: true,
      detail: detail
    });
    // if(debounce) {
    //   this.debounce = debounce === true ? 5000 : debounce as number;
    // }
  }
}

/* Update is used in realtime scenarios where the data is updated in the database 'live' */
export class Update extends BaseEvent<EntityWriteDetail> {
  static readonly eventName = 'entity-update';
  readonly actionName = 'update'
  public persisted?: boolean // true when the was persisted
  constructor(
    detail: EntityWriteDetail
    ) {
    super(Update.eventName, {
      bubbles: true,
      composed: true,
      detail: detail
    });
  }
}
export class Reset extends BaseEvent<EntityDetail> {
  static readonly eventName = 'entity-reset';
  public persisted?: boolean // true when the entity was persisted
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
  public persisted?: boolean // true when the was persisted
  readonly actionName = 'delete';
  constructor(detail: EntityWriteDetail) {
    super(Delete.eventName, {
      bubbles: true,
      composed: true,
      detail: detail
    });
  }
}

export class Restore extends BaseEvent<EntityDetail> {
  static readonly eventName = 'entity-restore';
  readonly actionName = 'restore';
  constructor(
    detail: EntityDetail,
    public override readonly action: Action) {
    super(Restore.eventName, {
      bubbles: true,
      composed: true,
      detail: detail
    });
  }
}

/** Mark deleted - as opposed to delete - will not remove object from persistence */
export class MarkDeleted extends BaseEvent<EntityWriteDetail> {
  static readonly eventName = 'entity-mark-deleted';
  readonly actionName:string = 'markDeleted';
  constructor(
    detail: EntityWriteDetail,
    public override readonly action: Action) {
    super(MarkDeleted.eventName, {
      bubbles: true,
      composed: true,
      detail: detail
    });
  }
}
export class Create extends BaseEvent<EntityCreateDetail> {
  static readonly eventName = 'entity-create';
  public persisted?: boolean // true when the was persisted
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

class BaseAction<T> extends BaseEvent<T & {promise?:Promise<any>}> {
  public bulkAction?: boolean
  
  override get shouldConfirm() {
    return !!(!this.confirmed && (this.action?.confirmDialog || this.bulkAction));
  }

}

export interface ActionDetail {
  entityName:string,
  id: string,
  data?: any,
  selectedItems?: any[],
  promise?: Promise<any>
}

export class EntityAction extends BaseAction<ActionDetail> {
  static readonly eventName = 'entity-action';
  
  constructor(
    detail: ActionDetail, 
    public override readonly action: Action, 
    public readonly actionName: string, 
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
    public override readonly  action: Action, 
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
      [key in EntityType ]: string
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
    public override readonly  action: Action, 
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


export type AnyEvent = Write | Update | Reset | Delete | MarkDeleted | Restore | Create | Dirty | Close | Open | Edit | EntityAction | AppAction | AppActionEmail;
export type TypeofAnyEvent = typeof Write | typeof Update | typeof Reset | typeof Delete | typeof MarkDeleted | typeof Restore | typeof Create | typeof Dirty | typeof Close | typeof Open | typeof Edit | typeof EntityAction | typeof AppAction | typeof AppActionEmail;
declare global {
  interface HTMLElementEventMap {
    'entity-reset': Reset, // reset entity to original state (database state)
    'entity-write': Write, // commit local changes to database
    'entity-update': Update, // commit local changes to database - realtime
    'entity-delete': Delete, // delete entity from database
    'entity-mark-deleted': MarkDeleted, // mark entity as deleted
    'entity-restore': Restore, // delete entity from database
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