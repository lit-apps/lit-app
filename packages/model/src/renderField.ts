import { throttle } from '@preignition/preignition-util/src/debounce';
import { get, set } from '@preignition/preignition-util/src/deep';
import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type Entity from './entity';
import { Dirty, EntityWriteDetail, Update } from './events';
import { DefaultI, EntityElement, FieldConfig, FieldConfigUpload } from './types/entity';
import { Model, ModelComponentSelect } from './types/modelComponent';
// Note(CG): need to import polymer here, to avoid https://github.com/vitejs/vite/issues/5142
import '@polymer/polymer';
import '@vaadin/multi-select-combo-box/theme/material/vaadin-multi-select-combo-box';

import('@material/mwc-textfield')
import('@material/mwc-textarea')
import('@preignition/pwi-md/src/pwi-md-editor')
import('@preignition/firebase-upload/image-upload')
import('@preignition/pwi-form-upload')
import('@preignition/pwi-input/src/pwi-input-translation')
import('@preignition/pwi-input/src/pwi-input-translation-textarea')
import('@material/web/checkbox/checkbox.js')
import('@material/web/switch/switch.js')
import('@material/web/select/select-option.js')
import('../../cmp/field/slider-field.js')
import('../../cmp/field/select.js')

const debounceWrite = throttle((element: EntityElement, detail: EntityWriteDetail) => {
  console.log('debounceWrite', detail.data.detail)
  element.dispatchEvent(new Update(detail));
}, 2000, true)


/**
 * Renders a data entry field for a given model. It also handles the update of the data.
 * 
 * @param this 
 * @param name - the name of the model
 * @param data - current data
 * @param update - when true, updates the data automatically
 * @param m - the model
 * @param entity - the entity
 * @param config - additional config
 * @returns 
 */
