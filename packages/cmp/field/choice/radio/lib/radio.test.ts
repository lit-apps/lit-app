import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { customElement } from 'lit/decorators.js';
import {literal} from 'lit/static-html.js';
import { html } from 'lit';
import fixture, {fixtureCleanup} from '@lit-app/testing/fixture';
import { Radio } from './radio';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

@customElement('lapp-test-radio')
class TestRadio extends Radio {
	protected override readonly fieldTag = literal`lapp-filled-field`;
 
 }

declare global {
	interface HTMLElementTagNameMap {
		'lapp-test-radio': TestRadio;
	}
}
const options: Option[] = [
	{code: '1', label: 'one', supportingText: 'hello'}, 
	{code: '2', label: 'two'}, 
	{code: '3', label: 'three'}
] 

afterEach(fixtureCleanup);
describe('radio', () => {

	async function setupTest(
		template = html`<lapp-test-radio></lapp-test-radio>`
	) {
		const element = await fixture<TestRadio>(template);
		if (!element) {
			throw new Error('Could not query rendered <lapp-test-radio>.');
		}
		const list = element.input as HTMLInputElement
		const support = element.renderRoot.querySelector('#description') as HTMLElement
		
	
		return {
			element,
			list,
			support

		};
	}

	describe('basic', () => {

		it('initializes as an radio field', async () => {
			const { element } = await setupTest();
			expect(element).toBeInstanceOf(Radio);
		
		});

		it('should render label and supporting text', async () => {
			const template = html`<lapp-test-radio label="label" supporting-text="supportText"></lapp-test-radio>`;
			const { element, list, support} = await setupTest(template);
			
			expect(element.label).toEqual('label');
			expect(list.getAttribute('aria-label')).toEqual('label');
			expect(list.getAttribute('aria-describedby')).toEqual('description');
			expect(support.textContent).toContain('supportText');
		})

		it('should render and interact with options', async () => {
			const template = html`<lapp-test-radio .options=${options}></lapp-test-radio>`;
			const { element, list } = await setupTest(template);
			element.name = 'test'
			expect(element.items.length).toEqual(options.length);
			expect(element.selected).toEqual('');

			const item1 = element.items[0];
			const item2 = element.items[1];
			item1.click();
			await element.updateComplete;
			expect(element.selected).toEqual('1');

			item1.click();
			await element.updateComplete;
			expect(element.selected).toEqual('1');
			await element.updateComplete;

			item2.click();
			await element.updateComplete;
			expect(element.selected).toEqual('2');
		})

		it('should set value via code', async () => {
			const template = html`<lapp-test-radio .options=${options}></lapp-test-radio>`;
			const { element } = await setupTest(template);
			element.name = 'test'

			const item = element.items[0];
			const check = element.getOptionEl(item)

			expect(check.checked).toEqual(false);

			element.selected = '1';
			await element.updateComplete;

			expect(check.checked).toEqual(true);
			
		})
	})
})