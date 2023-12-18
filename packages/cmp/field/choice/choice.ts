import { property, state, query, queryAssignedElements } from 'lit/decorators.js';
import { Generic } from '../generic/generic';
import { html, LitElement, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { AriaList, Option } from './types';
import { HTMLEvent } from '../../types';
import { GenericI } from '../generic/generic'
import { List as MdList } from '@material/web/list/internal/list'
import '../../list/list'
import '../../list/list-item'
import type { LappListItem } from '../../list/list-item';
import { Checkbox } from './checkbox/internal/checkbox';
import { ifDefined } from 'lit/directives/if-defined.js';
import './list'
import { when } from 'lit/directives/when.js';
import getInnerText from '@preignition/preignition-util/src/getInnerText.js';
import translate  from '@preignition/preignition-util/translate-mixin.js';
import {ListController, NavigableKeys} from '@material/web/list/internal/list-controller.js';
import {ListItem } from '@material/web/list/internal/list-navigation-helpers.js';

const NAVIGABLE_KEY_SET = new Set<string>(Object.values(NavigableKeys));
const isNavigableKey = (key: string) => NAVIGABLE_KEY_SET.has(key);

// @ts-ignore
import locale  from './readaloud-locale.mjs';

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
	 */
	@property({ type: Boolean, reflect: true })
	dense = false

	/**
	 * The options to render
	 */
	@property({ type: Array }) options!: Option[]

	/**
	 * true to auto validate on change
	 */
	@property({ type: Boolean }) autoValidate = false

	/**
	 * `name` name for the input element
	 */
	@property() override name!: string;

	/**
	 * The tabindex of the underlying list.
	 */
	@property({ type: Number }) listTabIndex = -1;
	
	/**
	 * A filter function to filter out options
	 * 
	 */
	@property({attribute: false }) filter: (option: Option) => boolean = () => true;

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
		this.addEventListener('focusin', () => this.field.focused = true );
		this.addEventListener('focusout', () =>	this.field.focused = false);
	}

	override renderInputOrTextarea(): TemplateResult {
		
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
			${when(this.dense, () => html`<md-list-item disabled style="display: flex; flex:1"></md-list-item>`)}			
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

	protected handleKeydown(event: KeyboardEvent) {

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
  protected override updated(changedProperties: PropertyValues) {
       
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
		await this.updateComplete;
		if (e?.target) {
			await e.target.updateComplete;
		}
		const value =	this.syncSelected(this.selected)
		this.dispatchEvent(new CustomEvent('selected-changed', { detail: { value: value } }));
		this._value = value; // Note(cg): get _value from the actual selection (dom query).
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

		return this._selectedItems.length ?
      `${[...this._selectedItems].map(getOptionText)} ${this.getTranslate('isTheAnswerTo')} ${getInnerText(this.label)} ` :
      (getInnerText(this.label) + ' ' + (readHelper && this.supportingText ? ('. ' + this.getTranslate('hint') + ': ' + this.supportingText) + '.' : '') + this.getReadAloudOptions());
  }

  private getReadAloudOptions() {
    const items = this._queryItems(this.choiceInputSelector) as NodeListOf<Checkbox>;
    // if (!readHelper && items.length > 5) {
    //   return this.getTranslate('countOptions', {count: items.length + 1});
    // }
    const options = [...items].map((item, index) => `${this.getTranslate('option')} ${index + 1}: ${item.ariaLabel}.`);
    return this.isMulti ?
      (`${this.getTranslate('chooseOptions')}: ${options}`) :
      (`${this.getTranslate('chooseOption')}: ${options}`);
  }


}
