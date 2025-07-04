import { ContextProvider } from '@lit/context';
import { MixinBase, MixinReturn } from '@material/web/labs/behaviors/mixin.js';
import { LitElement } from 'lit';
import { state } from 'lit/decorators.js';
import { FormContext } from './consume-form-context.js';
import { FormFieldI } from './types.js';

export const BIND_FIELD_EVENT = 'a11y-bind-field';
export const UNBIND_FIELD_EVENT = 'a11y-unbind-field';

interface BindFieldEventDetail {
  field: FormFieldI;
}

export class BindFieldEvent extends CustomEvent<BindFieldEventDetail> {
  constructor(field: FormFieldI) {
    super(BIND_FIELD_EVENT, { detail: { field }, bubbles: true, composed: true });
  }
}

export class UnbindFieldEvent extends CustomEvent<BindFieldEventDetail> {
  constructor(field: FormFieldI) {
    super(UNBIND_FIELD_EVENT, { detail: { field }, bubbles: true, composed: true });
  }
}

declare global {
  interface HTMLElementEventMap {
    [BIND_FIELD_EVENT]: BindFieldEvent;
    [UNBIND_FIELD_EVENT]: UnbindFieldEvent;
  }
}

export declare class ProvideFormContextMixinInterface {
  boundFields: FormFieldI[];
}

type BaseT = LitElement;

export const ProvideFormContextMixin = <T extends MixinBase<BaseT>>(
  superClass: T
): MixinReturn<T, ProvideFormContextMixinInterface> => {
  abstract class ProvideFormContextMixinClass extends superClass {
    @state()
    boundFields: FormFieldI[] = [];
    formProvider = new ContextProvider(this, { context: FormContext });

    constructor(...args: any[]) {
      super(...args);
      this.formProvider.setValue(this)

      this.addEventListener(BIND_FIELD_EVENT, (e: BindFieldEvent) => {
        this.bindField(e.detail.field);
      });
      this.addEventListener(UNBIND_FIELD_EVENT, (e: UnbindFieldEvent) => {
        this.unbindField(e.detail.field);
      });
    }

    protected bindField(field: FormFieldI) {
      if (!this.boundFields.includes(field)) {
        // re reverse the order so that the first field is focused first
        this.boundFields.unshift(field);
        this.requestUpdate();
      }
    }

    protected unbindField(field: FormFieldI) {
      this.boundFields = this.boundFields.filter(f => f !== field);
    }


  }
  return ProvideFormContextMixinClass;
};

export default ProvideFormContextMixin;
