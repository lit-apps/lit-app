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
// @ts-ignore
import locale  from './readaloud-locale.mjs';

const ACTIONABLE_KEYS = {
	Space: ' ',
	Enter: 'Enter',
} as const;

const NAVIGATION_KEYS = {
	ArrowLeft: 'ArrowLeft',
	ArrowRight: 'ArrowRight',
	End: 'End',
	Home: 'Home',
	// ArrowUp: 'ArrowUp',
	// ArrowDown: 'ArrowDown',
} as const;

type ActionableValues = typeof ACTIONABLE_KEYS[keyof typeof ACTIONABLE_KEYS];
const actionableKeySet = new Set(Object.values(ACTIONABLE_KEYS));

function isActionableKey(key: string): key is ActionableValues {
	return actionableKeySet.has(key as ActionableValues);
}

type NavigableValues = typeof NAVIGATION_KEYS[keyof typeof NAVIGATION_KEYS];
const navigableKeySet = new Set(Object.values(NAVIGATION_KEYS));

function isNavigableKey(key: string): key is NavigableValues {
	return navigableKeySet.has(key as NavigableValues);
}

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

	override renderInputOrTextarea(): TemplateResult {
		
		// we add an input field so that SR can announce 
		// the status of the field

		return html`
		<input
			style="width: 0px; height: 0px; padding: 0px;"
			.required=${this.required}
			value=${String(this.selected)} 
			aria-describedby="description"
			aria-invalid=${(this as unknown as GenericI).hasError}
			aria-label=${this.ariaLabel || this.label || nothing}
			aria-required=${ifDefined(this.required ? 'true' : undefined)}/>
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
		return html`<md-list-item disabled .headline=${this.tr('noOptions')}></md-list-item>`
	}

	protected handleKeydown(event: KeyboardEvent) {
		const key = event.key;
		if (isActionableKey(key)) {
			this.handleActionableKeydown(event);
		}

		// prevent left and right arrow to lose focus
		if (isNavigableKey(key)) {
			event.preventDefault();
			event.stopImmediatePropagation();
		}

		// return MdList.prototype.handleKeydown.call(this, event);
		return MdList.prototype.handleKeydown.call(this, event);
	}

	protected handleActionableKeydown(event: KeyboardEvent) {
		event.preventDefault();
		const target = event.target as HTMLElement;
		target.click();
	}


	/**	
	 * React to a change event coming from the list
	 * we call this method from list item directly as
	 * change event is not composable
	 */
	async onChange(e?: HTMLEvent<LitElement>) {
		// console.info('onChange', this)
		await this.updateComplete;
		if (e?.target) {
			await e.target.updateComplete;
		}
		const value = this.selected
		this.dispatchEvent(new CustomEvent('selected-changed', { detail: { value: value } }));
		this._value = value; // Note(cg): get _value from the actual selection (dom query).
		if (this.autoValidate) {
			this.reportValidity()
		}
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
