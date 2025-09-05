import { githubHighlight, githubMd } from '@lit-app/shared/styles';
import md from '@lit-app/shared/styles/md.js';
import { css, html, LitElement, nothing } from "lit";
import { property, query, state } from 'lit/decorators.js';
import { cache } from 'lit/directives/cache.js';
import { choose } from 'lit/directives/choose.js';
import { classMap } from 'lit/directives/class-map.js';
import { ConsumeAccessibilityMixin } from '../../mixin/context-accessibility-mixin';
;

import('@lit-app/cmp/youtube/youtube.js');
import('@preignition/gitbook-parser/src/gitbook-hint.js');

import '@github/markdown-toolbar-element';
import '@lit-app/cmp/icon/icon.js';
import '@lit-app/cmp/toolbar/toolbar.js';
import '@lit-app/cmp/tooltip/tooltip.js';
import { parse } from '@lit-app/shared/md/index.js';
import { HTMLEvent } from "@lit-app/shared/types.js";
import { MdMenu } from "@material/web/menu/menu.js";
import { MdTabs } from "@material/web/tabs/tabs.js";
import { MdFilledTextField } from '@material/web/textfield/filled-text-field';
// import '../../toolbar/toolbar.js';
import('@material/web/tabs/tabs.js');
import('@material/web/divider/divider.js');
import('@material/web/iconbutton/icon-button.js');
import('@material/web/menu/menu.js');
import('@material/web/menu/menu-item.js');

import('@material/web/tabs/secondary-tab.js');
import('../text-field')

type MdActionT = {
	format: string,
	newLine?: boolean,
	$1?: string,
	$2?: string,
	// when true, the action is only available in pure mode
	pure?: boolean
};
const mdActions = {
	h1: {
		pure: true,
		format: '# $1',
		newLine: true,
	},
	h2: {
		pure: true,
		format: '## $1',
		newLine: true,
	},
	h3: {
		pure: true,
		format: '### $1',
		newLine: true,
	},
	h4: {
		pure: true,
		format: '#### $1',
		newLine: true,
	},
	h5: {
		pure: true,
		format: '##### $1',
		newLine: true,
	},
	h6: {
		pure: true,
		format: '###### $1',
		newLine: true,
	},
	bold: {
		pure: true,
		format: '**$1**',
		$1: 'bold',
	},
	italic: {
		pure: true,
		format: '_$1_',
		$1: 'italic',
	},
	quote: {
		pure: true,
		format: '> $1',
		newLine: true,
		$1: 'quote text',
	},
	link: {
		pure: true,
		format: '[$2]($1)',
		$1: 'URL',
		$2: 'Link text'
	},
	listBulleted: {
		pure: true,
		format: '- $1',
		newLine: true,
	},
	listNumbered: {
		pure: true,
		format: '1. $1',
		newLine: true,
	},
	listCheck: {
		pure: true,
		format: '- [ ] $1',
		$1: 'task 1',
		newLine: true,
	},
	contentVideo: {
		format: '<lapp-youtube videoid="$1"></lapp-youtube>',
		$1: 'youtubeVideoId',
	},
	contentIcon: {
		format: '<lapp-icon no-fill>add_reaction</lapp-icon>',
	},
	contentTooltip: {
		format: '<lapp-tooltip text="$2">$1</lapp-tooltip>',
		$1: 'label',
		$2: 'tooltip message',
	},
	contentTable: {
		pure: true,
		format: `| Header | Header | Header |
|--------|--------|--------|
| Cell | Cell | Cell |
| Cell | Cell | Cell |
| Cell | Cell | Cell | `,
		newLine: true,
	},
	contentSummary: {
		format: `<details>
<summary>$1</summary>
  Something small enough to escape casual notice.
</details>
`,
		$1: 'Details',
	},
	contentInfoHint: {
		format: `<gitbook-hint type="info">$1</gitbook-hint>`,
		$1: 'Info hint',
		newLine: true,
	},
	contentSuccessHint: {
		format: `<gitbook-hint type="success">$1</gitbook-hint>`,
		$1: 'Success hint',
		newLine: true,
	},
	contentWarningHint: {
		format: `<gitbook-hint type="warning">$1</gitbook-hint>`,
		$1: 'Warning hint',
		newLine: true,
	},
	layout2Col: {
		format: `<div class="layout flex horizontal wrap">
<div class="flex flex-1">
$1
</div>
<div class="flex flex-1">
Second Column
</div>
</div>`,
		newLine: true,
		$1: 'First Column',
	},
	layout3Col: {
		format: `<div class="layout flex horizontal wrap">
<div class="flex flex-1">
$1
</div>
<div class="flex flex-1">
Second Column
</div>
<div class="flex flex-1">
Third Column
</div>
</div>`,
		newLine: true,
		$1: 'First Column',
	},
	layout2colFixed: {
		format: `<div class="layout flex horizontal wrap">
<div style="width: 250px;">
$1
</div>
<div class="flex flex-1">
Second Column
</div>
</div>`,
		newLine: true,
		$1: 'First Column',
	},

	layoutSpacingMedium: {
		format: `<div style="padding: var(--space-medium, 16px);">$1</div>`,
		newLine: true,
		$1: 'Content',
	},
	layoutSpacingLarge: {
		format: `<div style="padding: var(--space-xxx-large, 48px);">$1</div>`,
		newLine: true,
		$1: 'Content',
	},
	colorPrimary: {
		format: `<div style="background-color: var(--color-primary); color: var(--color-on-primary);">$1</div>`,
		$1: 'Content',
		newLine: true,
	},
	colorSecondary: {
		format: `<div style="background-color: var(--color-secondary); color: var(--color-on-secondary);">$1</div>`,
		$1: 'Content',
		newLine: true,
	},
	colorTertiary: {
		format: `<div style="background-color: var(--color-tertiary); color: var(--color-on-tertiary);">$1</div>`,
		$1: 'Content',
		newLine: true,
	},
	colorSuccess: {
		format: `<div style="background-color: var(--color-success); color: var(--color-on-success);">$1</div>`,
		$1: 'Success',
		newLine: true,
	},
	colorWarning: {
		format: `<div style="background-color: var(--color-warning); color: var(--color-on-warning);">$1</div>`,
		$1: 'Warning',
		newLine: true,
	},
	colorContainerPrimary: {
		format: `<div style="background-color: var(--color-primary-container); color: var(--color-on-primary-container);">$1</div>`,
		$1: 'Content',
		newLine: true,
	},
	colorContainerSecondary: {
		format: `<div style="background-color: var(--color-secondary-container); color: var(--color-on-secondary-container);">$1</div>`,
		$1: 'Content',
		newLine: true,
	},
	colorContainerTertiary: {
		format: `<div style="background-color: var(--color-tertiary-container); color: var(--color-on-tertiary-container);">$1</div>`,
		$1: 'Content',
		newLine: true,
	},
	colorContainerSuccess: {
		format: `<div style="background-color: var(--color-success-container); color: var(--color-on-success-container);">$1</div>`,
		$1: 'Success',
		newLine: true,
	},
	colorContainerWarning: {
		format: `<div style="background-color: var(--color-warning-container); color: var(--color-on-warning-container);">$1</div>`,
		$1: 'Warning',
		newLine: true,
	},
	a11yMenu: {
		format: `<a11y-menu context="survey"></a11y-menu>`,
		newLine: true,
	},
	a11yShowEr: {
		format: `<div class="show-when-easyread">$1</div>`,
		$1: 'Content to Show When Easy read is activated',
		newLine: true,
	},
	a11yHideEr: {
		format: `<div class="hide-when-easyread">$1</div>`,
		$1: 'Content to Hide When Easy read is activated',
		newLine: true,
	},
	a11yShowSl: {
		format: `<div class="show-when-signlanguage">$1</div>`,
		$1: 'Content to Show When Sign Language is activated',
		newLine: true,
	},
	a11yHideSl: {
		format: `<div class="hide-when-signlanguage">$1</div>`,
		$1: 'Content to Hide When Sign Language is activated',
		newLine: true,
	},
	a11yShowReadaloud: {
		format: `<div class="show-when-readaloud">$1</div>`,
		$1: 'Content to Show When Read Aloud is activated',
		newLine: true,
	},
	a11yHideReadaloud: {
		format: `<div class="hide-when-readaloud">$1</div>`,
		$1: 'Content to Hide When Read Aloud is activated',
		newLine: true,
	},
	a11yShowVoiceRecording: {
		format: `<div class="show-when-voicerecording">$1</div>`,
		$1: 'Content to Show When Voice Recording is activated',
		newLine: true,
	},
	a11yHideVoiceRecording: {
		format: `<div class="hide-when-voicerecording">$1</div>`,
		$1: 'Content to hide when Voice Recording is activated',
		newLine: true,
	},



} as const satisfies Record<string, MdActionT>

