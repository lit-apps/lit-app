import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { customElement } from 'lit/decorators.js';
import {literal} from 'lit/static-html.js';
import { html } from 'lit';
import fixture, {fixtureCleanup} from '@lit-app/testing/fixture';
import { Star } from './star';

@customElement('lapp-test-star')
class TestStar extends Star {
	protected override readonly fieldTag = literal`lapp-filled-field`;
 
 }

declare global {
	interface HTMLElementTagNameMap {
		'lapp-test-star': TestStar;
	}
}

afterEach(fixtureCleanup);
describe('star', () => {

	async function setupTest(
		template = html`<lapp-test-star></lapp-test-star>`
	) {
		const element = await fixture<TestStar>(template);
		if (!element) {
			throw new Error('Could not query rendered <lapp-test-star>.');
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

		it('initializes as an star field', async () => {
			const { element } = await setupTest();
			expect(element).toBeInstanceOf(Star);
		});

		it('should render label and supporting text', async () => {
			const template = html`<lapp-test-star label="label" supporting-text="supportText"></lapp-test-star>`;
			const { element, list, support} = await setupTest(template);
			
			expect(element.label).toEqual('label');
			expect(list.getAttribute('aria-label')).toEqual('label');
			expect(list.getAttribute('aria-describedby')).toEqual('description');
			expect(support.textContent).toContain('supportText');
		})

		it('should render and interact with stars', async () => {
			const template = html`<lapp-test-star ></lapp-test-star>`;
			const { element, list } = await setupTest(template);

			expect(element.items.length).toEqual(5);

			element.items[2].click();
			await element.updateComplete;
			expect(element.selected).toEqual('3');

		})
	})
})