export function renderField<Interface extends DefaultI>(this: EntityElement,
  name: string,
  data: Interface = {} as Interface,
  update: boolean,
  m: Model<unknown>,
  entity: Entity<Interface>,
  config?: FieldConfig | FieldConfigUpload,
  mode: 'edit' | 'translate' | 'view' = 'edit'
) {
  let model = get(name, m);
  if (!model && import.meta.env.DEV) {
    console.warn(`No model found for ${name}`);
    return html`<i class="field" style="color:var(--color-warning);">Missing model for "${name}" in "${entity.entityName}"</i>`
  }
  if (config) {
    model = { ...model, ...config }
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
  const dirtyEvent = new Dirty({ entityName: entity.entityName, dirty: true });

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
      if (v !== value) {
        this.dispatchEvent(dirtyEvent);
        await this.updateComplete
      }
      set(name, v, data);
      if (v !== value) {
        if (entity.realTime) {
          debounceWrite(this, { entityName: entity.entityName, id: id, data: data });
        }
      }
      if (model.onInput) {
        model.onInput(data, v, this);
      }
      if (update || model.requestUpdate) {
        this.requestUpdate('data');
      }
    };
  };

  if (mode === 'translate') {
    const origin = get(name, Object.getPrototypeOf(data));
    if (component === 'textfield') {
      return html`
      <pwi-input-translation 
        class=${cls}
        .name=${name}
        .readOnly=${disabled}
        .label=${label}
        .value=${origin}
        .translated=${value || ''}
        .maxLength=${model.maxLength}
        .minLength=${model.minLength}
        .charCounter=${!!model.maxLength}
        @translated-changed=${onInputFact('translated')} 
      ></pwi-input-translation>`
    }
    if (component === 'textarea') {
      return html`
      <pwi-input-translation-textarea 
        class=${cls}
        .name=${name}
        .readOnly=${disabled}
        .label=${label}
        .value=${origin}
        .translated=${value || ''}
        .maxLength=${model.maxLength}
        .charCounter=${!!model.maxLength}
        @translated-changed=${onInputFact('translated')} 
      ></pwi-input-translation-textarea>`
    }
    if (component === 'md') {
      return html`
      <pwi-md-editor 
        .rows=${3}
        .name=${name}
        .writeLabel=${label}
        .translate=${true} 
        .readOnly=${disabled}
        .md=${origin} 
        .mdtranslate=${origin} 
        @mdtranslate-changed=${onInputFact('mdtranslated')} 
        .maxLength=${model.maxLength}
        .charCounter=${!!model.maxLength}></pwi-md-editor>
      
      `
    }
    throw new Error(`Translation not allowed for ${name}`);

  }


  if (component === 'textfield') {
    // console.log('renderField', name, value)

    return html`
    <mwc-textfield
      class=${cls}
      .name=${name}
      type=${ifDefined(model.type) || undefined}
      .icon=${model.icon}
      .readOnly=${disabled}
      .placeholder=${model.placeholder}
      .label=${label}
      .helper=${model.helper}
      .required=${model.required}
      .maxLength=${model.maxLength}
      .minLength=${model.minLength}
      .charCounter=${!!model.maxLength}
      .value=${value || ''}
      @input=${onInputFact('value')}
    ></mwc-textfield>
    `
  }
  if (component === 'textarea') {
    return html`
    <mwc-textarea
      class=${cls}
      .name=${name}
      .readOnly=${disabled}
      .placeholder=${model.placeholder}
      .label=${label}
      .helper=${model.helper}
      .required=${model.required}
      .maxLength=${model.maxLength}
      .minLength=${model.minLength}
      .charCounter=${!!model.maxLength}
      .value=${value || ''}
      @input=${onInputFact('value')}
    ></mwc-textarea >`;
  }

  if (component === 'md') {
    if(model.droppable) {
      return html`<pwi-md-droppable-editor
      class=${cls}
      .name=${name}
      .readOnly=${disabled}
      .writeLabel=${label}
      .placeholder=${model.placeholder}
      .helper=${model.helper}
      .required=${model.required}
      .maxLength=${model.maxLength}
      .minLength=${model.minLength}
      .charCounter=${!!model.maxLength}
      .path=${model.path}
      useFirestore=${model.useFirestore || nothing }
      maxFileSize=${model.maxFileSize || nothing }
      rows=${ifDefined(model.rows) || undefined}
      resize=${ifDefined(model.resize) || undefined}
      .md=${value || ''}
      @input=${onInputFact('md')}
    ></pwi-md-droppable-editor>`
    }
  return html`
    <pwi-md-editor
      class=${cls}
      .name=${name}
      .readOnly=${disabled}
      .writeLabel=${label}
      .placeholder=${model.placeholder}
      .helper=${model.helper}
      .required=${model.required}
      .maxLength=${model.maxLength}
      .minLength=${model.minLength}
      .charCounter=${!!model.maxLength}
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
      .name=${name}
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
  if (component === 'upload-image') {
    return html`
    <firebase-image-upload
      class=${cls}
      .name=${name}
      .readonly=${disabled}
      .writeLabel=${label}
      .helper=${model.helper}
      .required=${model.required}
      .store=${model.store}
      .path=${model.path}
      .accept=${model.accept}
      .maxFileSize=${model.maxFileSize}
      .useFirestore=${model.useFirestore}
      .fieldPath=${model.fieldPath || name}
      .buttonText=${model.buttonText || nothing}
    ></firebase-image-upload>
    `;
  }
  if (component === 'slider') {
    // For the time being, we render as number text field as slider is not working
    return html`
     <lapp-slider-field
      class=${cls}
      .name=${name}
      .disabled=${disabled}
      .label=${label}
      .supportingText=${model.helper}
      .required=${model.required}
      .value=${value || ''}
      @change=${onInputFact('value')}
      .min=${model.min}
      .max=${model.max}
      step=${ifDefined(model.step)}
    ></lapp-slider-field>

    `;

  }
  if (component === 'select') {
    return html`
    <lapp-select
      class=${cls}
      .name=${name}
      .icon=${model.icon}
      .readonly=${disabled}
      .label=${label}
      .helper=${model.helper}
      .required=${model.required}
      .value=${value || ''}
      @change=${onInputFact('value')}
      >${((model as ModelComponentSelect).items || []).map(item => html`
        <md-select-option .value=${item.code} ?selected=${item.code === value}>
          <div slot="headline">${item.label}</div>
        </md-select-option>`)}
    </lapp-select >
  `;
  }
  if (component === 'multi-select') {
    return html`
    <vaadin-multi-select-combo-box
      class=${cls}
      .name=${name}
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
    <label class=${cls}>
      <md-checkbox touch-target="wrapper" 
        aria-label=${label||''}
        .name=${name}
        .checked=${value}
        .disabled=${disabled}
        @change=${onInputFact('checked')} 
        ></md-checkbox>
        ${label || ''}
      </label>
    `;
  }
  if (component === 'switch') {
    return html`
    <label class=${cls}>
      ${label || ''}
      <md-switch 
        .selected=${value}
        .name=${name}
        .disabled=${disabled}
        @change=${onInputFact('selected')} 
        ></md-switch>
      </label>
    `;
  }
  throw new Error(`No component found for ${name}`);
}