const positioning = 'popover';

function isMdAction(action: string): action is keyof typeof mdActions {
	return action in mdActions;
}

/**
 * A markdown editor that support translation and preview. It also has a toolbar with common markdown actions.
 * 
 * TODO: 
 * - localize
 * - better handle link action (check whether the text is an url or not)
 * - there is bug with the positioning of menu. We have `positioning=" fixed"` but it is making menu to 
 *   not scroll with the page. On the other hand, if we keep the default absolute positioning, the menu
 *   does not appear next to the menu button. And if we add a `span.relative` to make positioning work, then 
 *   the toolbar focus is wrong.
 *   `popover` positioning works better but it is not supported by Firefox.
 * 
 */
export default class lappMdEditor extends ConsumeAccessibilityMixin(LitElement) {

	static override shadowRootOptions: ShadowRootInit = {
		...LitElement.shadowRootOptions,
		delegatesFocus: true,
	};

	static override styles = [
		githubMd,
		...md,
		githubHighlight,
		css`
			:host {
				display: inline-flex;
				flex-direction: column;
				
			}
			md-tabs {
				/* width: fit-content;
				margin-left: 0px;
				margin-right: auto; */
				overflow: visible;
				/* we need z-index to make sure the tabs are working ok with dialog - 
				see https://github.com/material-components/material-web/issues/4948  */
				z-index: 0;
			}
			lapp-text-field {
				resize: vertical;
			}

			lapp-toolbar {
				--md-menu-item-one-line-container-height: 32px;
				--md-menu-item-two-line-container-height: 32px;
				--md-menu-item-bottom-space: 6px;
				--md-menu-item-top-space: 6px;
			}

			#container {
				min-height: 8rem;
				display: flex;
				position: relative;
				overflow: hidden;
				/* flex-direction: column; */
			}
	
			#container > * {
				flex: 1;
			}

			#top {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				/* smaller icons */
				--md-icon-button-icon-size: 20px;
				--md-icon-button-state-layer-height: 34px;
				--md-icon-button-state-layer-width: 34px;
			}

			#markdown {
				padding: 0px 16px;
				margin: 16px 0px 1px;
			}
	
			#markdown img {
				max-width: 100%;
				max-height: 100%;
				object-fit: contain;
			}
			.divider {
				align-self: center;
				margin: 0px var(--space-x-small, 8px);
			}

		`];

