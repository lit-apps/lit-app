import { html, css, LitElement, nothing } from "lit";
import { customElement, property, query, state } from 'lit/decorators.js';
import { cache } from 'lit/directives/cache.js';
import { choose } from 'lit/directives/choose.js';
import { classMap } from 'lit/directives/class-map.js';
import { ConsumeAccessibilityMixin } from '../../mixin/context-accessibility-mixin';
import { md } from '@preignition/preignition-styles';
import { parse } from '@lit-app/md-parser';
import { ResizeController } from '@lit-labs/observers/resize-controller.js'
import { MdFilledTextField } from '@material/web/textfield/filled-text-field';
import('@material/web/tabs/tabs.js');
import('@material/web/tabs/secondary-tab.js');
import('../text-field')


/**
 * A markdown editor that support translation and preview.
 */
export default class lappMdEditor extends ConsumeAccessibilityMixin(LitElement) {

	static override shadowRootOptions: ShadowRootInit = {
		...LitElement.shadowRootOptions,
		delegatesFocus: true,
	};

	static override styles = [md,
		css`
			:host {
				display: inline-flex;
				flex-direction: column;
			}
			md-tabs {
				width: fit-content;
				margin-left: 0px;
				margin-right: auto;
				
			}
			lapp-text-field {
				resize: vertical;
			}

			#container {
				min-height: 8rem;
				display: flex;
				position: relative;
				overflow: hidden;
			}
	
			#container > * {
				flex: 1;
			}


			#markdown {
				padding: 0px 16px;
				margin: 16px 0px 1px;
			}
	
			#markdown img {
				max-width: 100%;
				max-height: 100%;
				object-fit: contain;
			}

		`];

	/**
	 * markdown content to render
	 */
	@property() md!: string;

	/**
	 * translation for markdown content
	 */
	@property() mdtranslate!: string;

	@property({ type: Boolean }) translate = false;
	@property() translateIcon = 'translate';
	@property() writeLabel = 'Write';
	@property() previewLabel = 'Preview';
	@property() translateLabel = 'Translate';
	@property() translatePreviewLabel = 'Preview Translation';
	@property() helper = 'Write content here';
	@property() helperTranslate = 'Write your translation here';
	@property() placeholder = '';

	@property({ type: Number }) cols = 3;
	@property({ type: Number }) rows = 3;
	@property({ type: Boolean }) required!: boolean;
	@property({ type: Boolean }) disabled!: boolean;
	@property({ type: Boolean, attribute: 'readonly' }) readOnly!: boolean;
	@property({ type: Number, attribute: 'maxlength' }) maxLength!: number;
	@property({ type: Number, attribute: 'minlength' }) minLength!: number;

	@state() _selected = 0;

	@query('lapp-text-field') _input!: MdFilledTextField;
	@query('md-tabs') _tabs!: HTMLElement;

	override render() {
		const onChange = (e) => {
			this._selected = e.target.activeTabIndex
		}

		const translateTabs = html`
			<md-secondary-tab ><lapp-icon slot="icon" .icon=${this.translateIcon}></lapp-icon>${this.translateLabel}</md-secondary-tab>
			<md-secondary-tab>${this.translatePreviewLabel}</md-secondary-tab>
		`
		
		const editor = this.renderEditor()
		const viewer = html`<div id="markdown" class="markdown ${classMap(this.accessibilityClasses)}">${parse(this._selected === 1 ? this.md : this.mdtranslate)}</div>`

		// Note: we use cache to keep the heigh of the textarea when switching between tabs
		return html`
			<md-tabs .activeTabIndex=${this._selected} @change=${onChange}>
					<md-secondary-tab >${this.writeLabel}</md-secondary-tab>
					<md-secondary-tab >${this.previewLabel}</md-secondary-tab>
					${this.translate ? translateTabs : nothing}
      </md-tabs>
			<div id="container">
				${cache(choose(this._selected, [
			[0, () => editor],
			[2, () => editor]
		], () => viewer))}
			</div>
		`
	}

	protected renderEditor() {
		const value = this._selected === 0 ? this.md : this.mdtranslate
		const readonly = this._selected === 0 && this.translate ? true : this.readOnly;

		return html`<lapp-text-field 
			type="textarea"
			droppable
			?required=${this.required}
			?disabled=${this.disabled}
			?readonly=${readonly}
		
			.value=${value || ''} 
			.cols=${this.cols}
			.rows=${this.rows}
			.placeholder=${this.placeholder}
			.maxLength=${this.maxLength}
			.minLength=${this.minLength}
			.supportingText=${this.renderSupportingText()}
			@input=${this.onValueChanged}
			@resize=${this.onResize}
			>
		</lapp-text-field>`;
	}
	protected renderSupportingText() {
		return html`
		<div style="display:flex; flex: 1; align-items: center;">${this._selected === 2 ? this.helperTranslate : this.helper} <span style="flex:1;"></span><span><a rel="noopener" href="https://en.wikipedia.org/wiki/Markdown" target="_blank">Markdown</a> is supported. </span>${this.renderSupportingAction()}</div>
		`
	}
	protected renderSupportingAction() {
		return nothing;
	}

	override focus() {
		if (this._selected === 0 || this._selected === 2) {
			this._input.focus();
			return
		}
		this._tabs.focus();
	}

	private onResize(e) {
		console.info('resize', e.target.rows)
		this.rows = e.target.rows;
	}
	onValueChanged(e) {
		const value = e.target.value;
		if (this._selected === 0) {
			this.md = value;
			this.dispatchEvent(new CustomEvent('md-changed', { detail: { value: this.md }, bubbles: true, composed: true }));
		}
		if (this._selected === 2) {
			this.mdtranslate = value;
			this.dispatchEvent(new CustomEvent('mdtranslate-changed', { detail: { value: this.mdtranslate }, bubbles: true, composed: true }));
		}
	}

	insertAtCaret(text) {
		const txtarea = this._input.inputOrTextarea;
		const scrollPos = txtarea.scrollTop;
		let caretPos = txtarea.selectionStart;

		const front = (txtarea.value).substring(0, caretPos);
		const back = (txtarea.value).substring(txtarea.selectionEnd, txtarea.value.length);
		txtarea.value = front + text + back;
		caretPos = caretPos + text.length;
		txtarea.selectionStart = caretPos;
		txtarea.selectionEnd = caretPos;
		txtarea.focus();
		txtarea.scrollTop = scrollPos;
	}

}

