import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { customElement } from 'lit/decorators.js';
import {literal} from 'lit/static-html.js';
import { html } from 'lit';
import fixture, {fixtureCleanup} from '@lit-app/testing/fixture';
import { Upload } from './upload';
import {FirebaseDocumentUpload} from '@preignition/firebase-upload/document-upload';

@customElement('test-upload')
class TestUpload extends Upload {
	protected override readonly fieldTag = literal`lapp-filled-field`;
 
 }

declare global {
	interface HTMLElementTagNameMap {
		'test-upload': TestUpload;
	}
}

afterEach(fixtureCleanup);
describe('upload', () => {

	async function setupTest(
		template = html`<test-upload></test-upload>`
	) {
		const element = await fixture<TestUpload>(template);
		if (!element) {
			throw new Error('Could not query rendered <test-upload>.');
		}
		const input  = element.input as unknown as FirebaseDocumentUpload;
		//@ts-ignore
		const {inputEnd, inputStart}  = input
		return {
			element,
			input,
			inputEnd,
			inputStart
		};
	}

	describe('basic', () => {

		it('initializes as an upload field', async () => {
			const { element } = await setupTest();
			expect(element).toBeInstanceOf(Upload);
			
		});

		
	})
})