	/**
 	* markdown content to render
 	*/
	@property() md!: string;

	/**
 	* translation for markdown content
 	*/
	@property() mdtranslate!: string;

	// TODO: we should have another property for the translation as this is a native attribute. For instance `tr`
	@property({ type: Boolean }) override translate = false;
	/**
 	* When true, the editor is in pure mode. In pure mode no HTML is allowed.
 	*/
	@property({ type: Boolean }) pure = false;
	@property() translateIcon = 'translate';
	@property() writeLabel = 'Write';
	@property() previewLabel = 'Preview';
	@property() translateLabel = 'Translate';
	@property() translatePreviewLabel = 'Preview Translation';
	@property() helper = 'Write content here';
	@property() helperTranslate = 'Write your translation here';
	@property() placeholder = '';

	/**
	* The key to use to store the value in local storage
	* 
	* When this value is set, the value of the field will be saved to local storage when it changes 
	* and restored from local storage when the component is created.
	*/
	@property() storageKey!: string

	/**
 	* flavour of markdown to use for rendering
 	*/
	@property() flavour!: 'github' | undefined;
	@property({ type: Number }) cols = 3;
	@property({ type: Number }) rows = 3;
	@property({ type: Boolean }) required!: boolean;
	@property({ type: Boolean }) disabled!: boolean;
	@property({ type: Boolean, attribute: 'readonly' }) readOnly!: boolean;

	/**
 	* When true, tabs are hidden when the field is readonly and the preview is shown
 	*/
	@property({ type: Boolean, attribute: 'hide-tabs-on-read-only' }) hideTabsOnReadOnly!: boolean;
	/**
 	* When true, the toolbar is hidden
 	*/
	@property({ type: Boolean, attribute: 'hide-toolbar' }) hideToolbar: boolean = false;
	/**
 	* When true, the accessibility menu is displayed
 	*/
	@property({ type: Boolean, attribute: 'show-accessibility-menu' }) showAccessibilityMenu: boolean = false;

	@property({ type: Number, attribute: 'maxlength' }) maxLength!: number;
	@property({ type: Number, attribute: 'minlength' }) minLength!: number;

	@state() selected = 0;

	@query('lapp-text-field') _input!: MdFilledTextField;
	@query('md-tabs') _tabs!: HTMLElement;

	private get isEditorActive() {
		return this.selected === 0 || this.selected === 2
	}

