import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fixture, assert, expect as expectwc } from '@open-wc/testing'
import { customElement } from 'lit/decorators.js';
import {literal} from 'lit/static-html.js';
import { TextFieldHarness } from '../harness';
import { html } from 'lit';

import { TextField } from './text-field';

@customElement('lap-test-text-field')
class TestTextfield extends TextField {
	protected override readonly fieldTag = literal`lap-filled-field`;
 
 }

declare global {
	interface HTMLElementTagNameMap {
		'lap-test-text-field': TestTextfield;
	}
}

describe('text-field', () => {

	async function setupTest(
		template = html`<lap-test-text-field></lap-test-text-field>`
	) {
		const element = await fixture<TestTextfield>(template);
		if (!element) {
			throw new Error('Could not query rendered <lap-test-text-field>.');
		}

		const field = element.field;
		if (!field) {
			throw new Error('Could not query field.');
		}

		// const focusRing = element.renderRoot.querySelector('md-focus-ring');
		// if (!focusRing) {
		//   throw new Error('Could not query rendered <md-focus-ring>.');
		// } 

		return {
			field,
			// focusRing,
			harness: new TextFieldHarness(element),
		};
	}

	describe('basic', () => {

		it('initializes as an text-field field', async () => {
			const { harness } = await setupTest();
			expect(harness.element).toBeInstanceOf(TextField);
			expect(harness.element.variant).toEqual(undefined);
			expect(harness.element.labelAbove).toEqual(undefined);
		});

		
	})

  describe('variant', () => {

		it('reflects variant to field', async () => {
			const { harness } = await setupTest(html`<lap-test-text-field variant="a11y"></lap-test-text-field>`);
			expect(harness.element.variant).toEqual('a11y');
			expect(harness.element.field).toEqual('a11y');
			expect(harness.element.field.labelAbove).toEqual(true);
		});

		
	})
})