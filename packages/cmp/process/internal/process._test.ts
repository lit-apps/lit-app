import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { customElement } from 'lit/decorators.js';
import {literal} from 'lit/static-html.js';
import { html } from 'lit';
import fixture, {fixtureCleanup} from '@lit-app/component/testing/fixture';
import { Process } from './process';

@customElement('pwi-test-process')
class TestProcess extends Process {
	protected override readonly fieldTag = literal`lap-filled-field`;
 
 }

declare global {
	interface HTMLElementTagNameMap {
		'pwi-test-process': TestProcess;
	}
}

afterEach(fixtureCleanup);
describe('process', () => {

	async function setupTest(
		template = html`<pwi-test-process></pwi-test-process>`
	) {
		const element = await fixture<TestProcess>(template);
		if (!element) {
			throw new Error('Could not query rendered <pwi-test-process>.');
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

		it('initializes as an process field', async () => {
			const { element } = await setupTest();
			expect(element).toBeInstanceOf(Process);
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