	override render() {
		const onChange = (e: HTMLEvent<MdTabs>) => {
			this.selected = e.target?.activeTabIndex
		}

		const translateTabs = html`
			<md-secondary-tab ><lapp-icon slot="icon" .icon=${this.translateIcon}></lapp-icon>${this.translateLabel}</md-secondary-tab>
			<md-secondary-tab>${this.translatePreviewLabel}</md-secondary-tab>
		`
		const editor = this.renderEditor()
		const classes = { ...this.accessibilityClasses, 'markdown-body': this.flavour === 'github' };
		const selected = this.readOnly && this.hideTabsOnReadOnly ? 1 : this.selected;
		const viewer = html`<div id="markdown" class="markdown-body ${classMap(classes)}">${parse(selected === 1 ? this.md : this.mdtranslate)}</div>`

		const writeLabel = this.required ? this.writeLabel + '*' : this.writeLabel;
		const tabs = this.hideTabsOnReadOnly && this.readOnly ? nothing : html`
			<md-tabs .activeTabIndex=${this.selected} @change=${onChange}>
					<md-secondary-tab >${writeLabel}</md-secondary-tab>
					<md-secondary-tab >${this.previewLabel}</md-secondary-tab>
					${this.translate ? translateTabs : nothing}
      </md-tabs>`
		const toolbar = (this.hideToolbar || !this.isEditorActive) ? nothing : this.renderToolbar();

		return html`
			<div id="top"> 
				${tabs}
				<span class="flex"></span>
				${toolbar}
			</div>
			<div id="container">
				${cache(choose(selected, [
			[0, () => editor],
			[2, () => editor]
		], () => viewer))}
			</div>
		`
	}
	protected renderToolbar() {
		const onClick = (e: CustomEvent) => {
			const target = e.target as HTMLElement;
			let action = target.getAttribute('data-toolbar');
			if (!action) {
				const path = e.composedPath();
				for (const el of path) {
					if (el instanceof HTMLElement) {
						action = el.getAttribute('data-toolbar');
						if (action) break;
					}
				}
			}
			if (action && isMdAction(action)) {
				return this.handleAction(mdActions[action]);
			}
		}
		const onOpen = (id: string) => () => {
			const menu = this.shadowRoot?.querySelector(`#${id}`) as MdMenu;
			menu?.show();
		}

		const headerMenu = html`
			<md-icon-button @click=${onOpen('header-menu')} data-toolbar="" id="header-menu-button" aria-label="header" title="header">
				<lapp-icon >title</lapp-icon>
			</md-icon-button>
			<md-menu style="min-width: 150px" id="header-menu" anchor="header-menu-button" quick>
				<md-menu-item data-toolbar="h1">
					<lapp-icon slot="start">format_h1</lapp-icon>
					<div  slot="headline">Heading 1</div>
					<small slot="supporting-text">Ctrl + 1</small>
				</md-menu-item>
				<md-menu-item data-toolbar="h2">
					<lapp-icon slot="start">format_h2</lapp-icon>
					<div  slot="headline">Heading 2</div>
					<small slot="supporting-text">Ctrl + 2</small>
				</md-menu-item>
				<md-menu-item data-toolbar="h3">
					<lapp-icon slot="start">format_h3</lapp-icon>
					<div  slot="headline">Heading 3</div>
					<small slot="supporting-text">Ctrl + 3</small>
				</md-menu-item>
				<md-menu-item data-toolbar="h4">
					<lapp-icon slot="start">format_h4</lapp-icon>
					<div  slot="headline">Heading 4</div>
					<small slot="supporting-text">Ctrl + 4</small>
				</md-menu-item>
				<md-menu-item data-toolbar="h5">
					<lapp-icon slot="start">format_h5</lapp-icon>
					<div  slot="headline">Heading 5</div>
					<small slot="supporting-text">Ctrl + 5</small>
				</md-menu-item>
				<md-menu-item data-toolbar="h6">
					<lapp-icon slot="start">format_h6</lapp-icon>
					<div  slot="headline">Heading 6</div>
					<small slot="supporting-text">Ctrl + 6</small>
				</md-menu-item>
			</md-menu>
		`
		const contentMenu = html`
			<md-icon-button @click=${onOpen('add-content-menu')} data-toolbar="menu-content" id="add-content-menu-button" aria-label="add Content" title="add content">
				<lapp-icon no-fill>add_notes</lapp-icon>
			</md-icon-button>
			<md-menu style="min-width: 150px;" positioning="${positioning}" id="add-content-menu" anchor="add-content-menu-button" quick>
				<md-menu-item data-toolbar="contentTable">
					${contentTpl.table}
				</md-menu-item>
				${this.pure ? nothing : html`
				<md-menu-item data-toolbar="contentVideo">
					${contentTpl.video}
				</md-menu-item>
				<md-menu-item data-toolbar="contentTooltip">
					${contentTpl.tooltip}
				</md-menu-item>
				<md-menu-item data-toolbar="contentIcon">
					${contentTpl.icon}
				</md-menu-item>
				<md-menu-item data-toolbar="contentSummary">
					${contentTpl.summary}
				</md-menu-item>
				<md-divider></md-divider>
				<md-menu-item data-toolbar="contentInfoHint">
					${contentTpl.infoHint}
				</md-menu-item>
				<md-menu-item data-toolbar="contentSuccessHint">
					${contentTpl.successHint}
				</md-menu-item>
				<md-menu-item data-toolbar="contentWarningHint">
					${contentTpl.warningHint}
				</md-menu-item>`
			}
			</md-menu>
		`
		const layoutMenu = this.pure ? nothing : html`
			<md-icon-button @click=${onOpen('layout-menu')} data-toolbar="menu-layout" id="layout-menu-button" aria-label="layout" title="layout">
				<lapp-icon no-fill>space_dashboard</lapp-icon>
			</md-icon-button>
			<md-menu style="min-width: 150px;"  positioning="${positioning}" id="layout-menu" anchor="layout-menu-button" quick>
				<md-menu-item data-toolbar="layout2Col">
					${layoutTpl.layout2Col}
				</md-menu-item>
				<md-menu-item data-toolbar="layout3Col">
					${layoutTpl.layout3Col}
				</md-menu-item>
				<md-menu-item data-toolbar="layout2colFixed">
					${layoutTpl.layout2colFixed}
				</md-menu-item>
				<md-divider></md-divider>
				<md-menu-item data-toolbar="layoutSpacingMedium">
					${layoutTpl.layoutSpacingMedium}
				</md-menu-item>
				<md-menu-item data-toolbar="layoutSpacingLarge">
					${layoutTpl.layoutSpacingLarge}
				</md-menu-item>
			</md-menu>
		`
		const colorMenu = this.pure ? nothing : html`
			<md-icon-button @click=${onOpen('layout-color')} data-toolbar="menu-color" id="layout-color-button" aria-label="color" title="color">
				<lapp-icon no-fill>palette</lapp-icon>
			</md-icon-button>
			<md-menu style="min-width: 150px;" positioning="${positioning}" id="layout-color" anchor="layout-color-button" quick>
				<md-menu-item data-toolbar="colorPrimary">
					${colorTpl.primary}
				</md-menu-item>
				<md-menu-item data-toolbar="colorSecondary">
					${colorTpl.secondary}
				</md-menu-item>
				<md-menu-item data-toolbar="colorTertiary">
					${colorTpl.tertiary}
				</md-menu-item>
				<md-divider></md-divider>
				<md-menu-item data-toolbar="colorContainerPrimary">
					${colorTpl.containerPrimary}
				</md-menu-item>
				<md-menu-item data-toolbar="colorContainerSecondary">
					${colorTpl.containerSecondary}
				</md-menu-item>
				<md-menu-item data-toolbar="colorContainerTertiary">
					${colorTpl.containerTertiary}
				</md-menu-item>
				<md-divider></md-divider>
				<md-menu-item data-toolbar="colorSuccess">
					${colorTpl.success}
				</md-menu-item>
				<md-menu-item data-toolbar="colorWarning">
					${colorTpl.warning}
				</md-menu-item>
				<md-divider></md-divider>
				<md-menu-item data-toolbar="colorContainerSuccess">
					${colorTpl.containerSuccess}
				</md-menu-item>
				<md-menu-item data-toolbar="colorContainerWarning">
					${colorTpl.containerWarning}
				</md-menu-item>
			</md-menu>		
		`
		const accessibilityMenu = !this.pure && this.showAccessibilityMenu ? html`
				<span class="divider">|</span>
				<md-icon-button @click=${onOpen('accessibility-menu')} data-toolbar="menu-accessibility" id="accessibility-menu-button" aria-label="accessibility" title="accessibility">
					<lapp-icon no-fill>accessibility_new</lapp-icon>
				</md-icon-button>
				<md-menu style="min-width: 150px" positioning="${positioning}" id="accessibility-menu" anchor="accessibility-menu-button" quick>
					<md-menu-item data-toolbar="a11yMenu">
						${a11yTpl.menu}
					</md-menu-item>
					<md-divider></md-divider>
					<md-menu-item data-toolbar="a11yShowEr">
						${a11yTpl.showEr}
					</md-menu-item>
					<md-menu-item data-toolbar="a11yHideEr">
						${a11yTpl.hideEr}
					</md-menu-item>
					<md-divider></md-divider>
					<md-menu-item data-toolbar="a11yShowSl">
						${a11yTpl.showSl}
					</md-menu-item>
					<md-menu-item data-toolbar="a11yHideSl">
						${a11yTpl.hideSl}
						<div  slot="headline">Hide When Sign Language</div>
					</md-menu-item>
					<md-divider></md-divider>
					<md-menu-item data-toolbar="a11yShowReadaloud">
						${a11yTpl.showReadaloud}
					</md-menu-item>
					<md-menu-item data-toolbar="a11yHideReadaloud">
						${a11yTpl.hideReadaloud}
					</md-menu-item>
					<md-divider></md-divider>
					<md-menu-item data-toolbar="a11yShowVoiceRecording">
						${a11yTpl.showVoiceRecording}
					</md-menu-item>
					<md-menu-item data-toolbar="a11yHideVoiceRecording">
						${a11yTpl.hideVoiceRecording}
					</md-menu-item>
				</md-menu>
				` : nothing;
		const slotMenuContent = this.pure ? nothing : html`
			<md-menu-item slot="menu-content" data-toolbar="contentVideo">
				${contentTpl.video}
			</md-menu-item>
			<md-menu-item slot="menu-content" data-toolbar="contentTooltip">
				${contentTpl.tooltip}
			</md-menu-item>
			<md-menu-item slot="menu-content" data-toolbar="contentTable">
				${contentTpl.table}
			</md-menu-item>
			<md-menu-item slot="menu-content" data-toolbar="contentSummary">
				${contentTpl.summary}
			</md-menu-item>
			<md-menu-item slot="menu-content" data-toolbar="contentInfoHint">
				${contentTpl.infoHint}
			</md-menu-item>
			<md-menu-item slot="menu-content" data-toolbar="contentSuccessHint">
				${contentTpl.successHint}
			</md-menu-item>
			<md-menu-item slot="menu-content" data-toolbar="contentWarningHint">
				${contentTpl.warningHint}
			</md-menu-item>
			<md-divider slot="menu-content"></md-divider>
			`;
		const slotMenuLayout = this.pure ? nothing : html`
			<md-menu-item slot="menu-layout" data-toolbar="layout2Col">
				${layoutTpl.layout2Col}
			</md-menu-item>
			<md-menu-item slot="menu-layout" data-toolbar="layout3Col">
				${layoutTpl.layout3Col}
			</md-menu-item>
			<md-menu-item slot="menu-layout" data-toolbar="layout2colFixed">
				${layoutTpl.layout2colFixed}
			</md-menu-item>
			<md-divider slot="menu-layout"></md-divider>
			`;
		const slotMenuAccessibility = this.pure ? nothing : html`
			<md-menu-item slot="menu-accessibility" data-toolbar="a11yShowEr">
				${a11yTpl.showEr}
			</md-menu-item>
			<md-menu-item slot="menu-accessibility" data-toolbar="a11yHideEr">
				${a11yTpl.hideEr}
			</md-menu-item>
			<md-menu-item slot="menu-accessibility" data-toolbar="a11yShowSl">
				${a11yTpl.showSl}
			</md-menu-item>
			<md-menu-item slot="menu-accessibility" data-toolbar="a11yHideSl">
				${a11yTpl.hideSl}
			</md-menu-item>
			`;
		const slotMenuColor = this.pure ? nothing : html`
			<md-menu-item slot="menu-color" data-toolbar="colorPrimary">
				${colorTpl.primary}
			</md-menu-item>
			<md-menu-item slot="menu-color" data-toolbar="colorSecondary">
				${colorTpl.secondary}
			</md-menu-item>
			<md-menu-item slot="menu-color" data-toolbar="colorTertiary">
				${colorTpl.tertiary}
			</md-menu-item>
			<md-menu-item slot="menu-color" data-toolbar="colorSuccess">
				${colorTpl.success}
			</md-menu-item>
			<md-menu-item slot="menu-color" data-toolbar="colorWarning">
				${colorTpl.warning}
			</md-menu-item>
			${this.showAccessibilityMenu ? html`
				<md-divider slot="menu-color"></md-divider>
				` : nothing}
			`;


		return html`
		<lapp-toolbar style="position:relative;" @click=${onClick}>
				${headerMenu}
				<md-icon-button  data-toolbar="bold" aria-label="format bold" title="bold / ctrl + b">
					<lapp-icon >format_bold</lapp-icon>
				</md-icon-button>
				<md-icon-button  data-toolbar="italic" aria-label="format italic" title="italic / ctrl + i">
				<lapp-icon >format_italic</lapp-icon>
				</md-icon-button>
				<md-icon-button  data-toolbar="quote" aria-label="format quote" title="quote / ctrl + q">
					<lapp-icon >format_indent_increase</lapp-icon>
				</md-icon-button>
				<md-icon-button  data-toolbar="link" aria-label="link" title="link / ctrl + l">
					<lapp-icon >link</lapp-icon>
				</md-icon-button>
				<span class="divider">|</span>
				<md-icon-button  data-toolbar="listBulleted" aria-label="list bullet point" title="list bullet point / ctrl + u">
					<lapp-icon >format_list_bulleted</lapp-icon>
				</md-icon-button>
				<md-icon-button  data-toolbar="listNumbered" aria-label="list numbered" title="list numbered / ctrl + o">
					<lapp-icon >format_list_numbered</lapp-icon>
				</md-icon-button>
				<md-icon-button  data-toolbar="listCheck" aria-label="task list" title="task list">
					<lapp-icon >checklist</lapp-icon>
				</md-icon-button>
				<span class="divider">|</span>
				${contentMenu}
				${layoutMenu}
				${colorMenu}
				${accessibilityMenu}

				<!-- MenuSLot -->
				<md-menu-item  slot="italic" data-toolbar="italic" aria-label="format italic" title="italic">
					<lapp-icon slot="start">format_italic</lapp-icon>
					<div  slot="headline">Italic</div>
				</md-menu-item>
				<md-menu-item  slot="quote" data-toolbar="quote" aria-label="format quote" title="quote">
					<lapp-icon slot="start">format_indent_increase</lapp-icon>
					<div  slot="headline">Quote</div>
				</md-menu-item>
				<md-menu-item  slot="link" data-toolbar="link" aria-label="link" title="link">
					<lapp-icon slot="start">link</lapp-icon>
					<div  slot="headline">Link</div>
				</md-menu-item>
				<md-menu-item  slot="list_bulleted" data-toolbar="listBulleted" aria-label="list bullet point" title="list bullet point">
				<lapp-icon slot="start">format_list_bulleted</lapp-icon>
					<div  slot="headline">list Bullet Point</div>
				</md-menu-item>
				<md-menu-item  slot="list_numbered" data-toolbar="listNumbered" aria-label="list numbered" title="list numbered">
					<lapp-icon slot="start">format_list_numbered</lapp-icon>
					<div  slot="headline">list Numbered</div>
				</md-menu-item>
				<md-menu-item  slot="list_check" data-toolbar="listCheck" aria-label="task list" title="task list checkbox">
					<lapp-icon slot="start">checklist</lapp-icon>
					<div  slot="headline">Task List</div>
				</md-menu-item>
				<md-divider slot="list_check"></md-divider>
				${slotMenuContent}
				${slotMenuLayout}
				${slotMenuColor}
				${slotMenuAccessibility}
		</lapp-toolbar>

		`
	}
	protected renderEditor() {
		const value = this.selected === 0 ? this.md : this.mdtranslate
		const readonly = this.selected === 0 && this.translate ? true : this.readOnly;

		return html`<lapp-text-field 
			id="textarea"
			type="textarea"
			droppable
			?required=${this.required}
			?disabled=${this.disabled}
			?readonly=${readonly}
		  .storageKey=${this.storageKey}
			.value=${value || ''} 
			.cols=${this.cols}
			.rows=${this.rows}
			.placeholder=${this.placeholder}
			.maxLength=${this.maxLength}
			.minLength=${this.minLength}
			.supportingText=${this.renderSupportingText() as unknown as string}
			@input=${this.onValueChanged}
			@keydown=${this.onKeyDown}
			>
		</lapp-text-field>`;
	}
	protected renderSupportingText() {
		return html`
		<div style="gap: 4px; display:flex; flex: 1; align-items: center;">${this.selected === 2 ?
				this.helperTranslate :
				this.helper} 
			<span style="flex:1;"></span>
			<span><a rel="noopener" href="https://en.wikipedia.org/wiki/Markdown" target="_blank">Markdown</a> is supported. </span>
			${this.renderSupportingAction()}
		</div>
		`
	}
	/** aimed at being overridden to display specific actions */
	protected renderSupportingAction() {
		return html``;
	}

