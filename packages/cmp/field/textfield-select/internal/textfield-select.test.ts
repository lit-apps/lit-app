import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { customElement } from 'lit/decorators.js';
import {literal} from 'lit/static-html.js';
import { html } from 'lit';
import fixture, {fixtureCleanup} from '@lit-app/testing/fixture';
import { TextfieldSelect } from './textfield-select';

const options: Option[] = [
	{code: '1', label: 'one', supportingText: 'hello'}, 
	{code: '2', label: 'two'}, 
	{code: '3', label: 'three'}
] 


@customElement('lapp-test-textfield-select')
class TestTextfieldSelect extends TextfieldSelect {
	protected override readonly fieldTag = literal`lapp-filled-field`;
 
 }

declare global {
	interface HTMLElementTagNameMap {
		'lapp-test-textfield-select': TestTextfieldSelect;
	}
}

afterEach(fixtureCleanup);
describe('textfield-select', () => {

	async function setupTest(
		template = html`<lapp-test-textfield-select></lapp-test-textfield-select>`
	) {
		const element = await fixture<TestTextfieldSelect>(template);
		if (!element) {
			throw new Error('Could not query rendered <lapp-test-textfield-select>.');
		}
	
		const list = element.input as HTMLInputElement

		return {
			element,
			list
		};
	}

	describe('basic', () => {

		it('initializes as an textfield-select field', async () => {
			const { element } = await setupTest();
			expect(element).toBeInstanceOf(TextfieldSelect);
			
		});
		

	})
})