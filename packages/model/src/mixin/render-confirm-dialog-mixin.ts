import { ToastEvent } from '@lit-app/event';
import type { MdDialog } from '@material/web/dialog/dialog';
import('@material/web/progress/linear-progress.js')
import('@material/web/dialog/dialog.js')
import('@material/web/button/outlined-button.js')
import('@material/web/button/filled-button.js')

import { LitElement, PropertyValues, html } from 'lit';
import { queryAsync, state } from 'lit/decorators.js';
import { AppAction, Create, Delete, EntityAction } from '../events';


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

		@state() private _activeEvent!: EntityAction | AppAction | Create | Delete   | undefined;
		@state() private _resolved: boolean = true;
		@queryAsync('#confirmDialog') _confirmDialog!: MdDialog;

		protected override firstUpdated(_changedProperties: PropertyValues) {
			super.firstUpdated(_changedProperties);

			const setAction = async (event: Delete | Create | EntityAction | AppAction  ) => {
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
		}

		override render() {

			// Base class need to also call super.render() in the render chain
			// to have this mixin render the dialog
			return [
				super.render(),
				this._renderConfirmDialog(this._activeEvent)
			]
		}

		private _renderConfirmDialog(event: EntityAction | AppAction | Create  | Delete  
			 | undefined) {
			if (!event) return
			const action = event.action

			const dispatchError = (e: Error) => {
				console.error(e)
				this.dispatchEvent(
					new ToastEvent(`There was an error while confirming : ${(e as Error).message}`, 'error')
				);
			}
			const processAction = async () => {
				if (!event) return
				this._resolved = false;
				if ((event as EntityAction).bulkAction) {
					const promises: (Promise<any> | undefined)[] = [];
					try {
						this.selectedItems.forEach(item => {
							const newEvent = Reflect.construct(
								event.constructor, 
								[event.detail, action, event.actionName]
							);
							newEvent.confirmed = true;
							newEvent.detail.id = item.$id
							newEvent.detail.data = null;
							this.dispatchEvent(newEvent);
							promises.push(event.detail.promise)
						})
						await Promise.all(promises)
					} catch (e) {
						dispatchError(e as Error)
					}
				} else {
					const newEvent = Reflect.construct(
						event.constructor, 
						[event.detail, action, event.actionName]
					);
					newEvent.confirmed = true;
					try {
						this.dispatchEvent(newEvent)
						const promise = await newEvent.detail.promise;
						// call action.onResolved if it exists. We need to do it here as 
						// onActionClick will not be called again. 
						if (action?.onResolved) {
							action?.onResolved(promise, this, newEvent)
						} 
					} catch (e) {
						dispatchError(e as Error)
					}
				}
				this._resolved = true;
				(await this._confirmDialog)?.close()
			}

			const onClose = () => {
				this._activeEvent = undefined;
				this._resolved = true;
			}

			const data = (event as EntityAction).detail.data || this.data;

			return html`

				<md-dialog 
					id="confirmDialog" 
					@close=${onClose}>
					<div slot="headline">${action?.confirmDialog?.heading || 'Please Confirm'}</div>
						<form slot="content" method="dialog" id="form-confirm">
						${(event as EntityAction).bulkAction ?
								action?.bulk?.render.call(this, this.selectedItems, data) :
								action?.confirmDialog?.render.call(this, data)}
						<md-linear-progress style="margin-top: var(--space-medium);" .indeterminate=${!this._resolved}></md-linear-progress>
					</form>
					<div slot="actions">
          <md-outlined-button
            form="form-confirm"
            value="close">Cancel</md-outlined-button>
					<md-filled-button
						.disabled=${action?.confirmDialog?.confirmDisabled?.call(this, data) || !this._resolved}
            @click=${processAction}>${action?.confirmDialog?.confirmLabel || 'Confirm'}</md-filled-button>
					</div>
				</md-dialog>
				`

		}
	};
	// Cast return type to your mixin's interface intersected with the superClass type
	return ConfirmDialogMixinClass as unknown as Constructor<ConfirmDialogMixinInterface> & T;
}

export default ConfirmDialogMixin;