	override focus() {
		if (this.isEditorActive) {
			this._input.focus();
			return
		}
		this._tabs.focus();
	}

	onValueChanged(e: HTMLEvent<MdFilledTextField>) {
		const value = e.target.value;
		if (this.selected === 0) {
			this.md = value;
			this.dispatchEvent(new CustomEvent('md-changed', { detail: { value: this.md }, bubbles: true, composed: true }));
		}
		if (this.selected === 2) {
			this.mdtranslate = value;
			this.dispatchEvent(new CustomEvent('mdtranslate-changed', { detail: { value: this.mdtranslate }, bubbles: true, composed: true }));
		}
	}
	onKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			this.handleEnterKeydown(e);
		}
		if (e.ctrlKey) {
			this.handleCtrlKeydown(e);
		}
	}

	private handleCtrlKeydown(event: KeyboardEvent) {
		let preventDefault = false;

		switch (event.key) {
			case 'b':
				preventDefault = true
				this.handleAction(mdActions.bold);
				break;
			case 'i':
				preventDefault = true
				this.handleAction(mdActions.italic);
				break;
			case 'q':
				preventDefault = true
				this.handleAction(mdActions.quote);
				break;
			case 'k':
				preventDefault = true
				this.handleAction(mdActions.link);
				break;
			case '1':
				preventDefault = true
				this.handleAction(mdActions.h1);
				break;
			case '2':
				preventDefault = true
				this.handleAction(mdActions.h2);
				break;
			case '3':
				preventDefault = true
				this.handleAction(mdActions.h3);
				break;
			case '4':
				preventDefault = true
				this.handleAction(mdActions.h4);
				break;
			case '5':
				preventDefault = true
				this.handleAction(mdActions.h5);
				break;
			case '6':
				preventDefault = true
				this.handleAction(mdActions.h6);
				break;
			case 'u':
				preventDefault = true
				this.handleAction(mdActions.listBulleted);
				break;
			case 'o':
				preventDefault = true
				this.handleAction(mdActions.listNumbered);
				break;
		}
		if (preventDefault) {
			event.preventDefault();
		}
	}

	/**
		* Handles Enter keydown event and adds a new line for lists.
		*/
	private handleEnterKeydown(event: KeyboardEvent) {
		const { selectionStart, value } = this.inputOrTextarea;
		const startOfParagraph = value.lastIndexOf("\n", selectionStart - 2);
		const currentParagraph = value.slice(startOfParagraph + 1, selectionStart);
		const olRegex = /^([1-9][0-9]*). [^\n ]+/;
		const isOl = currentParagraph.match(olRegex);
		const ulRegex = /- [^\n ]+/;
		const isUl = currentParagraph.match(ulRegex);
		const isEmptyUlOrOl = /^(([1-9][0-9]*).|-) +$/.test(currentParagraph);
		if (isOl || isUl || isEmptyUlOrOl) {
			event.preventDefault();
			const symbol = isOl ? `\n${Number(isOl[1]) + 1}. ` : "\n- ";
			this.insertAtCaret(symbol);
		}
	};

	private handleAction(action: MdActionT) {
		const { format, newLine, $1, $2 } = action;
		this.insertFormatAtCaret(format, newLine, $1, $2);
		return;
	}

	protected get inputOrTextarea(): HTMLTextAreaElement {
		// @ts-expect-error - inputOrTextarea is private
		return this._input.inputOrTextarea;
	}
	protected dispatchInput() {
		this.inputOrTextarea?.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
	}

	private insertFormatAtCaret(format: string, newLine?: boolean, defaultText?: string, defaultText2?: string) {
		let { selectionStart, selectionEnd } = this.inputOrTextarea!;
		const { value } = this.inputOrTextarea!;
		if (!selectionStart) {
			selectionStart = 0;
		}
		if (!selectionEnd) {
			selectionEnd = 0;
		}
		console.log('selectionStart', selectionStart, selectionEnd, value);
		let text = value.substring(selectionStart, selectionEnd);
		if (!text && defaultText) {
			{
				text = defaultText;
			}
		}
		let front = value.substring(0, selectionStart);
		let back = value.substring(selectionEnd, value.length);
		if (newLine) {
			const after = value.substring(selectionEnd);
			const isStartOfLine = front.endsWith('\n') || front === '';
			const isEndOfLine = after.startsWith('\n') || after === '';
			if (!isStartOfLine) {
				front += '\n';
			}
			if (!isEndOfLine) {
				back = '\n' + back;
			}
		}
		const newText = format.replace('$1', text);
		this._input.value = front + newText + back;
		this._input.setSelectionRange(selectionStart, selectionStart + newText.length);
		if (format.includes('$2')) {
			const newTextWithoutPlaceholder = newText.replace('$2', defaultText2 || '');
			this._input.value = front + newTextWithoutPlaceholder + back;
			const caretPos = front.length + newText.indexOf('$2');
			this._input.setSelectionRange(caretPos, caretPos);
		} else {
			const caretPos = front.length + newText.length;
			this._input.setSelectionRange(caretPos, caretPos);
		}
		this.inputOrTextarea?.focus();
		this.dispatchInput();
	}

	insertAtCaret(text: string) {
		const textArea = this.inputOrTextarea!;
		const scrollPos = textArea.scrollTop;
		let { selectionEnd } = textArea;
		if (!selectionEnd) {
			selectionEnd = 0;
		}
		const { selectionStart, value } = textArea;
		let caretPos = selectionStart || undefined;

		const front = (value).substring(0, caretPos);
		const back = (value).substring(selectionEnd, value.length);
		textArea.value = front + text + back;
		caretPos = (caretPos || 0) + text.length;
		this._input.setSelectionRange(caretPos, caretPos);
		textArea.focus();
		textArea.scrollTop = scrollPos;
		this.dispatchInput();
	}

}

