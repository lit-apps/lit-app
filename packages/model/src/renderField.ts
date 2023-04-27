import { html } from 'lit';
import { get, set } from '@preignition/preignition-util/src/deep';
import { debounce, throttle } from '@preignition/preignition-util/src/debounce';
import { ifDefined } from 'lit/directives/if-defined.js';
import {   FieldConfig,  FieldConfigUpload,  EntityElement, DefaultI } from './types/entity';
import {Action } from './types/action'
import { Model, ModelComponent, ModelComponentSelect } from './types/modelComponent';
import { Dirty, EntityWriteDetail, Write, Update } from './events';
import Entity from './entity';
// Note(CG): need to import polymer here, to avoid https://github.com/vitejs/vite/issues/5142
import '@polymer/polymer';
import '@vaadin/multi-select-combo-box/theme/material/vaadin-multi-select-combo-box'
import { MultiSelectComboBox } from '@vaadin/multi-select-combo-box/src/vaadin-multi-select-combo-box'

import '@preignition/preignition-widget/src/extension/pwi-select'
import '@material/mwc-textfield'
import '@material/mwc-textarea'
import '@material/mwc-select'
import '@material/mwc-slider'
import '@preignition/pwi-md/src/pwi-md-editor'
import '@preignition/pwi-form-upload'

import '@material/mwc-formfield'
import('@material/web/switch/switch')

const debounceWrite = throttle((element: EntityElement, detail: EntityWriteDetail) => {
  console.log('debounceWrite', detail.data.detail)
  element.dispatchEvent(new Update(detail));
}, 2000, true)

