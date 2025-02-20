import fixture from '@lit-app/testing/fixture';
import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { describe, expect, it } from 'vitest';
import { watch } from './watch.js';

// Helper function to wait for element updates
const elementUpdated = (el: LitElement) => el.updateComplete;


class TestElement extends LitElement {
  @property()
  prop1 = 'initial';

  @property({ type: Number })
  prop2 = 0;

  prop1Changes = 0;
  prop2Changes = 0;
  lastOldValue: unknown;
  lastNewValue: unknown;

  @watch('prop1')
  protected handleProp1Change(newValue: string, oldValue: string) {
    // console.info('prop1 changed', newValue, oldValue)
    this.prop1Changes += 1;
    this.lastOldValue = oldValue;
    this.lastNewValue = newValue;
  }

  @watch('prop2', true) // with waitUntilFirstUpdate
  protected handleProp2Change(newValue: number, oldValue: number) {
    this.prop2Changes += 1;
    this.lastOldValue = oldValue;
    this.lastNewValue = newValue;
  }

  override render() {
    return html`<div>${this.prop1} ${this.prop2}</div>`;
  }
}

customElements.define('test-element', TestElement);

describe('watch decorator', () => {
  it('should watch property changes', async () => {
    const el = await fixture<TestElement>(html`<test-element></test-element>`);

    el.prop1 = 'changed';
    await elementUpdated(el);

    // without waitUntilFirstUpdate - we call twice
    expect(el.prop1Changes).toBe(2);
    expect(el.lastOldValue).toBe('initial');
    expect(el.lastNewValue).toBe('changed');
  });

  it('should not trigger once on same value and not waitUntilFirstUpdate', async () => {
    const el = await fixture<TestElement>(html`<test-element></test-element>`);
    await elementUpdated(el);
    expect(el.prop1Changes).toBe(1);

    el.prop1 = 'initial';
    await elementUpdated(el);

    expect(el.prop1Changes).toBe(1);
  });

  it('should not trigger on same value on waitUntilFirstValue', async () => {
    const el = await fixture<TestElement>(html`<test-element></test-element>`);
    await elementUpdated(el);
    expect(el.prop2Changes).toBe(0);

    el.prop2 = 0;
    await elementUpdated(el);

    expect(el.prop2Changes).toBe(0);
    el.prop2 = 0;

  });

  it('should not trigger on same value on waitUntilFirstValue with value set as attribute', async () => {
    const el = await fixture<TestElement>(html`<test-element prop2="0"></test-element>`);
    await elementUpdated(el);
    expect(el.prop2Changes).toBe(0);

    el.prop2 = 0;
    await elementUpdated(el);

    expect(el.prop2Changes).toBe(0);
    el.prop2 = 0;

  });

  it('should respect waitUntilFirstUpdate', async () => {
    const el = await fixture<TestElement>(html`<test-element ></test-element>`);

    // First update should be ignored due to waitUntilFirstUpdate
    // expect(el.prop2Changes).toBe(0);

    // Subsequent updates should trigger the watch
    el.prop2 = 10;
    await elementUpdated(el);

    expect(el.prop2Changes).toBe(1);
    expect(el.lastOldValue).toBe(0);
    expect(el.lastNewValue).toBe(10);
  });

  it('should handle multiple property watches independently', async () => {
    const el = await fixture<TestElement>(html`<test-element></test-element>`);

    el.prop1 = 'changed';
    el.prop2 = 42;
    await elementUpdated(el);

    expect(el.prop1Changes).toBe(2);
    expect(el.prop2Changes).toBe(1);
  });
});