/**
 * Template for the toolbar
 */
const contentTpl = {
	video: html`<lapp-icon slot="start" no-fill>movie</lapp-icon><div slot="headline">Video</div>`,
	tooltip: html`<lapp-icon slot="start" no-fill>tooltip</lapp-icon><div slot="headline">Tooltip</div>`,
	table: html`<lapp-icon slot="start">table</lapp-icon><div slot="headline">Table</div>`,
	icon: html`
		<lapp-icon slot="start" no-fill>add_reaction</lapp-icon><div  slot="headline">Icon</div>
		<div slot="supporting-text"><a target="_blank" href="https://fonts.google.com/icons?icon.set=Material+Symbols&icon.size=24">See Icon List</a></div>`,
	summary: html`<lapp-icon slot="start" no-fill>expand_circle_right</lapp-icon><div slot="headline">Summary</div>`,
	infoHint: html`<lapp-icon slot="start" no-fill style="color: var(--color-primary)">info</lapp-icon><div slot="headline">Info Hint</div>`,
	successHint: html`<lapp-icon slot="start" no-fill style="color: var(--color-success)">info</lapp-icon><div slot="headline">Success Hint</div>`,
	warningHint: html`<lapp-icon slot="start" no-fill style="color: var(--color-warning)">info</lapp-icon><div slot="headline">Warning Hint</div>`
}
const layoutTpl = {
	layout2Col: html`<lapp-icon slot="start" no-fill>view_column_2</lapp-icon><div  slot="headline">2 Columns</div>`,
	layout3Col: html`<lapp-icon slot="start" no-fill>view_column</lapp-icon><div  slot="headline">3 Columns</div>`,
	layout2colFixed: html`<lapp-icon slot="start" no-fill>transition_slide</lapp-icon><div  slot="headline">2 Columns Fixed</div>`,
	layoutSpacingMedium: html`<lapp-icon slot="start" no-fill>padding</lapp-icon><div  slot="headline">Medium Spacing</div>`,
	layoutSpacingLarge: html`<lapp-icon slot="start" no-fill>padding</lapp-icon><div  slot="headline">Large Spacing</div>`,
}

