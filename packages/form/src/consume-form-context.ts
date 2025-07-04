import watch from '@lit-app/shared/decorator/watch';
import { consume, createContext } from '@lit/context';
import { LitElement } from 'lit';
import { state } from 'lit/decorators.js';
import a11yForm from './form.js';

// context for holding surveyContext
export const FormContext = createContext<LitElement>('a11y-context-form');

import { ConstraintValidation } from '@material/web/labs/behaviors/constraint-validation.js';
import { BindFieldEvent, UnbindFieldEvent } from './provide-form-context.js';



import { MixinBase, MixinReturn } from '@material/web/labs/behaviors/mixin.js';


export declare class ConsumeFormContextMixinInterface {
  _form: LitElement;
}

type BaseT = LitElement & ConstraintValidation & {}
/**
 * ConsumeFormContextMixin  
 */
export const ConsumeFormContextMixin = <T extends MixinBase<BaseT>>(
  superClass: T
): MixinReturn<T, ConsumeFormContextMixinInterface> => {


  abstract class ConsumeFormContextMixinClass extends superClass {


    @consume({ context: FormContext, subscribe: true })
    @state() _form!: LitElement;
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
    private _unbindField(form: LitElement | undefined) {
      // we dispatch the event to the (and not from this)
      // to make this work with disconnectedCallback
      if (form) {
        form.dispatchEvent(new UnbindFieldEvent(this));
      }
    }
    private _bindField(form: LitElement | undefined) {
      if (form) {
        form.dispatchEvent(new BindFieldEvent(this));
      }
    }
  };
  return ConsumeFormContextMixinClass;
}

export default ConsumeFormContextMixin;

