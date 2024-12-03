import type { Model } from '@lit-app/model';
import EntityFact from '@lit-app/model/src/entityFact';
import type { Collection, CollectionI, RenderConfig } from '@lit-app/model/src/types';
import '@material/web/labs/badge/badge';
import { html, nothing } from 'lit';
import { LabelI } from './LabelM';
import getAdjustedColor from '@lit-app/shared/getAdjustedColor';
import '@material/web/chips/chip-set';
import '@material/web/chips/suggestion-chip';
// import { getSimpleAccess } from '../getAccess';
// import getGdsDataAccess from './getGdsDataAccess';
const model: Model<LabelI> = {
  title: {
    component: 'textfield',
    label: 'Title',
    required: true,
    helper: 'Label Title',
    maxLength: 80,
    table: {
      index: 1
    },
    grid: {
      index: 2,
      flex: 1,
      bodyRenderer: (item: LabelI) => {
        const backgroundColor = item.color || '#000000'
        const color = getAdjustedColor(backgroundColor)

        return html`<md-chip-set><md-suggestion-chip style="background:${backgroundColor};--md-sys-color-on-surface-variant: ${color}">${item.title}</md-suggestion-chip></md-chip-set>`
      }
    }
  },
  description: {
    component: 'textarea',
    label: 'Description',
    grid: {
      index: 2,
      flex: 2
    },
    table: {
      index: 4
    }
  },
  starred: {
    component: 'checkbox',
    label: 'Starred',
    table: {
      index: 2
    },
    grid: {
      index: 0,
      flex: 0,
      width: '100px',
      bodyRenderer: (item: LabelI) => {
        return item.starred ? html`<lapp-icon style="color: var(--color-secondary);">star</lapp-icon>` : html``
      }
    }
  },


  color: {
    component: 'textfield',
    label: 'Color',
    type: 'color',

    table: {
      index: 0
    },

  },
}

const actions = {
}

export default class Label extends
  EntityFact<LabelI, RenderConfig, typeof actions>({model, actions}) {

  static entityName = 'label'
  static title = 'label'
  static icon = 'label';

  override showActions = true

  // static override getAccess: GetAccess = getSimpleAccess
  // static override accessDataGetter = getGdsDataAccess


  override renderArrayTitle(data: Collection<LabelI>, config: RenderConfig) {
    const onCreate = () => this.create({ title: 'new label' })
    const createAction = config.entityAccess?.canEdit ? html`<md-outlined-button @click=${onCreate}>Create new Label</md-outlined-button>` : nothing
    return html`<span class="flex">List of Labels <span style="position:relative;"><md-badge .value=${String(data.length || 0)}></md-badge></span></span>${createAction}`
  }

  override renderGridColumns(config: RenderConfig) {
    return html`
       ${super.renderGridColumns(config)}
    `
  }
  override renderGridDetail(
    data: CollectionI<LabelI>, _config: RenderConfig, _model: any, _grid: any
  ) {
    return html`
      <db-ref-entity .Entity=${Label} subPath=${data.$id}>
        <lapp-entity-holder .level=${4}></lapp-entity-holder>
      </db-ref-entity>
      
    `
  }
  override renderForm(_data: LabelI, _config: RenderConfig) {
    return html`
    <div class="layout vertical">
      <div class="layout horizontal gap ">
        ${this.renderField('title')}
        ${this.renderField('color', { style: 'max-width: 100px;min-width: unset' })}
        ${this.renderField('starred')}
      </div>
      ${this.renderField('description')}
      </div>
    `
  }
}