const sizing = 'padding: 3px; box-sizing: border-box';
const colorTpl = {
	primary: html`
		<lapp-icon slot="start" style="background-color: var(--color-primary); color: var(--color-on-primary); ${sizing}" no-fill>format_color_fill</lapp-icon>
		<div  slot="headline">Primary</div>
	`,
	secondary: html`
	<lapp-icon slot="start" style="background-color: var(--color-secondary); color: var(--color-on-secondary); ${sizing}" no-fill>format_color_fill</lapp-icon>
	<div  slot="headline">Secondary</div>
`,
	tertiary: html`
	<lapp-icon slot="start" style="background-color: var(--color-tertiary); color: var(--color-on-tertiary); ${sizing}" no-fill>format_color_fill</lapp-icon>
	<div  slot="headline">Tertiary</div>
`,
	success: html`
	<lapp-icon slot="start" style="background-color: var(--color-success); color: var(--color-on-success); ${sizing}" no-fill>format_color_fill</lapp-icon>
	<div  slot="headline">Success</div>
`,
	warning: html`
	<lapp-icon slot="start" style="background-color: var(--color-warning); color: var(--color-on-warning); ${sizing}" no-fill>format_color_fill</lapp-icon>
	<div  slot="headline">Warning</div>
`,
	containerPrimary: html`
	<lapp-icon slot="start" style="background-color: var(--color-primary-container); color: var(--color-on-primary-container); ${sizing}" no-fill>format_color_fill</lapp-icon>
	<div  slot="headline">Primary Container</div>
`,
	containerSecondary: html`
	<lapp-icon slot="start" style="background-color: var(--color-secondary-container); color: var(--color-on-secondary-container); ${sizing}" no-fill>format_color_fill</lapp-icon>
	<div  slot="headline">Secondary Container</div>
`,
	containerTertiary: html`
	<lapp-icon slot="start" style="background-color: var(--color-tertiary-container); color: var(--color-on-tertiary-container); ${sizing}" no-fill>format_color_fill</lapp-icon>
	<div  slot="headline">Tertiary Container</div>
`,
	containerSuccess: html`
	<lapp-icon slot="start" style="background-color: var(--color-success-container); color: var(--color-on-success-container); ${sizing}" no-fill>format_color_fill</lapp-icon>
	<div  slot="headline">Success Container</div>
`,
	containerWarning: html`
	<lapp-icon slot="start" style="background-color: var(--color-warning-container); color: var(--color-on-warning-container); ${sizing}" no-fill>format_color_fill</lapp-icon>
	<div  slot="headline">Warning Container</div>
`,
}
const a11yTpl = {
	menu: html`<lapp-icon slot="start" no-fill>settings_accessibility</lapp-icon><div  slot="headline">Accessibility Menu</div>`,
	showEr: html`<lapp-icon slot="start" no-fill>sentiment_satisfied</lapp-icon><div  slot="headline">Show When Easy Read</div>`,
	hideEr: html`<lapp-icon slot="start" no-fill>hide_source</lapp-icon><div  slot="headline">Hide When Easy Read</div>`,
	showSl: html`<lapp-icon slot="start" no-fill>sign_language</lapp-icon><div  slot="headline">Show When Sign Language</div>`,
	hideSl: html`<lapp-icon slot="start" no-fill>hide_source</lapp-icon><div  slot="headline">Hide When Sign Language</div>`,
	showReadaloud: html`<lapp-icon slot="start" no-fill>record_voice_over</lapp-icon><div  slot="headline">Show When Read Aloud</div>`,
	hideReadaloud: html`<lapp-icon slot="start" no-fill>hide_source</lapp-icon><div  slot="headline">Hide When Read Aloud</div>`,
	showVoiceRecording: html`<lapp-icon slot="start" no-fill>mic</lapp-icon><div  slot="headline">Show When Voice Recording</div>`,
	hideVoiceRecording: html`<lapp-icon slot="start" no-fill>hide_source</lapp-icon><div  slot="headline">Hide when Voice Recording</div>`,
}