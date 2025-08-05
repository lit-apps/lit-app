import getInnerText from '@lit-app/shared/getInnerText.js';
import { HTMLEvent } from '@lit-app/shared/types';
import translate from '@preignition/preignition-util/translate-mixin.js';
import type { PropertyValues, TemplateResult } from 'lit';
import { html, LitElement, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../../list/list';
import '../../list/list-item';
import type { LappListItem } from '../../list/list-item';
import { Generic, GenericI } from '../generic/generic';
import { Checkbox } from './checkbox/internal/checkbox';
import './list';
import { AriaList, Option, OptionLabelT } from './types';

// const NAVIGABLE_KEY_SET = new Set<string>(Object.values(NavigableKeys));
// const isNavigableKey = (key: string) => NAVIGABLE_KEY_SET.has(key);

// @ts-expect-error - not types
import locale from './readaloud-locale.mjs';

/**
 * Generic Base abstract class for all choice fields
 * 
 * [ ] add support for `helper` and `helperPersistent` properties
 * [x] add Localization
 * [ ] add optionIllustration support (incl. css)
 * [x] make sure readaloud works
 * [ ] make sure validation works (previously relying on validityTransform)
 * [x] make sure `required` works
 * [x] make sure `disabled` works
 * [x] make sure otherSpecify works
 * [x] make sure exclusive works
 * [x] verify one line per option works
 * [x] verify settings values
 */
export abstract class Choice extends translate(Generic, locale, 'readaloud') {

	/** 
	 * true to allow multiple selection
	 */
	protected abstract readonly isMulti: boolean;

	protected abstract readonly choiceInputSelector: string;
	protected abstract readonly listRole: AriaList;
	protected abstract selected: string | string[];
	protected static isCodeSelected: (value: string | string[], code: string) => boolean;
	protected abstract renderChoiceOptions(options: Option[]): TemplateResult;
	protected _value!: string | string[]

	@query('#list') override readonly input!: HTMLInputElement;
	@query('#list') override readonly inputOrTextarea!: HTMLInputElement;

	/**
	 * when true, show each option on their own line
	 * @deprecated use `inline` instead
	 */
	@property({ type: Boolean, reflect: true })
	dense!: boolean;

	@property({ type: Boolean, reflect: true })
	inline: boolean = false;

	/**
	 * The options to render
	 */
	@property({ attribute: false }) options!: Option[]


	/**
	 * true to auto validate on change
	 */
	@property({ type: Boolean }) autoValidate = false

	/**
	 * `name` name for the input element
	 */
	// @property({ reflect: true }) override name!: string;

	/**
	 * The tabindex of the underlying list.
	 */
	@property({ type: Number }) listTabIndex = -1;

	/**
	 * A filter function to filter out options
	 * 
	 */
	@property({ attribute: false }) filter: (option: Option) => boolean = () => true;

	get items() {
		return [...this._queryItems('[md-list-item]')] as LappListItem[];
	}

	get _selectedItems() {
		return [...this._queryItems(this.choiceInputSelector) as NodeListOf<HTMLInputElement>]
			.filter(item => item.checked);
	}

	get _selectedValues() {
		return this?._selectedItems.map(item => item.value);
	}

	getOptionEl(itemElement: Element): HTMLInputElement {
		return itemElement.querySelector(this.choiceInputSelector) as HTMLInputElement
	}
	protected _queryItems(selector: string) {
		return this.renderRoot?.querySelectorAll(selector) ?? []
	}

	/** overriding checkValidity is needed to avoid validity to be out of sync with value */
	// override checkValidity() {
	// 	this.inputOrTextarea.value = this.selected;
	// 	this.inputOrTextarea.checkValidity();
	// 	return super.checkValidity();
	// }

	constructor() {
		super();
		// handle focus events
		this.addEventListener('focusin', () => this.field.focused = true);
		this.addEventListener('focusout', () => this.field.focused = false);
	}

	override willUpdate(props: PropertyValues<this>) {
		if (props.has('options')) {
			for (const option of this.options) {
				option.innerTextLabel = getInnerText((option as OptionLabelT).label);
			}
		}
		// TODO : remove this when inline is deprecated
		if (props.has('dense')) {
			console.warn('dense is deprecated, use inline instead');
			this.inline = this.dense;
		}
		super.willUpdate(props);
	}

	override renderInputOrTextarea() {

		// we add an input field so that SR can announce 
		// the status of the field
		// <input
		// id="input"
		// style="width: 0px; height: 0px; padding: 0px;"
		// .required=${this.required}
		// value=${String(this.selected)} 
		// aria-describedby="description"
		// aria-invalid=${(this as unknown as GenericI).hasError}
		// aria-label=${this.ariaLabel || this.label || nothing}
		// aria-required=${ifDefined(this.required ? 'true' : undefined)}/>
		return html`
		<ul-choice
			id="list"
			.required=${this.required}
			.value=${this.selected} 
			role=${this.listRole}
			tabindex=${this.listTabIndex}
			aria-describedby="description"
			aria-invalid=${(this as unknown as GenericI).hasError}
			aria-label=${this.ariaLabel || this.label || nothing}
			aria-required=${ifDefined(this.required ? 'true' : undefined)}
			aria-multiselectable=${ifDefined(this.isMulti ? 'true' : undefined)}
			@click=${(e: Event) => e.stopPropagation()}
			@keydown=${this.handleKeydown}
			>
			${this.renderChoiceOptions((this.options || []).filter(this.filter))}
			<slot></slot>
		</ul-choice>
		`
	}

	/**
	 * 
	 * @param event render empty option - when not options	are available or all
	 * have been filtered out
	 */
	protected renderEmptyOption(): TemplateResult {
		return html`<md-list-item 
			disabled >
			<div slot="headline">${this.tr('noOptions')}</div>
			</md-list-item>`
	}

	protected handleKeydown(_event: KeyboardEvent) {

		// do nothing by default
		// console.info('handleKeydown', event.key)
		// const key = event.key;
		// if (isNavigableKey(key)) {
		// 		event.stopPropagation();
		// }

		return
	}

	// we need to override updated in order to avoid infinite loop on value setter
	// this is because there is a check this.value !== value which will always reschedule an update
	protected override updated(_changedProperties: PropertyValues) {

	}

	syncSelected(value: string[] | string) {
		// do Nothing
		return value
	}
	/**	
	 * React to a change event coming from the list
	 * we call this method from list item directly as
	 * change event is not composable
	 */
	async onChange(e?: HTMLEvent<LitElement>) {
		if (this.readOnly) { return }
		await this.updateComplete;
		if (e?.target) {
			await e.target.updateComplete;
		}
		const value = this.syncSelected(this.selected)
		this.dispatchEvent(new CustomEvent('selected-changed', { detail: { value: value } }));
		// we also re-dispatch an input event 
		this._value = value; // Note(cg): get _value from the actual selection (dom query).
		this.dispatchEvent(new Event('input'));
		this.requestUpdate();
		return
	}

	static swap(values: string[], index: number, targetIndex: number) {
		const temp = values[index];
		values[index] = values[targetIndex];
		values[targetIndex] = temp;
		return values
	}

	getReadAloud(readHelper?: boolean) {
		const getOptionText = (item: HTMLElement) => {
			return item.ariaLabel || ''
		};
		let label = this.getTextLabel();
		if (label.endsWith('*')) {
			label = label.slice(0, -1);
			label += this.getTranslate('required');
		}
		return this._selectedItems.length ?
			`${[...this._selectedItems].map(getOptionText)} ${this.getTranslate('isTheAnswerTo')} ${label} ` :
			(label + ' ' + (readHelper && this.supportingText ? ('. ' + this.getTranslate('hint') + ': ' + this.supportingText) + '.' : '') + this.getReadAloudOptions());
	}

	private getReadAloudOptions() {
		const items = this._queryItems(this.choiceInputSelector) as NodeListOf<Checkbox>;
		// if (!readHelper && items.length > 5) {
		//   return this.getTranslate('countOptions', {count: items.length + 1});
		// }
		const options = [...items].map((item, index) => `${this.getTranslate('option')} ${index + 1}: ${item.ariaLabel}.`);
		return this.isMulti ?
			(`${this.getTranslate('chooseOption')}: ${options}`) :
			(`${this.getTranslate('chooseOptions')}: ${options}`);
	}


}
