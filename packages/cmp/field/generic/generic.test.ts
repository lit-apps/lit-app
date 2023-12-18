import '../field/filled-field';
import fixture, { fixtureCleanup } from '@lit-app/testing/fixture';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { literal } from 'lit/static-html.js';
import { afterEach, describe, expect, it } from 'vitest';

import { Generic } from './generic';

@customElement('lapp-test-field')
class TestField extends Generic {

	protected override fieldName = 'test';
	protected override readonly fieldTag = literal`lapp-filled-field`;
 
 }

declare global {
	interface HTMLElementTagNameMap {
		'lapp-test-field': TestField;
	}
}
afterEach(fixtureCleanup);

describe('generic', () => {

	async function setupTest(
		template = html`<lapp-test-field></lapp-test-field>`
	) {
		const element = await fixture<TestField>(template);
		
		if (!element) {
			throw new Error('Could not query rendered <lapp-test-field>.');
		}

		const field = element.field;
		await field.updateComplete
		if (!field) {
			throw new Error('Could not query field.');
		}


		return {
			field,
			element
		};
	}

	describe('basic', () => {

		it('initializes as an field field', async () => {
			const { element } = await setupTest();
			expect(element).toBeInstanceOf(Generic);
			expect(element.variant).toEqual(undefined);
		});
		
		it('should reflect variant to field', async () => {
			const { element, field } = await setupTest( html`<lapp-test-field variant="a11y" label="test"></lapp-test-field>`);
			
			expect(element.label).toEqual('test');
			expect(field.label).toEqual('test');
			// await wait(100)

			expect(field.variant).toEqual('a11y'); 
			expect(field.labelAbove).toEqual(true);
		})

		
	})
})