import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { customElement } from 'lit/decorators.js';
import { html } from 'lit';
import fixture, {fixtureCleanup} from '@lit-app/testing/fixture';
import { Record } from './record';

@customElement('test-record')
class TestRecord extends Record {
	
 }

declare global {
	interface HTMLElementTagNameMap {
		'test-record': TestRecord;
	}
}

afterEach(fixtureCleanup);
describe('record', () => {

	async function setupTest(
		template = html`<test-record></test-record>`
	) {
		const element = await fixture<TestRecord>(template);
		if (!element) {
			throw new Error('Could not query rendered <test-record>.');
		}
		
		return {
			element,
		};
	}

	describe('basic', () => {

		it('initializes as an record field', async () => {
			const { element } = await setupTest();
			expect(element).toBeInstanceOf(Record);

		});


	})
})