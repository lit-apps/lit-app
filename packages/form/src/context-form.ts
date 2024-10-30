import { consume, createContext } from '@lit/context';
import { LitElement } from 'lit';
import { state } from 'lit/decorators.js';
import watch from '@lit-app/shared/decorator/watch';
import a11yForm from './form.js';

// context for holding surveyContext
export const FormContext = createContext<a11yForm>('a11y-context-form');

import { BindFieldEvent, UnbindFieldEvent } from './form.js';
import { ConstraintValidation } from '@material/web/labs/behaviors/constraint-validation.js';

type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * ConsumeFormMixin a mixin that consumes actor context:
 * - @property - Actor<any,any>
 */
export declare class ContextFormMixinInterface {
  _form: a11yForm;
}

export const ConsumeFormMixin = <
  T extends Constructor<LitElement & ConstraintValidation>
>(superClass: T) => {

  class ContextConsumeFormMixinClass extends superClass {

    @consume({ context: FormContext, subscribe: true })
    @state() _form!: a11yForm;
    @watch('form') _formChanged(form: a11yForm, old: a11yForm) {
      console.log('form changed', form, old);
      this._unbindField(old);
      this._bindField(form);
    }

    override disconnectedCallback() {
      super.disconnectedCallback();
      this._unbindField(this._form);
    }
    override connectedCallback() {
      super.connectedCallback();
      this._bindField(this._form);
    }
    private _unbindField(form: a11yForm | undefined) {
      // we dispatch the event to the (and not from this)
      // to make this work with disconnectedCallback
      if (form) {
        form.dispatchEvent(new UnbindFieldEvent(this));
      }
    }
    private _bindField(form: a11yForm | undefined) {
      if (form) {
        form.dispatchEvent(new BindFieldEvent(this));
      }
    }
  };
  return ContextConsumeFormMixinClass as unknown as Constructor<ContextFormMixinInterface> & T;
}

