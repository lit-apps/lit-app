import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { customElement } from 'lit/decorators.js';
import {literal} from 'lit/static-html.js';
import { html } from 'lit';
import fixture, {fixtureCleanup} from '@lit-app/testing/fixture';
import { Checkbox } from './checkbox';
import { InputCheckbox } from './input-checkbox';

@customElement('test-checkbox')
class TestCheckbox extends Checkbox {
	protected override readonly fieldTag = literal`lapp-filled-field`;
 
 }

declare global {
	interface HTMLElementTagNameMap {
		'test-checkbox': TestCheckbox;
	}
}

afterEach(fixtureCleanup);
describe('checkbox', () => {

	async function setupTest(
		template = html`<test-checkbox></test-checkbox>`
	) {
		const element = await fixture<TestCheckbox>(template);
		if (!element) {
			throw new Error('Could not query rendered <test-checkbox>.');
		}
		const input  = element.input as HTMLInputElement;
		const internalInput = input.input as HTMLInputElement
		return {
			element,
			input, internalInput
		};
	}

	describe('basic', () => {

		it('initializes as an checkbox field', async () => {
			const { element } = await setupTest();
			expect(element).toBeInstanceOf(Checkbox);
			
		});

		it('toggles the checked state when clicked', async () => {
			const { element, input, internalInput } = await setupTest();
			expect(input?.checked).to.be.false;
			expect(internalInput?.checked).to.be.false;
			input.click();
			await element.updateComplete;
			expect(input.checked).to.be.true;
			expect(internalInput?.checked).to.be.true;
			input.click();
			await element.updateComplete;
			expect(input.checked).to.be.false;
			expect(internalInput?.checked).to.be.false;
		});
	
	})
})