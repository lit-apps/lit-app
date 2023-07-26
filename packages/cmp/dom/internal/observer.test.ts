import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { customElement } from 'lit/decorators.js';
import {literal} from 'lit/static-html.js';
import { html } from 'lit';
import fixture, {fixtureCleanup} from '@lit-app/testing/fixture';
import { DomObserver } from './observer';

// const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

@customElement('lapp-test-observer')
class TestObserver extends DomObserver {
 
 }

declare global {
	interface HTMLElementTagNameMap {
		'lapp-test-observer': TestObserver;
	}
}


afterEach(fixtureCleanup);
describe('observer', () => {

	async function setupTest(
		template = html`<lapp-test-observer></lapp-test-observer>`
	) {
		const element = await fixture<TestObserver>(template);
		if (!element) {
			throw new Error('Could not query rendered <lapp-test-radio>.');
		}
	
		return {
			element
			
		};
	}

		it('initializes as an dom-observer', async () => {
			const { element } = await setupTest();
			expect(element).toBeInstanceOf(DomObserver);
		
		});

		it('fires content-changed event on set-up', async () => {
			const fn = vi.fn();
			const onContentChanged = (e: CustomEvent) => fn()
			const template = html`<lapp-test-observer @content-changed=${onContentChanged}></lapp-test-observer>`;
			const { element } = await setupTest(template);
			await element.updateComplete;
			expect(fn).toHaveBeenCalledTimes(1);
		})

		it('fires content-changed when content changes', async () => {
			let value = '';
			const onContentChanged = (e: CustomEvent) => value = e.detail.value
			const template = html`<lapp-test-observer @content-changed=${onContentChanged}>
				<span id="test">test</span>
			</lapp-test-observer>`;
			const { element } = await setupTest(template);
			await element.updateComplete;
			expect(value).to.equal('test')

			const test = element.querySelector('#test') as HTMLElement
			test.textContent = 'changed'
			await element.updateComplete;
			expect(value).to.equal('changed')

	})
})