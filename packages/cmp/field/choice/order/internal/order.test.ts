import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import fixture, {fixtureCleanup} from '@lit-app/testing/fixture';
import { customElement } from 'lit/decorators.js';
import {literal} from 'lit/static-html.js';
import { html } from 'lit';
import { Order } from './order';
import { Option } from '../../types';

const wait = (ms: number) => new Promise(resolve => {setTimeout(() => resolve(null), ms)});

const options: Option[] = [
	{code: '1', label: 'one', supportingText: 'hello'}, 
	{code: '2', label: 'two'}, 
	{code: '3', label: 'three'}
] 


@customElement('lapp-test-order')
class TestOrder extends Order {
	protected override readonly fieldTag = literal`lapp-filled-field`;
 
 }

declare global {
	interface HTMLElementTagNameMap {
		'lapp-test-order': TestOrder;
	}
}

// afterEach(fixtureCleanup);
describe('order', () => {

	async function setupTest(
		template = html`<lapp-test-order></lapp-test-order>`
	) {
		const element = await fixture<TestOrder>(template);
		if (!element) {
			throw new Error('Could not query rendered <lapp-test-order>.');
		}

		const list = element.input as HTMLInputElement
		
		return {
			element,
			list
			
		};
	}

	describe('basic', () => {

		it('initializes as an order field', async () => {
			const { element } = await setupTest();
			expect(element).toBeInstanceOf(Order);
		});

		it('should render and interact with options', async () => {
			const template = html`<lapp-test-order .options=${options}></lapp-test-order>`;
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
	})

	it('should swap items when clicking the swap button', async () => {
		const template = html`<lapp-test-order .options=${options}></lapp-test-order>`;
		const { element } = await setupTest(template);
		const getCheckbox = item => item.querySelector('md-checkbox');
		let item1 = element.items[0];
		let item2 = element.items[1];
		item1.click();
		item2.click();
		expect(getCheckbox(item1).value).toEqual('1');
		expect(getCheckbox(item2).value).toEqual('2');
		// select and click on the swap button (need some delay for the button to appear)
		await wait(100); 
		const button = item1.querySelector('md-outlined-icon-button')
		button?.click()
		await element.updateComplete;
		// we need to wait until the end of the animation
		await wait(300); 
		item1 = element.items[0];
		item2 = element.items[1];
		expect(getCheckbox(item1).value).toEqual('2');
		expect(getCheckbox(item2).value).toEqual('1');



	})
})