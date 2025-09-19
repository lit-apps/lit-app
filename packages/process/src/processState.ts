import { type DocumentReference, doc } from 'firebase/firestore';
import { State, property } from '@lit-app/state';
import { FirestoreDocumentController } from '@preignition/lit-firebase';
// import { LitElement } from 'lit';
import { ReactiveElement } from 'lit';
export type Status = 'pending' | 'success' | 'error';
export type ProcessData = {
	status: Status;
	message: string; // current message
	error?: string; // the error message if any
	progress: number; // 0 - 100
};

/**
 * A state class for monitoring user processes from the client-side.
 */
export class ProcessState extends State {

	@property({ value: undefined }) data: ProcessData | undefined;

	get message() {
		return this.data?.message ?? '';
	}
	get error() {
		return this.data?.error ?? '';
	}
	get progress() {
		return this.data?.progress ?? 0;
	}
	get status() {
		return this.data?.status ?? 'pending';
	}

	get processCompleted() {
		return this._processCompletedPromise;
	}

	// private controller: FirestoreDocumentController<ProcessData> ;
	private init = false
	private _previousData: ProcessData | undefined;

	private _processCompleted: (value: boolean) => void = () => { };
	private _processCompletedPromise: Promise<boolean>;

	constructor(ref: DocumentReference, actionName?: string) {
		super();
		this._processCompletedPromise = new Promise<boolean>((resolve) => {
			this._processCompleted = resolve;
		});
		ref = actionName ? doc(ref, `internals/process_${actionName}`) : ref;
		const controller = new FirestoreDocumentController<ProcessData>(
			this as unknown as ReactiveElement, 
			ref, 
			undefined, 
			(controller) => {
				const data = controller.data;
				if (data && !this.init) {
					this.init = true;
				}
				if (!data && this.init) {
					this._processCompleted(true);
				}
				this._previousData = this.data;
				this.data = data;
				this.dispatchChange();
			});
		controller.subscribe();
	}
	
	dispatchChange() {
		if (this.message !== this._previousData?.message) {
			this.dispatchEvent(new CustomEvent('ProcessMessageChanged', {
				detail: this.message
			}));
		}
		if (this.error !== this._previousData?.error) {
			this.dispatchEvent(new CustomEvent('ProcessErrorChanged', {
				detail: this.error
			}));
		}
		if (this.progress !== this._previousData?.progress) {
			this.dispatchEvent(new CustomEvent('ProcessProgressChanged', {
				detail: this.progress
			}));
		}
		if (this.status !== this._previousData?.status) {
			this.dispatchEvent(new CustomEvent('ProcessStatusChanged', {
				detail: this.status
			}));
		}
	}

}
