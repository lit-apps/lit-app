import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { customElement } from 'lit/decorators.js';
import {literal} from 'lit/static-html.js';
import { html } from 'lit';
import fixture, {fixtureCleanup} from '@lit-app/component/testing/fixture';
import { RecordField } from './record-field';

@customElement('pwi-test-record-field')
class TestRecordField extends RecordField {
	protected override readonly fieldTag = literal`lap-filled-field`;
 
 }

declare global {
	interface HTMLElementTagNameMap {
		'pwi-test-record-field': TestRecordField;
	}
}

afterEach(fixtureCleanup);
describe('record-field', () => {

	async function setupTest(
		template = html`<pwi-test-record-field></pwi-test-record-field>`
	) {
		const element = await fixture<TestRecordField>(template);
		if (!element) {
			throw new Error('Could not query rendered <pwi-test-record-field>.');
		}
		const button = element.renderRoot.querySelector('button');
		if (!element) {
			throw new Error('Could not query rendered <button>.');
		}
		return {
			element,
			button
		};
	}

	describe('basic', () => {

		it('initializes as an record-field field', async () => {
			const { element } = await setupTest();
			expect(element).toBeInstanceOf(RecordField);
			expect(element.count).toEqual(0);
			expect(element.name).toEqual('World');
		});

		it('should increment on click', async () => {
			const { element, button } = await setupTest();
			await button.click();
			expect(element.count).toEqual(1);
		})
	})
})