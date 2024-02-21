import lappMdEditor from './md-editor';

import { html, css, PropertyValues, nothing } from "lit";
import { customElement, property, query, state } from 'lit/decorators.js';
import droppableStyles from './droppable-styles';
import('@material/web/progress/linear-progress.js');
import('@material/web/button/outlined-button.js');
import '../../button/small-outlined-button'
import('@preignition/firebase-upload/document-upload')

type UploadStatusT = {
	status: 'start' | 'finish' | 'progress' | 'success' | 'error'
	file: File
	error?: string
}
const imageLoading = '{{loading image ...}}';

/**
 * A markdown editor that support drag and drop image upload.
 * 
 * We will need to review this component once we have migrated document-upload to lit: 
 * - only have one editor (merge md-droppable-editor and md-editor)
 * - put upload stuff either in a controller or a mixin
 */

export default class lappMdDroppableEditor extends lappMdEditor {

	static override styles = [
		...lappMdEditor.styles,
		droppableStyles,
		css`
			
			firebase-document-upload  {
        display: none;
      }

			md-linear-progress {
				position: absolute;
				left: 0;
				right: 0;
				z-index: 1;
			}


		`];

	@property() path!: string
	/**
	 * prevent drop when true
	 */
	@property({ type: Boolean, reflect: true }) nodrop: boolean = false;
	
	/**
	 * Specifies the types of files that the server accepts.
	 * Syntax: a comma-separated list of MIME type patterns (wildcards are
	 * allowed) or file extensions.
	 * Notice that MIME types are widely supported, while file extensions
	 * are only implemented in certain browsers, so avoid using it.
	 * Example: accept="video/*,image/tiff" or accept=".pdf,audio/mp3"
	 */
	@property() accept = 'image/*, video/*'
	/**
	 * Specifies the maximum file size in bytes allowed to upload.
	 * Notice that it is a client-side constraint, which will be checked before
	 * sending the request. Obviously you need to do the same validation in
	 * the server-side and be sure that they are aligned.
	 */
	@property({
		attribute: 'max-file-size',
		type: Number,
	}) maxFileSize: number = Infinity

	/*
	 * `dragoverValid` true when we drag-over and the drag is valid.
	 */
	@property({
		attribute: 'dragover-valid',
		reflect: true,
		type: Boolean
	}) dragoverValid!: boolean


	/*
	 * true to use firestore
	 */
	@property({ type: Boolean }) useFirestore!: boolean

	@state() _uploadStatus!: UploadStatusT
	@state() loading: boolean = false

	@query('firebase-document-upload') upload!: any;

	override render() {
		return html`
		 <firebase-document-upload 
        prevent-read
        .nodrop=${this.nodrop}
        .accept=${this.accept}
        .maxFileSize=${this.maxFileSize}
        .path=${this.path}
        .dropTarget=${this}
        .useFirestore=${this.useFirestore}
        @upload-start=${this.onUploadStart} 
        @upload-success=${this.onUploadSuccess} 
        @upload-error=${this.onUploadError} 
        @upload-progress=${this.onUploadProgress}  
        @upload-finished=${this.onUploadFinished}  
        @file-reject=${this.onFileReject}
      ></firebase-document-upload>
			
			${super.render()}
		`;
	}

	protected override renderEditor() {
		return html`
		${this.loading ? html `<md-linear-progress indeterminate aria-label="uploading image"></md-linear-progress> ` : nothing} 
		${super.renderEditor()}
		`
	}
	protected override renderSupportingAction() {
		const onclickUpload = (e) => {
			this.upload?._onAddFilesClick(e);
		}
		return html`&nbsp; | &nbsp;&nbsp; 
		<lapp-small-outlined-button style="margin-top: -2px; margin-bottom: 2px;" @click=${onclickUpload}><lapp-icon slot="icon"  icon="cloud_upload"></lapp-icon>Upload Image</lapp-small-outlined-button>
			`	
	}

	override firstUpdated(props: PropertyValues) {
		super.firstUpdated(props)
		this.addEventListener('paste', this.onPaste);

	}

	update(props: PropertyValues) {
		if (props.has('_uploadStatus')) {
			this.processStatus();
		}
		super.update(props);
	}

	private _setError(error?: string) {
		this._input.errorText = error || '';
		this._input.error = !!error;
	}

	processStatus() {
		const status = this._uploadStatus;
		if (status.status === 'start') {
			this._setError('');
			this.uploadingStarted();
		}
		if (status.status === 'finish') {
			this.uploadingFinished(status);
		}
		if (status.status === 'error') {
			this._setError(status.error || 'error');

			setTimeout(() => {
				this._setError('');
			}, 4000);
		}
	}

	// Note(cg): handle pasting image data 
	onPaste(e) {
		// We need to check if event.clipboardData is supported (Chrome & IE)
		if (e.clipboardData && e.clipboardData.items) {
			// Get the items from the clipboard
			const items = e.clipboardData.items;

			// Loop through all items, looking for any kind of image
			for (let i = 0; i < items.length; i++) {
				if (items[i].type.indexOf('image') !== -1) {
					// We need to represent the image as a file
					this.upload?._uploadFirebaseFile(items[i].getAsFile());
					// Prevent the image (or URL) from being pasted into the contenteditable element
					e.preventDefault();
				}
			}
		}
	}
	_isOnTextarea(e) {
		return e.composedPath()[0].localName === 'textarea';
	}

	canDrag(e) {
		return this._isOnTextarea(e);
	}

	canDrop(e) {
		return this._isOnTextarea(e);
	}

	uploadingStarted() {
		this.insertAtCaret(`\n${imageLoading}`);
		this.md = this._input.value;
	}

	formatURL(url) {
		return url;
	}

	uploadingFinished(status) {
		this.md = this.md.replace(imageLoading, `![${status.file.name.split('.')[0]}](${this.formatURL(status.file.url)})`);
		const inputEvent = new Event('input', { bubbles: true, composed: true });
		this._input.dispatchEvent(inputEvent);
	}

	onUploadError(e) {
		this.loading = false;
		this._uploadStatus = {
			status: 'error',
			file: e.detail.file,
			error: e.detail.file.error
		};
	}
	onUploadSuccess(e) {
		this.loading = false;
		this._uploadStatus = {
			status: 'success',
			file: e.detail.file
		};
	}

	onUploadFinished(e) {
		this.loading = false;
		this._uploadStatus = {
			status: 'finish',
			file: e.detail.file
		};
	}

	onUploadProgress(e) {
		this.loading = true;
		this._uploadStatus = {
			status: 'progress',
			file: e.detail.file
		};
	}

	onUploadStart(e) {
		this.loading = true;
		this._uploadStatus = {
			status: 'start',
			file: e.detail.file
		};
	}

	onFileReject(e) {
		this.loading = false;
		this._uploadStatus = {
			status: 'error',
			file: e.detail.file,
			error: e.detail.error
		};
	}

}

