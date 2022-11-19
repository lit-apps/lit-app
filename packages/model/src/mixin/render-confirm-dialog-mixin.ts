import { LitElement, PropertyValues, html } from 'lit';
import { state, queryAsync } from 'lit/decorators.js'
import { until } from 'lit/directives/until.js';
import { EntityAction, AppAction, Create, Delete, MarkDeleted } from '../events';
import { Dialog } from '@material/mwc-dialog'
import '@material/mwc-linear-progress'
import { ToastErrorEvent } from '@preignition/preignition-util'
import '@material/mwc-button'
import { ActionController } from '@material/web/controller/action-controller';


type Constructor<T = {}> = new (...args: any[]) => T;
export declare class ConfirmDialogMixinInterface {
	// Define the interface for the mixin
	_activeEvent: EntityAction | AppAction | undefined
}
/**
 * ConfirmDialogMixin 
 * A mixin rendering a confirm dialog for actions. 
 * TODO: 
 * - add support for bulk actions 
 * - remove deprecated old bulk actions dialog 
 */
export const ConfirmDialogMixin = <T extends Constructor<LitElement>>(superClass: T) => {

	class ConfirmDialogMixinClass extends superClass {

		data: any
		selectedItems!: any[]

		@state() private _activeEvent!: EntityAction | AppAction | Create | Delete | MarkDeleted | undefined;
		@state() private _resolved: boolean = true;
		@queryAsync('#confirmDialog') _confirmDialog!: Dialog;

		protected override firstUpdated(_changedProperties: PropertyValues) {
			super.firstUpdated(_changedProperties);

			const setAction = async (event: Delete | MarkDeleted | Create | EntityAction | AppAction) => {
				// stop propagation if action is not confirmed and we have a templateDialog
				if (event.shouldConfirm) {
					event.stopPropagation();
					this._activeEvent = event;
					(await this._confirmDialog).show();
					return
				}
			}
			this.addEventListener(EntityAction.eventName, setAction);
			this.addEventListener(AppAction.eventName, setAction);
			this.addEventListener(Create.eventName, setAction);
			this.addEventListener(Delete.eventName, setAction);
			this.addEventListener(MarkDeleted.eventName, setAction);
		}

		override render() {

			// Base class need to also call super.render() in the render chain
			// to have this mixin render the dialog
			return [
				super.render(),
				this._renderConfirmDialog(this._activeEvent)
			]
		}

		private _renderConfirmDialog(event: EntityAction | AppAction | Create  | Delete | MarkDeleted | undefined) {
			if (!event) return
			const action = event.action

			const dispatchError = (e: Error) => {
				console.error(e)
				this.dispatchEvent(
					new ToastErrorEvent(`There was an error while confirming : ${(e as Error).message}`)
				);
			}
			const processAction = async () => {
				if (!event) return
				this._resolved = false;
				if ((event as EntityAction).bulkAction) {
					const promises: (Promise<any> | undefined)[] = [];
					try {
						this.selectedItems.forEach(item => {
							const newEvent = Reflect.construct(event.constructor, [event.detail, action, event.actionName])
							newEvent.confirmed = true;
							newEvent.detail.id = item.$id
							this.dispatchEvent(newEvent);
							promises.push(event.detail.promise)
						})
						await Promise.all(promises)
					} catch (e) {
						dispatchError(e as Error)
					}
				} else {
					const newEvent = Reflect.construct(event.constructor, [event.detail, action, event.actionName])
					newEvent.confirmed = true;
					try {
						this.dispatchEvent(newEvent)
						await newEvent.detail.promise;
					} catch (e) {
						dispatchError(e as Error)
					}
				}
				this._resolved = true;
				(await this._confirmDialog).close()
			}

			const onClosed = () => {
				this._activeEvent = undefined;
				this._resolved = true;
			}

			return html`

				<mwc-dialog 
					id="confirmDialog" 
					.heading=${action.confirmDialog?.heading || 'Please Confirm'}
					@closed=${onClosed}>
				
					${(event as EntityAction).bulkAction ?
							action.bulk?.render.call(this, this.selectedItems, event.detail.data || this.data) :
							action.confirmDialog?.render.call(this, event.detail.data || this.data)}
					<mwc-linear-progress style="margin-top: var(--space-medium);" .indeterminate=${!this._resolved}></mwc-linear-progress>
          <mwc-button
            slot="secondaryAction"
            outlined
						.label=${'Cancel'}
            dialogAction="close"></mwc-button>
					<mwc-button
            slot="primaryAction"
            unelevated
						.label=${action.confirmDialog?.confirmLabel || 'Confirm'}
						.disabled=${action.confirmDialog?.confirmDisabled?.call(this, event.detail.data) || !this._resolved}
            @click=${processAction}></mwc-button>
				</mwc-dialog>
				`

		}
	};
	// Cast return type to your mixin's interface intersected with the superClass type
	return ConfirmDialogMixinClass as unknown as Constructor<ConfirmDialogMixinInterface> & T;
}

export default ConfirmDialogMixin;

