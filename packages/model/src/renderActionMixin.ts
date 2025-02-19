/** 
* this mixin is a replacement of the renderActionMixin from the @lit-app/model
* 
* Its main goal it to administer action rendering and action handling for entities.
* 
* There are different action handling strategies:
* - 1. the action is handled on the entity itself.
* - 2. the action is handled on a level above the entity that hold a reference to the database (for instance 
* db-ref element). This is achieved by trigging a known custom event on the entity host. THis is mostly covered
* by the default actions.
* - 3. the action is handled by a mixin above the entity. This is also  achieved by trigging  a custom event 
* on the entity host, but the event is not known to the entity. An example of this is the way we trigger 
* email sending via a mixin. 
* 
*/
import "@lit-app/cmp/button/button.js";
import type { LappButton } from "@lit-app/cmp/button/button.js";
import "@lit-app/cmp/toolbar/toolbar.js";
import { callFunctionOrValue } from "@lit-app/shared/callFunctionOrValue.js";
import { ToastEvent } from "@lit-app/shared/event";
import { RecursivePartial } from "@lit-app/shared/types.js";
import '@material/web/iconbutton/filled-icon-button.js';
import { html, nothing, TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import AbstractEntity, { DocumentationKeysT } from "./AbstractEntity.js";
import { defaultActions, getEntityActionEvent } from "./defaultActions.js";
import { Close, DataChanged, Dirty, Open } from "./events.js";
import RenderEntityCreateMixin from "./renderEntityCreateMixin.js";
import type { CollectionI, DataI, EntityAction } from "./types.js";
import type {
  ActionDataT,
  ActionEventI,
  ActionKeyT,
  ActionsT,
  DefaultActionsT,
  FilterActionKeyT,
  FunctionOrButtonConfigT,
  HostElementI,
  MenuConfigT
} from "./types/actionTypes.js";
import { RenderConfig } from "./types/entity.js";
import { RenderInterface, StaticEntityActionI } from "./types/renderActionI.js";

type Constructor<T = {}> = new (...args: any[]) => T;

export default function renderMixin<A extends ActionsT>(
  superclass: Constructor<AbstractEntity>,
  actions?: A
) {

  const staticApply: {
    entityName?: string
    actions: A & DefaultActionsT<unknown>
  } &
    StaticEntityActionI<A> &
  { documentationKeys?: DocumentationKeysT } = {
    actions: Object.assign({}, defaultActions(), actions as A || {}),

    renderAction(
      actionName: keyof A | keyof DefaultActionsT<unknown>,
      host: HostElementI<unknown>,
      data: unknown,
      config?: RenderConfig | FunctionOrButtonConfigT<unknown>,
      clickHandler?: (e: CustomEvent) => void
    ): TemplateResult {
      const action = this.actions[actionName]
      const entityStatus = (config && isRenderConfig(config)) ? config.entityStatus : host.entityStatus
      const authorization = (config && isRenderConfig(config)) ? config.authorization : host.authorization
      const callFunction = callFunctionOrValue.bind(host);

      const getConfig = (config: RenderConfig | FunctionOrButtonConfigT<unknown>) => {
        // do not take config into account if it is a renderConfig
        if (isRenderConfig(config)) {
          return {}
        }
        return callFunction(config, data, entityStatus)
      }
      const cfg = { ...{}, ...getConfig(action.config || {}), ...getConfig(config || {}) }
      const disabled = cfg?.disabled || action.disabled
      const softDisabled = disabled !== undefined ? callFunction(disabled, data, authorization, entityStatus) : false
      // cfg?.softDisabled === true
      const filled = cfg?.filled ?? false
      const tonal = cfg?.tonal ?? false
      const text = cfg?.text ?? false
      const outlined = cfg?.outlined ?? !text
      const icon = cfg?.icon || action.icon || ''
      const label = cfg?.label || action.label || ''
      const onClick = clickHandler || this.actionHandler(actionName, host, data)
      const $id = (config as RenderConfig)?.context === 'detail' ? (data as any).$id || host.docId || '' : undefined
      return html`<lapp-button 
        focus-on-activate=${ifDefined($id)}
        class="${actionName} action"
        .icon=${icon} 
        @click=${onClick}
        .softDisabled=${softDisabled}
        .outlined=${outlined}
        .ariaLabel=${action.ariaLabel ? callFunction(action.ariaLabel, data) : null}
        .tonal=${tonal}
        .filled=${filled}>
          ${callFunction(label, data)}
        </lapp-button>`
    },

    async getActionEvent(
      actionName: ActionKeyT<A, unknown>,
      host: HostElementI,
      data: ActionDataT<unknown>,
      isBulk: boolean = false
    ): Promise<EntityAction | void> {
      const action = this.actions[actionName]
      if (action.kind === 'simple') {
        await action.handler.call(host, data)
        return
      } else if (action.kind === 'event' ||
        action.kind === 'entity' ||
        action.kind === 'server' ||
        action.kind === 'mixin'
      ) {
        const event = (action.kind === 'event' || action.kind === 'mixin')
          ? await action.getEvent(this.entityName!, { data }, host, isBulk)
          : getEntityActionEvent(actionName as string, action)(
            this.entityName!, { data }, host, isBulk
          )
        return event as EntityAction
      } else {
        throw new Error('action kind not supported')
      }
    },

    actionHandler(
      actionName: ActionKeyT<A, unknown>,
      host: HostElementI,
      data: ActionDataT<unknown>,
      isBulk: boolean = false) {
      const action = this.actions[actionName]
      return async (e: CustomEvent) => {
        if (action.beforeDispatch?.(data) === false) {
          return
        }
        const button = e.target as LappButton
        button.loading = true
        try {
          const event = await this.getActionEvent(actionName, host, data, isBulk)
          if (!event) {
            // return early for simple events
            return event
          }
          host.dispatchEvent(event)
          await event.detail.promise
          if (action.afterResolved) {
            await action.afterResolved(event, host);
          }
          return event

        }
        catch (error) {
          console.error(error)
          // TODO: centralize the way we handler errors (see stripe-web-sdk for inspiration)
          // For the time being, we just dispatch Toast Event
          host?.dispatchEvent(new ToastEvent((error as Error).message, 'error'))
        }
        finally {
          button.loading = false
        }
      }
    },

    filterActions(
      key: FilterActionKeyT,
      host: HTMLElement,
      data: unknown): ([string, number | MenuConfigT<any>])[] {
      const callFunction = callFunctionOrValue.bind(host);
      return Object.entries(this.actions)
        .filter(([_, action]) => action && action[key] !== undefined)
        .map(([_, action]) => [_, callFunction(action[key]!, data)] as [string, number | MenuConfigT<any>])
        .filter(([_, numberOrConfig]) => {
          if (typeof numberOrConfig === 'number') return numberOrConfig > -1
          return numberOrConfig?.index > -1
        })
        .sort(([, numberOrConfigA], [, numberOrConfigB]) => {
          const a = typeof numberOrConfigA === 'number' ? numberOrConfigA : numberOrConfigA.index
          const b = typeof numberOrConfigB === 'number' ? numberOrConfigB : numberOrConfigB.index
          return (a as number ?? 0) - (b as number ?? 0);
        })
    }

  }

  class R extends RenderEntityCreateMixin(superclass) implements RenderInterface<A> {
    showActions: boolean = false

    /**
    * inspired from https://github.com/Microsoft/TypeScript/issues/3841#issuecomment-1488919713
    * We will need to set the type of constructor on all subclasses so that
    * the type of actions is properly inferred. 
    */
    // @ts-expect-error - we are cheating
    declare ['constructor']: typeof staticApply

    // TODO remove this when integrated in the model (we should have this on AbstractEntity only)
    override get actions() {
      return (this.constructor).actions;
    }

    // renderContent is called by renderEntityMixin - it is the entry point for rendering actions
    override renderContent(data: unknown, config: RenderConfig): TemplateResult {
      if (this.canViewActions(data, config)) {
        const doc = this.constructor.documentationKeys?.actions
        // when we are in a (grid) detail context, we do not want to render actions as sticky
        const stickyClass = config.context === 'detail' ? '' : 'sticky'
        return html`
					<div id="action" 
            class="${stickyClass} layout horizontal center wrap" 
            data-documentation="${doc ? (typeof doc === 'string' ? doc : 'actions') : nothing}">
            ${this.renderEntityActions(data, config)}
          </div>
				`
      }
      return html``
    }

    /**
     * Whether or not the actions should be displayed
     */
    protected canViewActions(_data: unknown, config: RenderConfig): boolean {
      const consumingMode = this.host.consumingMode ?? 'edit';
      const authorization = config.authorization || this.host.authorization;
      console.log('canViewActions', this.entityName, consumingMode, authorization?.canEdit)
      return this.showActions &&
        authorization?.canEdit &&
        consumingMode !== 'print' && consumingMode !== 'offline'
    }

    protected renderEntityActions(data: unknown, config: RenderConfig): TemplateResult {
      return this.renderBaseActions(data, config)
    }

    private renderBaseActions(data: unknown, config: RenderConfig): TemplateResult {
      const entityStatus = config.entityStatus || this.host.entityStatus;

      return html`
				${entityStatus?.isEditing ?
          this.renderEditingActions(data, config) :
          this.renderViewingActions(data, config)
        }
				<span class="flex"></span>
				${entityStatus?.isEditing ?
          this.renderOnEditingActions(data, config) :
          this.renderOnViewingActions(data, config)}
			`
    }

    /**
     * Actions to display when in editing mode (write and cancel actions)
     * @param data 
     * @param config 
     * @returns 
     */
    protected renderEditingActions(data: unknown, config: RenderConfig): TemplateResult {
      return html`
        ${this.renderAction('write', data, config)}  
        ${this.renderAction('cancel', data, config)}  
      `
    }

    /**
     * Actions to display when in viewing mode (edit action)
     * @param data 
     * @param config 
     * @returns 
     */

    protected renderViewingActions(data: unknown, config: RenderConfig): TemplateResult {
      // TODO: we need a way to add `focus-on-activate` here
      return html`
        ${this.renderAction('edit', data, config)}
      `
    }
    /**
     * Utility render method to render default actions in Viewing mode
     */
    protected renderOnViewingActions(data: unknown, config: RenderConfig): TemplateResult {
      return this.renderActions(data, config, 'showOnViewing');
    }

    /**
     * Utility render method to render default actions in Editing mode
     */
    protected renderOnEditingActions(data: unknown, config: RenderConfig): TemplateResult {
      return this.renderActions(data, config, 'showOnEditing');
    }

    /**
     * Renders bulk actions for the entity.
     * @param data - The data associated with the bulk actions.
     * @param config - The configuration for rendering the bulk actions.
     * @returns The rendered bulk actions as a `TemplateResult`.
     */
    renderBulkActions(data: unknown, config: RenderConfig): TemplateResult {
      const actions = Object.entries(this.actions)
        .filter(([_, action]) => action.bulk !== undefined)
        .sort(([, a], [, b]) => {
          const orderA = a.bulk?.index ?? 0;
          const orderB = b.bulk?.index ?? 0;
          return orderA - orderB;
        })
        .map(([name]) => this.renderBulkAction(name, data, config));
      return html`
      <lapp-toolbar style="gap: var(--space-x-small, 8px);">${actions}</lapp-toolbar>`;
    }

    filterActions(key: FilterActionKeyT, data: unknown): ([string, number | MenuConfigT<any>])[] {
      return this.constructor.filterActions(key, this.host, data)
    }

    /**
     * Utility method to render a group of actions based on a specified key
     */
    protected renderActions(data: unknown, config: RenderConfig, key: FilterActionKeyT): TemplateResult {
      const actions = this.filterActions(key, data)
        .map(([name, numberOrConfig]) => {
          if (typeof numberOrConfig === 'object') {
            return this.renderAction(name as string, data, { ...config, ...numberOrConfig });
          }
          return this.renderAction(name as string, data, config)
        });

      return html`${actions}`;
    }

    /**
     * Renders an action based on the provided action name, data, and configuration.
     *
     * @param actionName - The name of the action to render.
     * @param data - The data associated with the action.
     * @param config - The configuration for rendering the action.
     * @returns The rendered action as a `TemplateResult`.
     */
    renderAction(
      actionName: ActionKeyT<A, unknown>,
      data: unknown,
      config?: RenderConfig,
      clickHandler?: (e: CustomEvent) => void
    ): TemplateResult {
      return this.constructor.renderAction(actionName, this.host, data, config, clickHandler)
    }

    protected renderBulkAction(
      actionName: ActionKeyT<A, unknown>,
      data: unknown,
      _config: RenderConfig): TemplateResult {
      const action = this.actions[actionName]
      const actionHandler = this.actionHandler(actionName, data, true)
      const bulkConfig = action.bulk!

      // TODO: add tooltip once we have better tooltips (like vaadin, that do not slot action)
      return html`
      <md-filled-icon-button 
        data-toolbar="${actionName}"
        title=${bulkConfig.tooltip || action.label || ''}
        aria-haspopup="true" 
        aria-label=${action.bulk?.tooltip || action.label || ''} 
        .disabled=${action.bulk?.disabled?.(this.host.selectedItems!) || false}
        @click=${actionHandler}>
        <lapp-icon .icon=${bulkConfig.icon || action.icon!}></lapp-icon>
      </md-filled-icon-button>`
    }


    /**
     * Handles the action click event by delegating to the static `actionHandler` method of the constructor.
     *
     * @template A - The type of the action.
     * @param actionName - The name of the action to be performed.
     * @param data - The data associated with the action.
     * @returns A function that handles the click event on an HTML element of type `LappButton`.
     */
    actionHandler(
      actionName: ActionKeyT<A, unknown>,
      data: unknown,
      isBulk: boolean = false
    ) {
      return this.constructor.actionHandler(actionName, this.host, data, isBulk)
    }


    create(data: unknown) {
      const event = (this.actions.create as ActionEventI<unknown>)
        .getEvent(this.entityName, {
          data: this.processCreateData(data as RecursivePartial<DataI>) as CollectionI<DataI>
        }, this.host)
      this.host.dispatchEvent(event)
      return event
    }

    update(data: unknown, entityName?: string) {
      return this.host.dispatchEvent(new DataChanged({ entityName: entityName || this.entityName, data }))

    }

    close(id: string, entityName?: string) {
      return this.host.dispatchEvent(new Close({ entityName: entityName || this.entityName, id }))
    }
    open(id: string, entityName?: string) {
      return this.host.dispatchEvent(new Open({ entityName: entityName || this.entityName, id }))
    }
    markDirty(dirty: boolean = true, id: string) {
      return this.host.dispatchEvent(new Dirty({ entityName: this.entityName, dirty, id }))
    }
  }


  Object.assign(R, staticApply);
  return R as unknown as typeof superclass
    & StaticEntityActionI<A>
    & Constructor<RenderInterface<A>>
}

function isRenderConfig(config: RenderConfig | FunctionOrButtonConfigT<any>): config is RenderConfig {
  return (config as RenderConfig).entityStatus !== undefined
}

// interface I {
//   render: (data: any) => TemplateResult
// }

// class B implements I {
//   render(data: any): TemplateResult {
//     return html`<p>You are about to revoke access. Please confirm.</p>`;
//   }
// }