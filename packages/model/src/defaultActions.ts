import {
  Create,
  Reset,
  Write,
  Edit,
  Open,
  Close,
  Delete,
  EntityAction,
} from "./events.js"
import { html } from "lit";
import { ActionT, DefaultActionsT, GetEventT } from "./types/actionTypes.js";


/**
 * TODO
 * - [ ] Add documentation
 * - [x] add pushHistory
 * - [x] add meta
 * - [x] add confirmDialog
 * - [ ] handle bulk actions
 * 
 * For bulk actions, we need a better way to pass selectedItems. 
 * 
 * @returns 
 */

export function defaultActions<D>(): DefaultActionsT<D> {

  const actions: DefaultActionsT<D> = {
    create: {
      label: 'Create',
      kind: 'event',
      getEvent: (entityName, { data }) => {
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
      getEvent: (entityName, { data }, host) => {
        const id = data.$id || host?.docId
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
      getEvent: (entityName, { data }, host) => {
        const id = data.$id || host?.docId
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
      getEvent: (entityName, { data }, host) => {
        const id = data.$id || host?.docId
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
      getEvent: (entityName, { data }, host) => {
        const id = data.$id || host?.docId
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
      getEvent: (entityName, { data }, host) => {
        const id = data.$id || host?.docId
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
      getEvent: (entityName, { data }, host) => {
        const id = data.$id || host?.docId
        if (!id) {
          throw new Error('id is required for delete action')
        }
        return new Delete({ id, entityName, data }, actions.delete);
      },
      confirmDialog: {
        heading: 'Confirm Delete',
        render: (data: any) => {
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
      kind: 'entity',
      label: 'Delete',
      icon: 'delete',
      pushHistory: true,
      // getEvent: getEntityActionEvent('markDeleted'),
      meta: {
        label: 'Deleted',
        index: -7
      },
      confirmDialog: {
        heading: 'Confirm Delete',
        render(data: any) {
          const name = data.hasOwnProperty('name') && data.name ? data.name : data.hasOwnProperty('title') && data.title ? data.title : 'an entity';
          return html`<p>You are about to mark <strong>${name}</strong> as deleted. Please confirm.</p>`;
        }
      },
    },
    restore: {
      kind: 'entity',
      label: 'Restore',
      icon: 'restore',
      pushHistory: true,
      // getEvent: getEntityActionEvent('restore'),
      meta: {
        label: 'Restored',
        index: -8
      }
    },
    setAccess: {
      kind: 'entity',
      label: 'Set Access',
      icon: 'lock',
      // getEvent: getEntityActionEvent('setAccess'),
      
    },
    addAccess: {
      kind: 'entity',
      label: 'Add Access',
      icon: 'add',
      // getEvent: getEntityActionEvent('addAccess'),
      
    },
    removeAccess: {
      kind: 'entity',
      label: 'Remove Access',
      icon: 'remove',
      // getEvent: getEntityActionEvent('removeAccess'),
    },
    invite: {
      kind: 'entity',
      label: 'Invite',
      icon: 'person_add',
      // getEvent: getEntityActionEvent('invite'),
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
export function getEntityActionEvent<D>(actionName: string, action?: ActionT ): GetEventT<D> {
  return (entityName, { data }, host, isBulk?, confirmed?) => {
    const id = data.$id || host?.docId;
    if (!id) {
      throw new Error(`id is required for ${actionName} action`);
    }
    action = action || actions[actionName as keyof DefaultActionsT<D>];
    if(!action) {
      throw new Error(`Action ${actionName} not found`);
    }
    return new EntityAction({ id, entityName, data }, action, actionName, confirmed, isBulk);
  } ;
}