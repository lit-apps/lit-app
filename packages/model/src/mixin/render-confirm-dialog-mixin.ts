import { ToastEvent } from '@lit-app/shared/event';
import type { MdDialog } from '@material/web/dialog/dialog';
import('@material/web/progress/linear-progress.js')
import('@material/web/dialog/dialog.js')
import('@material/web/button/outlined-button.js')
import('@material/web/button/filled-button.js')

import type { MixinBase, MixinReturn } from '@lit-app/shared/types.js';
import { LitElement, PropertyValues, html, nothing } from 'lit';
import { queryAsync, state } from 'lit/decorators.js';
import { AppAction, Create, Delete, EntityAction, isEntityAction } from '../events';



export declare class ConfirmDialogMixinInterface {
	// Define the interface for the mixin
	_activeEvent: EntityAction | AppAction | Create | Delete | undefined
}
/**
 * ConfirmDialogMixin 
 * A mixin rendering a confirm dialog for actions. 
 * 
 * selectedItem is a property of the main class. It is an array of selected items and is not part of event detail.
 * TODO: 
 * - add support for bulk actions 
 * - remove deprecated old bulk actions dialog 
 */
export const ConfirmDialogMixin = <T extends MixinBase<LitElement & { selectedItems?: any[] }>>(
	superClass: T
): MixinReturn<T, ConfirmDialogMixinInterface> => {

	abstract class ConfirmDialogMixinClass extends superClass {

		data: any
		// selectedItems!: any[]

		@state() _activeEvent!: EntityAction | AppAction | Create | Delete | undefined;
		@state() private _resolved: boolean = true;
		@queryAsync('#confirmDialog') _confirmDialog!: MdDialog;

		protected override firstUpdated(_changedProperties: PropertyValues) {
			super.firstUpdated(_changedProperties);

			const setAction = async (event: Delete | Create | EntityAction | AppAction) => {
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

		private _renderConfirmDialog(event: EntityAction | AppAction | Create | Delete
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
				if (isEntityAction(event) && event.bulkAction) {
					const promises: (Promise<any> | undefined)[] = [];
					try {
						/** 
						 * Redispatch the bulk event for each selected item
						 * TODO: review if this is necessary, we could just dispatch the event once
						 */
						this.selectedItems?.forEach(item => {
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
						[event.detail, action, (event as EntityAction).actionName]
					);
					newEvent.confirmed = true;
					// we assign id to the new event if it is not already set, this is useful for email messages in grid
					// if (!newEvent.detail.id && event.detail.data.id) {
					// 	newEvent.detail.id = event.detail.data.id
					// }
					try {
						this.dispatchEvent(newEvent)
						await newEvent.detail.promise;
						// call action.afterResolved if it exists. We need to do it here as 
						// onActionClick will not be called again. 
						if (action?.afterResolved) {
							action?.afterResolved(newEvent, this)
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

			const dialogConfig = {
				...{
					heading: 'Please Confirm',
					confirmLabel: 'Confirm',
					confirmDisabled: (_data: any) => !this._resolved,
					render: (_data: any) => html`<p>Are you sure you want to proceed?</p>`
				},
				...action?.confirmDialog,
				...((event as EntityAction).bulkAction ? action?.bulk : {})
			};
			const { confirmLabel, confirmIcon } = dialogConfig;

			return html`

				<md-dialog 
					id="confirmDialog" 
					@close=${onClose}>
					<div slot="headline">${dialogConfig.heading}</div>
						<form slot="content" method="dialog" id="form-confirm" novalidate="">
							${dialogConfig.render.call(this, { data, selectedItems: this.selectedItems! })}
						<md-linear-progress 
							style="margin-top: var(--space-medium);" 
							.indeterminate=${!this._resolved}></md-linear-progress>
					</form>
					<div slot="actions">
          <md-outlined-button
            form="form-confirm"
            value="close">Cancel</md-outlined-button>
					<md-filled-button
						.disabled=${dialogConfig.confirmDisabled?.call(this, data)}
            @click=${processAction}>${confirmIcon ? html`<lapp-icon slot="icon">${confirmIcon}</lapp-icon>` : nothing}${confirmLabel}</md-filled-button>
					</div>
				</md-dialog>
				`

		}
	};
	// Cast return type to your mixin's interface intersected with the superClass type
	return ConfirmDialogMixinClass;
}

export default ConfirmDialogMixin;

