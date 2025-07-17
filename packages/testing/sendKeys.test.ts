import { html } from 'lit';
import fixture from './fixture.js';

import { describe, expect, it, vi } from 'vitest';
// import { sendKeys } from './sendKeys.js';
// import { page, userEvent } from '@vitest/browser/context';
import { userEvent } from '@vitest/browser/context';
/**
 * A helper function to set up the test fixture with a given field.
 * This makes it easy to test different fields in the future.
 * @param fieldTemplate - The HTML template for the field to be tested.
 * @returns An object with the wrapper, the field, and a spy on the handleInput method.
 */
async function setup() {
  const el = await fixture<HTMLInputElement>(html`<input type="text" >`);
  // const input = el.querySelector('input') as HTMLInputElement;
  return { el };
}

describe('sendKeys', () => {
  it('should fire input events when typing in a text input', async () => {
    // Create a fixture with an input element
    const { el } = await setup()

    // Set up event listeners to track fired events
    const inputEventSpy = vi.fn();
    const keydownEventSpy = vi.fn();
    const keyupEventSpy = vi.fn();

    el.addEventListener('input', inputEventSpy);
    el.addEventListener('keydown', keydownEventSpy);
    el.addEventListener('keyup', keyupEventSpy);

    // Focus the input element
    el.focus();
    expect(document.activeElement).toBe(el);

    // Type text using sendKeys
    const testText = 'Hello';
    await userEvent.keyboard(testText);
    // Verify the input value was updated
    expect(el.value).toBe(testText);

    // Verify input events were fired (one for each character)
    expect(inputEventSpy).toHaveBeenCalledTimes(testText.length);

    // Verify keydown and keyup events were fired (one for each character)
    expect(keydownEventSpy).toHaveBeenCalledTimes(testText.length);
    expect(keyupEventSpy).toHaveBeenCalledTimes(testText.length);

    // Verify the event details for the first character 'H'
    const firstInputEvent = inputEventSpy.mock.calls[0][0] as InputEvent;
    expect(firstInputEvent.type).toBe('input');
    expect(firstInputEvent.bubbles).toBe(true);
    expect(firstInputEvent.composed).toBe(true);

    const firstKeydownEvent = keydownEventSpy.mock.calls[0][0] as KeyboardEvent;
    expect(firstKeydownEvent.type).toBe('keydown');
    expect(firstKeydownEvent.key).toBe('H');
    expect(firstKeydownEvent.bubbles).toBe(true);

    const firstKeyupEvent = keyupEventSpy.mock.calls[0][0] as KeyboardEvent;
    expect(firstKeyupEvent.type).toBe('keyup');
    expect(firstKeyupEvent.key).toBe('H');
    expect(firstKeyupEvent.bubbles).toBe(true);
  });

  it('should work with textarea elements', async () => {
    const el = await fixture<HTMLTextAreaElement>(html`
      <textarea></textarea>
    `);

    const inputEventSpy = vi.fn();
    el.addEventListener('input', inputEventSpy);

    el.focus();
    expect(document.activeElement).toBe(el);

    const testText = 'Multi\nline\ntext';
    await userEvent.keyboard(testText);

    expect(el.value).toBe(testText);
    expect(inputEventSpy).toHaveBeenCalledTimes(testText.length);
  });

  // it('should throw error when no element is focused', async () => {
  //   // Ensure no element is focused
  //   if (document.activeElement) {
  //     (document.activeElement as HTMLElement).blur();
  //   }

  //   await expect(userEvent.keyboard('test')).rejects.toThrow(
  //     'No active element to send keys to'
  //   );
  // });

  it('should handle special characters and symbols', async () => {
    const el = await fixture<HTMLInputElement>(html`
      <input type="text" />
    `);

    const inputEventSpy = vi.fn();
    el.addEventListener('input', inputEventSpy);

    el.focus();

    const specialText = '!@#$%^&*()';
    await userEvent.keyboard(specialText);

    expect(el.value).toBe(specialText);
    expect(inputEventSpy).toHaveBeenCalledTimes(specialText.length);

    // Verify that special characters trigger events with correct key values
    const exclamationEvent = inputEventSpy.mock.calls[0][0] as InputEvent;
    expect(exclamationEvent.type).toBe('input');
  });

  it('should simulate realistic typing timing', async () => {
    const el = await fixture<HTMLInputElement>(html`
      <input type="text" />
    `);

    el.focus();

    const startTime = performance.now();
    await userEvent.keyboard('abc')
    const endTime = performance.now();

    // Should take some time due to setTimeout calls in sendKeys
    expect(endTime - startTime).toBeGreaterThan(0);
    expect(el.value).toBe('abc');
  });
});
