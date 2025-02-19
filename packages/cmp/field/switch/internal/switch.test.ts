import fixture, { fixtureCleanup } from '@lit-app/testing/fixture';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { literal } from 'lit/static-html.js';
import { afterEach, describe, expect, it } from 'vitest';
import { Switch } from './switch';

@customElement('test-switch')
class TestSwitch extends Switch {
	protected override readonly fieldTag = literal`lapp-filled-field`;

}

declare global {
	interface HTMLElementTagNameMap {
		'test-switch': TestSwitch;
	}
}

afterEach(fixtureCleanup);
describe('switch', () => {

	async function setupTest(
		template = html`<test-switch></test-switch>`
	) {
		const element = await fixture<TestSwitch>(template);
		if (!element) {
			throw new Error('Could not query rendered <test-switch>.');
		}
		const input = element.input as HTMLInputElement;
		const internalInput = input.input as HTMLInputElement
		return {
			element,
			input, internalInput
		};
	}

	describe('basic', () => {

		it('initializes as an switch field', async () => {
			const { element } = await setupTest();
			expect(element).toBeInstanceOf(Switch);

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