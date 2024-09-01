export interface AppDialogDownloadDetail {
	promise?: Promise<any>
}

/**
 * This event is fired when a dialog request data to be downloaded 
 */
export default class AppDataDownloadEvent extends CustomEvent<AppDialogDownloadDetail> {
	static readonly eventName = 'app-data-download';
	constructor(detail: AppDialogDownloadDetail = {}) {
		super(AppDataDownloadEvent.eventName, {
			bubbles: true,
			composed: true,
			detail: detail
		});
	}
}

declare global {
	interface HTMLElementEventMap {
		'app-data-download': AppDataDownloadEvent,
	}
}