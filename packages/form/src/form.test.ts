/* eslint-disable @typescript-eslint/no-unused-expressions */

import { describe, expect, it, afterEach } from 'vitest';
import fixture, { fixtureCleanup } from '@lit-app/testing/fixture';
import { literal } from 'lit/static-html.js';
import { html } from 'lit';
import './form.js';
import { LappTextfield } from '@lit-app/cmp/field/text-field.js';
import '@lit-app/cmp/field/text-field.js';

// import type { a11yForm } from './form.js';
import { default as a11yForm, BIND_FIELD_EVENT, UNBIND_FIELD_EVENT, SUBMIT_EVENT } from './form.js';
import { FormFieldI } from './types.js';

afterEach(fixtureCleanup);

describe('a11y-form', () => {

  async function setupTest(
    template = html`<a11y-form></a11y-form>`
  ) {
    const el = await fixture<a11yForm>(template);
    if (!el) {
      throw new Error('Could not query rendered <a11y-form>.');
    }
    const form = el.form;
    const button = el.submitButton;
    return {
      el,
      form, button
    };
  }

  it('should instantiate the element', async () => {
    const { el } = await setupTest();
    expect(el).to.be.instanceOf(a11yForm);
  });

  it('should have default properties', async () => {
    const { el } = await setupTest();
    expect(el.enctype).to.equal('application/x-www-form-urlencoded');
    expect(el.method).to.equal('get');
    expect(el.novalidate).to.be.false;
    expect(el.submissionMode).to.equal('default');
  });

  it('should bind and unbind fields', async () => {
    const { el } = await setupTest();
    // @ts-expect-error - cheating
    const field: FormFieldI = { name: 'test', reportValidity: () => true };

    el.dispatchEvent(
      new CustomEvent(BIND_FIELD_EVENT, {
        detail: { field },
        bubbles: true,
        composed: true
      })
    );
    expect(el.boundFields).to.include(field);

    el.dispatchEvent(
      new CustomEvent(UNBIND_FIELD_EVENT, {
        detail: { field },
        bubbles: true,
        composed: true
      })
    );
    expect(el.boundFields).to.not.include(field);
  });

  it('its form should contain element with the right consume context', async () => {
    const { el, form } = await setupTest(
      html`<a11y-form>
        <lapp-text-field name="test" value="test"></lapp-text-field>
        <lapp-text-field name="required" value="" required></lapp-text-field>
      </a11y-form>`
    );
    await el.updateComplete;
    expect(form).to.exist;
    expect(el.boundFields).to.have.length(2);
     
    // expect(el.boundFields).to.have.length(1);

  })
  // it('should submit the form', async () => {
  //   const el = await fixture<a11yForm>(html`<a11y-form></a11y-form>`);
  //   const submitSpy = sinon.spy(el, 'submit');
  //   el.dispatchEvent(new CustomEvent(SUBMIT_EVENT, { bubbles: true, composed: true }));
  //   expect(submitSpy).to.have.been.calledOnce;
  // });

  // it('should validate the form', async () => {
  //   const el = await fixture<a11yForm>(html`<a11y-form></a11y-form>`);
  //   const field: FormFieldI = { name: 'test', reportValidity: () => true };
  //   el.boundFields = [field];
  //   const validitySpy = sinon.spy(field, 'reportValidity');
  //   el.reportValidity();
  //   expect(validitySpy).to.have.been.calledOnce;
  // });

  // it('should render virtual fields', async () => {
  //   const el = await fixture<a11yForm>(html`<a11y-form></a11y-form>`);
  //   const field: FormFieldI = { name: 'test', reportValidity: () => true };
  //   el.boundFields = [field];
  //   await el.updateComplete;
  //   const virtualField = el.shadowRoot!.querySelector('a11y-virtual-field');
  //   expect(virtualField).to.exist;
  //   expect(virtualField!.getAttribute('name')).to.equal('test');
  // });

  // it('should handle form submission with fetch mode', async () => {
  //   const el = await fixture<a11yForm>(html`<a11y-form submissionMode="fetch"></a11y-form>`);
  //   const preventDefaultSpy = sinon.spy();
  //   const event = new Event('submit', { bubbles: true, cancelable: true });
  //   event.preventDefault = preventDefaultSpy;
  //   el.shadowRoot!.querySelector('form')!.dispatchEvent(event);
  //   expect(preventDefaultSpy).to.have.been.calledOnce;
  // });
});