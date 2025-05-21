import { html } from "lit";
import {
  Close,
  Create,
  Delete,
  Edit,
  EntityAction,
  Open,
  Reset,
  Write,
} from "./events.js";
import { ActionEntityI, ActionServerEntityI, DefaultActionsT, GetEventT } from "./types/actionTypes.js";
import { CollectionI } from "./types/dataI.js";


/**
 * TODO
 * - [ ] Add documentation
 * - [x] add pushHistory
 * - [x] add meta
 * - [x] add confirmDialog
 * - [x] handle bulk actions
 * 
 * For bulk actions, we need a better way to pass selectedItems. 
 * 
 * @returns 
 */

export function defaultActions<D>() {

  const actions: DefaultActionsT<D> = {
    create: {
      label: 'Create',
      kind: 'event',
      handler: (ref, data) => {
        console.log('create', data);
      },
      getEvent: (entityName, data) => {
        return new Create<Partial<D>>({ data, entityName }, actions.create);
      },
      meta: {
        label: 'Created',
        index: -10
      }

    },
    write: {
      kind: 'event',
      label: 'Save',
      icon: 'save',
      getEvent: (entityName, data, host) => {
        const id = (data as CollectionI<D>).$id || host?.docId
        if (!id) {
          throw new Error('id is required for write action')
        }
        return new Write<Partial<D>>({ data, entityName, id }, actions.write);
      },
      config: (_data, entityStatus) => {
        return {
          filled: entityStatus?.isDirty
        }
      },
      meta: {
        label: 'Updated',
        index: -9
      }
    },
    cancel: {
      kind: 'event',
      label: 'Cancel',
      icon: 'cancel',
      getEvent: (entityName, data, host) => {
        const id = (data as CollectionI<D>).$id || host?.docId
        if (!id) {
          throw new Error('id is required for reset action')
        }
        return new Reset({ id, entityName }, actions.cancel);
      },
    },
    edit: {
      kind: 'event',
      label: 'Edit',
      icon: 'edit',
      getEvent: (entityName, data, host) => {
        const id = (data as CollectionI<D>).$id || host?.docId
        if (!id) {
          throw new Error('id is required for edit action')
        }
        return new Edit({ id, entityName }, actions.edit);
      }
    },
    open: {
      kind: 'event',
      label: 'Open',
      icon: 'open_in_new',
      getEvent: (entityName, data, host) => {
        const id = (data as CollectionI<D>).$id || host?.docId
        if (!id) {
          throw new Error('id is required for open action')
        }
        return new Open({ id, entityName }, actions.open);
      }
    },
    close: {
      kind: 'event',
      label: 'Close',
      icon: 'highlight_off',
      getEvent: (entityName, data, host) => {
        const id = (data as CollectionI<D>).$id || host?.docId
        if (!id) {
          throw new Error('id is required for close action')
        }
        return new Close({ id, entityName }, actions.close);
      }
    },
    // delete is deprecated  use markDeleted instead
    // delete truly deletes the entity, while markDeleted sets the deleted flag
    delete: {
      kind: 'event',
      label: 'Delete',
      icon: 'delete',
      pushHistory: true,
      getEvent: (entityName, data, host) => {
        const id = (data as CollectionI<D>).$id || host?.docId
        if (!id) {
          throw new Error('id is required for delete action')
        }
        return new Delete({ id, entityName, data }, actions.delete);
      },
      confirmDialog: {
        heading: 'Confirm Delete',
        render: ({ data }: { data: any }) => {
          const name = data.hasOwnProperty('name') && data.name ?
            data.name : data.hasOwnProperty('title') && data.title ?
              data.title : 'an entity';
          return html`<p>You are about to delete <strong>${name}</strong>. Please confirm.</p>`;
        }
      },
      meta: {
        label: 'Deleted',
        index: -7
      },
    },
    markDeleted: {
      kind: 'server',
      label: 'Delete',
      icon: 'delete',
      pushHistory: true,
      meta: {
        label: 'Deleted',
        index: -7
      },
      confirmDialog: {
        heading: 'Confirm Delete',
        render: ({ data }: { data: any }) => {
          const name = data.hasOwnProperty('name') && data.name ? data.name : data.hasOwnProperty('title') && data.title ? data.title : 'an entity';
          return html`<p>You are about to mark <strong>${name}</strong> as deleted. Please confirm.</p>`;
        }
      },
    },
    restore: {
      kind: 'server',
      label: 'Restore',
      icon: 'restore_from_trash',
      pushHistory: true,
      meta: {
        label: 'Restored',
        index: -8
      }
    },
    setAccess: {
      kind: 'server',
      label: 'Set Access',
      icon: 'lock',

    },
    addAccess: {
      kind: 'server',
      label: 'Add Access',
      icon: 'add',

    },
    removeAccess: {
      kind: 'server',
      label: 'Remove Access',
      icon: 'remove',
      // getEvent: getEntityActionEvent('removeAccess'),
    },
    invite: {
      kind: 'entity',
      label: 'Invite',
      icon: 'person_add',
      handler: (ref, data) => {
        // this triggers a createActor invite machine 
        // TODO: we should create teh machine here, but issues with dependencies (actorStateServer do not belong here)
        console.log('invite', data);
      }
    },

  }
  return actions
}

const actions = defaultActions();

/**
 * Generates an event for a specified entity action.
 *
 * @template D - The type of the data associated with the entity.
 * @param {string} actionName - The name of the action to be performed.
 * @param {ActionT} [action] - Optional action object. If not provided, it will be retrieved from the default actions.
 * @returns {GetEventT<D>} A function that generates the event for the specified entity action.
 * 
 * @throws {Error} If the entity ID is not provided or if the action is not found.
 */
export function getEntityActionEvent<D>(
  actionName: string, action?: ActionEntityI | ActionServerEntityI
): GetEventT<D> {
  return (entityName, data, host, isBulk?, confirmed?) => {
    action = action || (actions[actionName as keyof DefaultActionsT<D>] as ActionEntityI);
    if (isBulk) {
      // we do not have an id for bulk actions
      return new EntityAction({ entityName, data }, action, actionName, confirmed, isBulk);
    }
    const id = (data as CollectionI<D>)?.$id || host?.docId;
    if (!id) {
      console.warn(`No id provided for ${actionName} action`, data);
    }
    if (!action) {
      throw new Error(`Action ${actionName} not found`);
    }
    return new EntityAction({ id, entityName, data }, action, actionName, confirmed, isBulk);
  };
}