import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { html } from 'lit';

import { Checkbox } from './checkbox';
import { literal } from 'lit/static-html.js';
import { customElement } from 'lit/decorators.js';
import { Option } from '../../types';

import fixture, {fixtureCleanup} from '@lit-app/testing/fixture';

// const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

@customElement('lapp-test-checkbox')
class TestCheckbox extends Checkbox {
	protected override readonly fieldTag = literal`lapp-filled-field`;
 
 }
  
declare global {
	interface HTMLElementTagNameMap {
		'lapp-test-checkbox': Checkbox;
	}
}

const options: Option[] = [
	{code: '1', label: 'one', supportingText: 'hello'}, 
	{code: '2', label: 'two'}, 
	{code: '3', label: 'three'}
] 

afterEach(fixtureCleanup);
describe('checkbox', () => {

	async function setupTest(
		template = html`<lapp-test-checkbox></lapp-test-checkbox>`
	) {
		const element = await fixture<TestCheckbox>(template); 
		if (!element) {
			throw new Error('Could not query rendered <md-test-checkbox>.');
		}

		const list = element.input as HTMLInputElement
		const support = element.renderRoot.querySelector('#description') as HTMLElement
		
		return {
			list, 
			support,
			element
		};
	}

	describe('checkbox', () => {

		it('initializes as an checkbox field', async () => {
			const { element } = await setupTest();
			expect( element).toBeInstanceOf(TestCheckbox);
			
		});

		it('should render label and supporting text', async () => {
			const template = html`<lapp-test-checkbox label="label" supporting-text="supportText"></lapp-test-checkbox>`;
			const { element, list, support } = await setupTest(template);
			
			expect(element.label).toEqual('label');
			expect(list.getAttribute('aria-label')).toEqual('label');
			expect(list.getAttribute('aria-describedby')).toEqual('description');
			expect(support.textContent).toContain('supportText');
		})

		it('should render and interact with options', async () => {
			const template = html`<lapp-test-checkbox .options=${options}></lapp-test-checkbox>`;
			const { element, list } = await setupTest(template);
			expect(element.items.length).toEqual(options.length);
			expect(element.selected).toEqual([]);

			const item1 = element.items[0];
			const item2 = element.items[1];
			item1.click();
			await element.updateComplete;
			expect(element.selected).toEqual(['1']);
			item2.click();
			await element.updateComplete;
			expect(element.selected).toEqual(['1', '2']);
			
			// we need to wait a bit otherwise the click is not registered
			await element.updateComplete;
 
			item2.click();
			await element.updateComplete;
			expect(element.selected).toEqual(['1']);

			item1.click();
			await element.updateComplete;
			expect(element.selected).toEqual([]);
		})

		it('should set value via code', async () => {
			const template = html`<lapp-test-checkbox .options=${options}></lapp-test-checkbox>`;
			const { element } = await setupTest(template);

			const item = element.items[0];
			const check = element.getOptionEl(item)

			expect(check.checked).toEqual(false);

			element.selected = ['1'];
			await element.updateComplete;

			expect(check.checked).toEqual(true);
			
		})
		it('should validate', async () => {
			const template = html`<lapp-test-checkbox .options=${options}></lapp-test-checkbox>`;
			const templateRequired = html`<lapp-test-checkbox required .options=${options}></lapp-test-checkbox>`;
			const { element } = await setupTest(template);
			const elementRequired = (await setupTest(templateRequired)).element;

			expect(element.required).toEqual(false);
			expect(elementRequired.required).toEqual(true);

			element.dispatchEvent(new Event('blur'))
			elementRequired.dispatchEvent(new Event('blur'))
			await element.updateComplete;
			await elementRequired.updateComplete;
			
			// console.log('validity', element.validity) 
			expect(element.validity?.valid).toEqual(true);
			expect(elementRequired.validity?.valid).toEqual(false);
			
			elementRequired.selected = ['1'];
			await elementRequired.updateComplete;
			elementRequired.dispatchEvent(new Event('blur'))
			await elementRequired.updateComplete;
			expect(elementRequired.validity.valid).toEqual(true);
			
		})

		it('should handle customError', async () => {
			const template = html`<lapp-test-checkbox .options=${options}></lapp-test-checkbox>`;
			const { element } = await setupTest(template);
			const message = 'this will not work';
			element.setCustomValidity(message);
			element.dispatchEvent(new Event('blur'))
			await element.updateComplete;
			expect(element.validationMessage).toEqual(message)
			expect(element.validity.valid).toEqual(false);

			element.setCustomValidity('');
			element.dispatchEvent(new Event('blur'))
			await element.updateComplete;
			expect(element.validity.valid).toEqual(true);

		})

		it('reads aloud', async () => {
			const template = html`<lapp-test-checkbox .label=${'test'} .options=${options}></lapp-test-checkbox>`;
			const { element } = await setupTest(template);
			let readaloud 
			readaloud = element.getReadAloud();
			expect(readaloud).toEqual('test Choose one answer from the following options: option 1: one.,option 2: two.,option 3: three.');
			element.selected = ['1'];
			await element.updateComplete;
			readaloud = element.getReadAloud();
			expect(readaloud).toEqual('one is the answer to the question test ');
		})

		it('handles exclusive option', async () => {
			const options: Option[] = [
				{code: '1', label: 'one', exclusive: true}, 
				{code: '2', label: 'two'},  
				{code: '3', label: 'three'}
			] 
			
			const template = html`<lapp-test-checkbox .label=${'test'} .options=${options}></lapp-test-checkbox>`;
			const { element } = await setupTest(template);

			const item1 = element.items[0];
			const item2 = element.items[1];
			item2.click();
			await element.updateComplete;
			expect(element.selected).toEqual(['2']);
			
			item1.click();
			await element.updateComplete;
			expect(element.selected).toEqual(['1']);
			await element.updateComplete;
			// we need to wait a bit more - the first updateComplete is for focus, the second for the click
			await element.updateComplete; 
			expect(item2.disabled).toEqual(true);

		})

	})
})