export function renderField<Interface extends DefaultI>(this: EntityElement,
  name: string,
  data: Interface = {} as Interface,
  update: boolean,
  m: Model<unknown>,
  entity: Entity<Interface, any>,
  config?: FieldConfig |  FieldConfigUpload
) {
  let model = get(name, m);
  if(!model && import.meta.env.DEV) {
    console.warn(`No model found for ${name}`);
    return html`<i class="field" style="color:var(--color-warning);">Missing model for "${name}" in "${entity.entityName}"</i>` 
  }
  if(config) {
    model = {...model, ...config}
  }
  const key = name.split('.').pop();
  
  let { component } = model;
  if (!component) {
    component = 'textfield';
  }
  const cls = `${model.class || ''} ${key} ${component} field`;

  // check if we need to render
  if (model.hide) {
    const hide = model.hide(data);
    if (hide === 'hide') {
      return html`<div class="${cls}"></div>`;
    }
    if (hide === true) {
      return;
    }
  }
  if (model.show && !model.show(data)) {
    return;
  }

  const id = this.docId ? this.docId : this.id;
  const dirtyEvent = new Dirty({ entityName: entity.entityName, id: id, dirty: true });

  const canEdit = (this.entityStatus?.isEditing || (entity.realTime && this.entityAccess.canEdit)) && !(config?.disabled === true);
  const disabled = !canEdit;

  const label = model.label ?? key;

  if (!model) {
    throw new Error(`No model found for ${name}`);
  }

  const value = get(name, data);
  const onInputFact = (property: string) => {
    return async (e: CustomEvent) => {
      // @ts-ignore
      const v = e.target?.[property];
      if(v !== value) {
        this.dispatchEvent(dirtyEvent);
        await this.updateComplete
      }
      set(name, v, data);
      if(v !== value) {
        if(entity.realTime) {
          debounceWrite(this, { entityName: entity.entityName, id: id, data: data });
        }
      }
      if (model.onInput) {
        model.onInput(data, v, this);
      }
      if (update || model.requestUpdate) {
        this.requestUpdate();
      }
    };
  };

  if (component === 'textfield') {
    return html`
    <mwc-textfield
      class=${cls}
      type=${ifDefined(model.type) || undefined}
      .icon=${model.icon}
      .readOnly=${disabled}
      .label=${label}
      .helper=${model.helper}
      .required=${model.required}
      .value=${value || ''}
      @input=${onInputFact('value')}
    ></mwc-textfield >

    `;
  }
  if (component === 'textarea') {
    return html`
    <mwc-textarea
      class=${cls}
      .readOnly=${disabled}
      .label=${label}
      .helper=${model.helper}
      .required=${model.required}
      .value=${value || ''}
      @input=${onInputFact('value')}
    ></mwc-textarea >`;
  }

  if (component === 'md') {
    return html`
    <pwi-md-editor
      class=${cls}
      .readOnly=${disabled}
      .writeLabel=${label}
      .helper=${model.helper}
      .required=${model.required}
      rows=${ifDefined(model.rows) || undefined}
      resize=${ifDefined(model.resize) || undefined}
      .md=${value || ''}
      @input=${onInputFact('md')}
    ></pwi-md-editor>
    `;
  }

  if (component === 'upload') {
    return html`
    <pwi-form-upload
      class=${cls}
      .readonly=${disabled}
      .writeLabel=${label}
      .helper=${model.helper}
      .required=${model.required}
      .store=${model.store}
      .path=${model.path}
      .maxFiles=${model.maxFiles}
      .accept=${model.accept}
      .maxFileSize=${model.maxFileSize}
      .useFirestore=${model.useFirestore}
      .fieldPath=${model.fieldPath || name}
    ></pwi-form-upload>
    `;
  }
  if (component === 'slider') {
    // For the time being, we render as number text field as slider is not working
    return html`
     <mwc-textfield
      class=${cls}
      type="number"
      type=${ifDefined(model.type) || undefined}
      .icon=${model.icon}
      .readOnly=${disabled}
      .label=${label}
      .helper=${model.helper}
      .required=${model.required}
      .value=${value || ''}
      @input=${onInputFact('value')}
      .min=${model.min}
      .max=${model.max}
      step=${ifDefined(model.step)}
    ></mwc-textfield >

    `;
    // return html`
    //   <mwc-slider
    //     .value=${value} 
    //     .disabled=${disabled}
    //     _min=${model.min}
    //     _ax=${model.max}
    //     _step=${ifDefined(model.step)}
    //     @input=${onInputFact('value')}></mwc-slider>
    // `
  }
  if (component === 'select') {
    return html`
    <pwi-select
      class=${cls}
      .icon=${model.icon}
      .readonly=${disabled}
      .label=${label}
      .helper=${model.helper}
      .required=${model.required}
      .value=${value || ''}
      @selected=${onInputFact('value')}
      >${((model as ModelComponentSelect).items || []).map(item => html`<mwc-list-item .value=${item.code}>${item.label}</mwc-list-item>`)}
    </pwi-select >
  `;
  }
  if (component === 'multi-select') {
    return html`
    <vaadin-multi-select-combo-box
      class=${cls}
      .items=${(model as ModelComponentSelect).items}
      .selectedItems=${((model as ModelComponentSelect).items || []).filter(item => (value || []).indexOf(item.code) > -1)}
      @change=${onInputFact('selectedValues')}
      .itemLabelPath=${'label'}
      .itemValuePath=${'code'}
      .icon=${model.icon}
      .disabled=${disabled}
      .label=${label}
      .helperText=${model.helper}
      .required=${model.required}
      >
    </vaadin-multi-select-combo-box>
  `;
  }
  if (component === 'checkbox') {
    return html`
     <mwc-formfield 
      .label=${label}
      class=${cls}
      >
      <pwi-checkbox 
        .checked=${value} 
        .disabled=${disabled}
        @change=${onInputFact('checked')}></pwi-checkbox>
    </mwc-formfield>
    `;
  }
  if (component === 'switch') {
    return html`
    <label class=${cls}>
      ${label || ''}
      <md-switch 
        .selected=${value}
        .disabled=${disabled}
        @click=${onInputFact('selected')} 
        ></md-switch>
      </label>
    `;
  }
  throw new Error(`No component found for ${name}`);
}
