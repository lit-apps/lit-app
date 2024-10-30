/* eslint-disable @typescript-eslint/no-unused-expressions */

import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { customElement } from 'lit/decorators.js';
import {literal} from 'lit/static-html.js';
import { html } from 'lit';
import fixture, {fixtureCleanup} from '@lit-app/testing/fixture';
import { Slider } from './slider';
import { InputSlider } from './input-slider';
import { MdSlider } from '@material/web/slider/slider';

@customElement('test-slider')
class TestSlider extends Slider {
	protected override readonly fieldTag = literal`lapp-filled-field`;
 
 }

declare global {
	interface HTMLElementTagNameMap {
		'test-slider': TestSlider;
	}
}

afterEach(fixtureCleanup);
describe('slider', () => {

	async function setupTest(
		template = html`<test-slider></test-slider>`
	) {
		const element = await fixture<TestSlider>(template);
		if (!element) {
			throw new Error('Could not query rendered <test-slider>.');
		}
		const input  = element.input as unknown as MdSlider;
		//@ts-expect-error  - we are cheating
		const {inputEnd, inputStart}  = input
		return {
			element,
			input,
			inputEnd,
			inputStart
		};
	}

	describe('basic', () => {

		it('initializes as an slider field', async () => {
			const { element } = await setupTest();
			expect(element).toBeInstanceOf(Slider);
			
		});

		it('set value to Slider', async () => {
			const { element, input, inputEnd, inputStart } = await setupTest();
			await element.updateComplete;
			expect(input.value).to.be.equal('');
			expect(inputEnd?.value).to.be.equal('50');

			element.value = 10;
			await element.updateComplete;
			expect(input.value).to.be.equal(10);
			expect(inputEnd?.value).to.be.equal("10");
			expect(inputStart).to.be.null

		});
		
		it('make slider a range Slider when value is an array', async () => {
			const { element, input, inputEnd, inputStart } = await setupTest();
			await element.updateComplete;
			expect(input.range).to.be.false;
			element.value = [10, 20];
			await element.updateComplete;
			expect(input.range).to.be.true;
			expect(inputEnd?.value).to.be.equal("20");
		});
	})
})