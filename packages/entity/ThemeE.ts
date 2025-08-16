import { Model, RenderConfig } from '@lit-app/model';
import EntityFact from '@lit-app/model/src/entityFact';
import '@lit-app/persistence-shell/meta-data';
import { html, nothing } from 'lit';
import('@material/web/switch/switch.js');
import('@material/web/divider/divider.js');


import type { ThemeSettingsT, ThemeT } from './ThemeM.js';
// import customerEntityHolder from '../../page/customer-entity-holder';
// import { actions } from './Customer';


const theme: Model<ThemeT> = {
  primary: {
    label: 'Primary Color',
    component: 'textfield'
  },
  secondary: {
    label: 'Secondary Color',
    component: 'textfield'
  },
  tertiary: {
    label: 'Tertiary Color',
    component: 'textfield'
  },
  background: {
    label: 'Background Color',
    component: 'textfield'
  },
  // text: {
  // label: 'Text Color',
  // },
} as const;


const model: Model<ThemeSettingsT> = {
  name: {
    label: 'Name',
    required: true,
    component: 'textfield',
    helper: 'Name for this theme',
  },
  description: {
    label: 'Description',
    component: 'textarea',
    helper: 'Description for this theme',
  },
  dark: theme as any,
  light: theme as any,
}

export default class ThemeSettings extends EntityFact<ThemeSettingsT, RenderConfig>({ model }) {

  static entityName = 'themeSettings'
  static icon = 'palette'

  override showActions = true;
  override showMetaData = true;
  // override host!: customerEntityHolder

  override renderTitle(data: ThemeSettingsT, _config: RenderConfig) {
    return html`
			<span class="ellipsis">${this.host.heading || 'Customer Theme'} ${data?.name ?? 'loading ...'}</span>
		`
  }

  override renderForm(_data: ThemeSettingsT, _config: RenderConfig) {
    return html`
		<section class="content layout vertical">
			<div class="layout horizontal wrap">
				${this.renderField('name')}
			</div>
			<div class="layout horizontal wrap">
				${this.renderField('description')}
			</div>
		</section>
		<md-divider class="m top bottom large"></md-divider>
		<section class="content">
		<h4 class="secondary">Light Theme</h4>
		<p>Set which language(s) are available for Teams.</p>
		${this.renderTheme(_data, _config)}
		</section>
		`
  }

  renderTheme(data: ThemeSettingsT, config: RenderConfig) {
    if (!data) { return nothing }
    return html`
			<div class="layout horizontal wrap">
			</div>`
  }
}
