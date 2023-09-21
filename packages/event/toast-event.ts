type ToastType = 'info' | 'error' | 'warn'
type ActionType = 'confirm-service-worker-update' | 'reload'

export interface AppToastDetail {
	text: string
	actionText?: string // text for action
	action?: ActionType
	stacked?: boolean
	promise?: Promise<boolean>
	timeoutMs?: number
	code?: string
	severity?: number
}



type ToastDetail = AppToastDetail | string;

/**
 * This event is fired to trigger the main application to display a toast
 */
export default class ToastEvent extends CustomEvent<AppToastDetail> {
	static readonly eventName = 'app-toast';
	constructor(detail: ToastDetail, public toastType: ToastType = 'info') {
		if (typeof detail === 'string') {
			detail = { text: detail };
		}
		super(ToastEvent.eventName, {
			bubbles: true,
			composed: true,
			detail: detail || {}
		});
	}
}

declare global {
	interface HTMLElementEventMap {
		'app-toast': ToastEvent,
	}
}