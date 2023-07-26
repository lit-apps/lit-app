import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { customElement } from 'lit/decorators.js';
import {literal} from 'lit/static-html.js';
import { html } from 'lit';
import fixture, {fixtureCleanup} from '@lit-app/testing/fixture';
import { Select } from './select';

@customElement('lapp-test-select')
class TestSelect extends Select {
	protected override readonly fieldTag = literal`lapp-filled-field`;
 
 }

declare global {
	interface HTMLElementTagNameMap {
		'lapp-test-select': TestSelect;
	}
}

afterEach(fixtureCleanup);
describe('select', () => {

	async function setupTest(
		template = html`<lapp-test-select></lapp-test-select>`
	) {
		const element = await fixture<TestSelect>(template);
		if (!element) {
			throw new Error('Could not query rendered <lapp-test-select>.');
		}
		
		return {
			element,
		};
	}

	describe('basic', () => {

		it('initializes as an select field', async () => {
			const { element } = await setupTest();
			expect(element).toBeInstanceOf(Select);
		
		});

		
	})
})