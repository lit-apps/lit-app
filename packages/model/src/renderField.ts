import { get, set } from '@lit-app/shared/dataUtils';
import { TemplateResult, html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import AbstractEntity from './AbstractEntity.js';
import { DataChanged, Dirty } from './events';
import { DefaultI, EntityElement, RenderConfig } from './types/entity';
import type {
  FieldConfig,
  Model,
  ModelComponent,
  ModelComponentBoolean,
  ModelComponentCheckboxGroup,
  ModelComponentMd,
  ModelComponentMdDroppable,
  ModelComponentRadioGroup,
  ModelComponentSelect,
  ModelComponentSlider,
  ModelComponentStar,
  ModelComponentText,
  ModelComponentTextArea,
  ModelComponentUpload,
  ModelComponentUploadImage
} from './types/modelComponent';
import('@vaadin/multi-select-combo-box/vaadin-lit-multi-select-combo-box');

import { NestedKeys } from '@lit-app/shared/types.js';
import '../field-translate.js';
import {
  isComponentCheckbox,
  isComponentCheckboxGroup,
  isComponentMd,
  isComponentMdDroppable,
  isComponentMultiSelect,
  isComponentRadioGroup,
  isComponentSelect,
  isComponentSlider,
  isComponentStar,
  isComponentSwitch,
  isComponentText,
  isComponentTextArea,
  isComponentUpload,
  isComponentUploadImage,
} from './types/modelComponent';


type OComponentText = Omit<ModelComponentText, 'component'>;
type OComponentCheckboxGroup = Omit<ModelComponentCheckboxGroup, 'component'>;
type OComponentTextArea = Omit<ModelComponentTextArea, 'component'>;
type OComponentStar = Omit<ModelComponentStar, 'component'>;
type OComponentRadioGroup = Omit<ModelComponentRadioGroup, 'component'>;
type OComponentBoolean = Omit<ModelComponentBoolean, 'component'>;
type OComponentSelect = Omit<ModelComponentSelect, 'component'>;
type OComponentSlider = Omit<ModelComponentSlider, 'component'>;
type OComponentUpload = Omit<ModelComponentUpload, 'component'>;
type OComponentUploadImage = Omit<ModelComponentUploadImage, 'component'>;
type OComponentMd = Omit<ModelComponentMd, 'component'>;

import('@material/web/checkbox/checkbox.js')
import('@material/web/switch/switch.js')
import('@material/web/select/select-option.js')
import('../../cmp/field/choice-checkbox')
import('../../cmp/field/choice-radio')
import('../../cmp/field/choice-star')
import('../../cmp/field/upload')
import('../../cmp/upload/image-firebase.js')
import('../../cmp/upload/image.js')
import('../../cmp/field/text-field')
import('../../cmp/field/md-editor')
import('../../cmp/field/md-droppable-editor')
import('../../cmp/field/slider-field.js')
import('../../cmp/field/select.js')

/**
 * We need to change the way we handle data transations: 
 * - any data change will be dispatched as a  change event, so that we can track changes in db-ref
 * - real-time will be moved to db-ref or the entity so that we either write real time (throttling the write) or not
 * - dirty event will always be dispatched. For real-time scenario, we know data is not dirty when the read succeeds.
 */

// const debounceWrite = throttle((element: EntityElement, detail: EntityWriteDetail) => {
//   console.log('debounceWrite', detail.data.detail)
//   element.dispatchEvent(new Update(detail));
// }, 2000, true)


/**
 * Renders a field based on the provided model and configuration.
 *
 * @template D - The type of the data object.
 * @param {string} name - The name of the field.
 * @param {D} [data={}] - The data object containing field values.
 * @param {boolean} update - Flag indicating whether to update the field.
 * @param {Model<D>} m - The model object defining the field structure.
 * @param {AbstractEntity} entity - The entity to which the field belongs.
 * @param {FieldConfig<D>} [config] - Optional configuration for the field.
 * @param {RenderConfig['consumingMode']} [consumingMode='edit'] - The mode in which the field is being consumed (e.g., 'edit', 'view', 'translate').
 * @param {string} [path] - Optional path to the field within the model.
 * @returns {TemplateResult | typeof nothing} - The rendered field as a TemplateResult or `nothing` if the field should not be rendered.
 * @throws {Error} - Throws an error if no model is found for the specified field name.
 */
export function renderField<D extends DefaultI>(
  this: EntityElement,
  name: NestedKeys<D>,
  data: D = {} as D,
  update: boolean,
  m: Model<D>,
  entity: AbstractEntity,
  config?: FieldConfig<D>,
  consumingMode: RenderConfig['consumingMode'] = 'edit',
  path?: string
): TemplateResult {
  let model: ModelComponent<any> = get(path || name, m);
  if (!model && import.meta.env.DEV) {
    console.warn(`No model found for ${name}`);
    return html`<i class="field" style="color:var(--color-warning);">Missing model for "${name}" in "${entity.entityName}"</i>`
  }
  if (config) {
    model = { ...model, ...config } as ModelComponent
  }

  if (!model) {
    throw new Error(`No model found for ${name}`);
  }

  const key = (name as string).split('.').pop();

  const { component } = model;
  if (!component) {
    model.component = 'textfield';
  }
  const cls = `${model.class || ''} ${key} ${component} field`;

  // check if we need to render
  if (model.hide) {
    const hide = model.hide(data);
    if (hide === 'hide') {
      return html`<div class="${cls}"></div>`;
    }
    if (hide === true) {
      return nothing as any;
    }
  }
  if (model.show && !model.show(data)) {
    return nothing as any;
  }

  const id = this.docId ? this.docId : this.id;


  // Note: model.label can be a template result
  const label = (model.label ?? (key || '')) as string;

  // Handle specific attributes that have different behavior depending on the consumingMode (placeholder, disabled)
  const placeholder = consumingMode === 'edit' || consumingMode === 'translate' ?
    ((model as ModelComponentText).placeholder || '') : '';
  const canEdit = (
    consumingMode === 'offline') || ((
      this.entityStatus?.isEditing ||
      this.entityStatus?.isNew ||
      (entity.realTime && this.authorization.canEdit)
    ) && !(config?.disabled === true)
      && consumingMode !== 'view');

  let disabled = !canEdit;

  // input handler
  const value = get(name, data);
  const onInputFact = (property: string) => {
    return async (e: CustomEvent) => {
      if (consumingMode === 'offline'
        || consumingMode === 'view'
        || consumingMode === 'print'
      ) {
        return;
      }
      // @ts-expect-error - not typed
      const v = e.target?.[property];
      if (v !== value) {
        this.dispatchEvent(
          new Dirty({ entityName: entity.entityName, dirty: true, id })
        );
        await this.updateComplete
      }
      set(name, v, data);
      if (v !== value && entity.realTime) {
        this.dispatchEvent(
          // we send a copy of the data to storing prototype
          new DataChanged({ entityName: entity.entityName, id, ...{ data } })
        );

      }
      if (model.onInput) {
        model.onInput(data, v, this);
      }
      if (update || model.requestUpdate) {
        this.requestUpdate('data');
      }
    };
  };

  // Handle translation First
  if (consumingMode === 'translate') {
    const origin = get(name, Object.getPrototypeOf(data));
    const value = Object.getOwnPropertyDescriptor(data, name)?.value;
    if (isComponentText(model) || isComponentTextArea(model)) {
      const type = isComponentTextArea(model) ? 'textarea' : 'text';
      return html`
      <lapp-field-translate 
        class=${cls}
        .name=${name}
        type=${type}
        style=${ifDefined(model.style)}
        rows=${ifDefined(model.rows)}
        .readOnly=${disabled}
        .label=${label}
        .value=${origin}
        .translated=${value || ''}
        .maxLength=${model.maxLength!}
        .minLength=${model.minLength}
        .charCounter=${!!model.maxLength}
        @translated-changed=${onInputFact('translated')} 
      >${model.slots || nothing}</lapp-field-translate>`
    }
    if (isComponentMd(model) || isComponentMdDroppable(model)) {
      return html`
      <lapp-md-editor 
        .rows=${3}
        .name=${name}
        style=${ifDefined(model.style)}
        .required=${!!model.required}
        .writeLabel=${label}
        .translate=${true} 
        .readOnly=${disabled}
        .showAccessibilityMenu=${model.showAccessibilityMenu!}
        .md=${origin} 
        .mdtranslate=${origin} 
        @mdtranslate-changed=${onInputFact('mdtranslated')} 
        .maxLength=${model.maxLength!}
        .charCounter=${!!model.maxLength}></lapp-md-editor>
      `
    }
    throw new Error(`Translation not allowed for ${name}`);
  }

  if (isComponentText(model)) {
    return renderText(model);
  }

  if (isComponentTextArea(model)) {
    return renderTextArea(model)
  }

  if (isComponentMdDroppable(model)) {
    if (consumingMode === 'print') {
      model.hideTabsOnReadOnly = true;
      disabled = true;
    }
    return renderMdDroppable(model)
  }
  if (isComponentMd(model)) {
    if (consumingMode === 'print') {
      model.hideTabsOnReadOnly = true;
      disabled = true;
    }
    return renderMd(model)
  }

  if (isComponentUpload(model)) {
    return renderUpload(model)
  }
  if (isComponentUploadImage(model)) {
    return renderUploadImage(model)
  }
  if (isComponentSlider(model)) {
    if (consumingMode === 'offline') {
      return renderText(model)
    }
    return renderRadioSlider(model)
  }
  if (isComponentSelect(model)) {
    if (consumingMode === 'offline') {
      return renderRadioGroup(model)
    }
    return renderRadioSelect(model)

  }
  if (isComponentMultiSelect(model)) {
    if (consumingMode === 'offline') {
      return renderCheckboxGroup(model)
    }
    return renderMultiSelect(model)
  }
  if (isComponentCheckbox(model)) {
    return renderCheckbox(model)
  }
  if (isComponentSwitch(model)) {
    if (consumingMode === 'offline') {
      return renderCheckbox(model)
    }
    return renderSwitch(model)
  }
  if (isComponentCheckboxGroup(model)) {
    return renderCheckboxGroup(model)
  }
  if (isComponentRadioGroup(model)) {
    return renderRadioGroup(model)
  }
  if (isComponentStar(model)) {
    return renderStar(model)
  }
  throw new Error(`No component found for ${name}`);


  // All the rendering functions
  function renderText(model: OComponentText) {
    return html`
      <lapp-filled-text-field
        class=${cls}
        .name=${name}
        style=${ifDefined(model.style)}
        type=${ifDefined(model.type)}
        .icon=${model.icon}
        .readOnly=${disabled}
        .placeholder=${placeholder}
        .label=${label}
        .supportingText=${model.helper}
        .required=${!!model.required}
        .maxLength=${model.maxLength!}
        .minLength=${model.minLength!}
        .value=${value || ''}
        @input=${onInputFact('value')}
      ></lapp-filled-text-field>
    `
  }
  function renderTextArea(model: OComponentTextArea) {
    return html`
      <lapp-text-field 
        type="textarea"
        class=${cls}
        style=${ifDefined(model.style)}
        rows=${ifDefined(model.rows)}
        .name=${name}
        .readOnly=${disabled}
        .placeholder=${placeholder}
        .label=${label}
        .supportingText=${model.helper}
        .required=${!!model.required}
        .maxLength=${model.maxLength!}
        .minLength=${model.minLength!}
        .value=${value || ''}
        @input=${onInputFact('value')}
      ></lapp-text-field>`;
  }

  function renderMdDroppable(model: ModelComponentMdDroppable) {
    return html`
      <lapp-md-droppable-editor
        class=${cls}
        .name=${name}
        style=${ifDefined(model.style)}
        
        .flavour=${model.flavour}
        .readOnly=${disabled}
        .writeLabel=${label}
        .placeholder=${placeholder}
        .helper=${model.helper!}
        .required=${!!model.required}
        .maxLength=${model.maxLength!}
        .minLength=${model.minLength!}
        .path=${model.path}
        .showAccessibilityMenu=${model.showAccessibilityMenu!}
        ?disabled=${disabled}
        ?useFirestore=${model.useFirestore}
        .maxFileSize=${model.maxFileSize!}
        rows=${model.rows || nothing as any}
        resize=${model.resize || nothing}
        .md=${value || ''}
        @input=${onInputFact('md')}
      ></lapp-md-droppable-editor>`
  }

  function renderMd(model: OComponentMd) {
    const md = value ||
      (model.defaultValueOnEmpty && disabled && model.hideTabsOnReadOnly ?
        model.defaultValueOnEmpty : '');
    return html`
      <lapp-md-editor
        class=${cls}
        .name=${name}
        style=${ifDefined(model.style)}
        .flavour=${model.flavour}
        .hideTabsOnReadOnly=${model.hideTabsOnReadOnly || false}
        .readOnly=${disabled}
        .writeLabel=${label}
        .placeholder=${placeholder}
        .helper=${model.helper!}
        .pure=${!!model.pure}
        .required=${!!model.required}
        .maxLength=${model.maxLength!}
        .minLength=${model.minLength!}
        rows=${ifDefined(model.rows) || nothing as any}
        resize=${ifDefined(model.resize) || undefined}
        .md=${md}
        @input=${onInputFact('md')}
      ></lapp-md-editor>
    `;
  }

  function renderUpload(model: OComponentUpload) {
    return html`
      <lapp-upload
        class=${cls}
        .name=${name}
        style=${ifDefined(model.style)}
        .readOnly=${disabled}
        .writeLabel=${label}
        .supportingText=${model.helper}
        .required=${!!model.required}
        .store=${model.store!}
        .path=${model.path!}
        .maxFiles=${model.maxFiles!}
        .accept=${model.accept}
        .maxFileSize=${model.maxFileSize}
        .useFirestore=${!!model.useFirestore}
        .fieldPath=${model.fieldPath || name}
      ></lapp-upload>
      `;
  }

  function renderUploadImage(model: OComponentUploadImage) {
    const image = html`<lapp-upload-image
      class=${cls}
      .name=${name}
      style=${ifDefined(model.style)}
      .readonly=${disabled}
      .writeLabel=${label}
      .helper=${model.helper}
      .required=${!!model.required}
      .store=${model.store!}
      .path=${model.path!}
      .accept=${model.accept!}
      .maxFileSize=${model.maxFileSize!}
      .fieldPath=${model.fieldPath || name}
      .buttonLabel=${model.buttonLabel || nothing as any}
      ></lapp-upload-image>`

    const imageFirebase = html`<lapp-upload-image-firebase
      class=${cls}
      .name=${name}
      style=${ifDefined(model.style)}
      .readonly=${disabled}
      .writeLabel=${label}
      .helper=${model.helper}
      .required=${!!model.required}
      .store=${model.store!}
      .path=${model.path!}
      .accept=${model.accept!}
      .maxFileSize=${model.maxFileSize!}
      .fieldPath=${model.fieldPath || name}
      .buttonLabel=${model.buttonLabel || nothing as any}
     ></lapp-upload-image-firebase>`
    return model.useFirestore ? image : imageFirebase;
  }

  function renderRadioSlider(model: OComponentSlider) {
    return html`
      <lapp-slider-field
          class=${cls}
          .name=${name}
          style=${ifDefined(model.style)}
          ?disabled=${disabled}
          .label=${label}
          .ticks=${model.ticks!}
          .labeled=${model.labeled!}
          .supportingText=${model.helper}
          .required=${!!model.required}
          .value=${value || ''}
          @change=${onInputFact('value')}
          .min=${model.min}
          .max=${model.max}
          step=${ifDefined(model.step)}
        ></lapp-slider-field>
   `;
  }

  function renderRadioSelect(model: OComponentSelect) {
    return html`
      <lapp-select
        quick
        class=${cls}
        .name=${name}
        style=${ifDefined(model.style)}
        .icon=${model.icon}
        .readOnly=${disabled}
        .label=${label}
        .supportingText=${model.helper!}
        .required=${!!model.required}
        .value=${value || ''}
        @input=${onInputFact('value')}
        >${(model.items || []).map(item => html`
          <md-select-option .value=${item.code} ?selected=${item.code === value}>
            <div slot="headline">${item.label}</div>
          </md-select-option>`)}
      </lapp-select >
      `;
  }

  function renderMultiSelect(model: OComponentSelect) {
    return html`
    <vaadin-multi-select-combo-box
      class=${cls}
      .name=${name}
      style=${ifDefined(model.style)}
      .items=${model.items}
      .selectedItems=${(model.items || []).filter(item => (value || []).indexOf(item.code) > -1)}
      @change=${onInputFact('selectedValue')}
      .itemLabelPath=${'label'}
      .itemIdPath=${'code'}
      .itemValuePath=${'code'}
      .itemColorPath=${'color'}
      .icon=${model.icon}
      ?disabled=${disabled}
      .label=${label}
      .helperText=${model.helper}
      .required=${!!model.required}
      >
    </vaadin-multi-select-combo-box>
  `;
  }

  function renderCheckbox(model: OComponentBoolean) {
    return html`
      <label class=${cls}>
        <md-checkbox touch-target="wrapper" 
        aria-label=${label || ''}
        .name=${name}
        style=${ifDefined(model.style)}
        .checked=${value}
        ?disabled=${disabled}
        @change=${onInputFact('checked')} 
        ></md-checkbox>
        ${label || ''}
      </label>
      `;
  }

  function renderSwitch(model: OComponentBoolean) {
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

  function renderCheckboxGroup(model: OComponentCheckboxGroup) {
    return html`
      <lapp-choice-checkbox
        class=${cls}
        .name=${name}
        style=${ifDefined(model.style)}
        .icon=${model.icon}
        .readOnly=${disabled}
        .label=${label}
        .supportingText=${model.helper}
        .required=${!!model.required}
        .selected=${value || ''}
        .options=${model.items}
        @selected-changed=${onInputFact('selected')}
      ></lapp-choice-checkbox>
      `;
  }

  function renderRadioGroup(model: OComponentRadioGroup) {
    return html`
      <lapp-choice-radio
        class=${cls}
        .name=${name}
        style=${ifDefined(model.style)}
        .icon=${model.icon}
        .readOnly=${disabled}
        .label=${label}
        .supportingText=${model.helper}
        .required=${!!model.required}
        .selected=${value || ''}
        .options=${model.items}
        @selected-changed=${onInputFact('selected')}
      ></lapp-choice-radio>
      `;
  }

  function renderStar(model: OComponentStar) {
    return html`
      <lapp-choice-star
        class=${cls}
        .name=${name}
        style=${ifDefined(model.style)}
        .readOnly=${disabled}
        .label=${label}
        .supportingText=${model.helper}
        .required=${!!model.required}
        .selected=${value || ''}
        .allowNoStar=${model.allowNoStar || false} 
        starNumber=${ifDefined(model.starNumber)}
        @selected-changed=${onInputFact('selected')}
      ></lapp-choice-star>
    `;
  }


}
