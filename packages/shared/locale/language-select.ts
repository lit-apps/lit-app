import { css, html, LitElement } from "lit";
import { customElement, property } from 'lit/decorators.js';
// @ts-expect-error - no type
import languageLocale from './language-locale.mjs';
import { signLanguage } from './signlanguage.js';

@customElement('lapp-language-select')
/**
 * A component that allows the user to select a language from a list of available languages.
 *
 * @fires input - Dispatched when the selected language changes. The `value` property contains the new language code.
 *
 * @prop {string[]} languages - An array of language codes to display as options. If empty, a message is displayed.
 * @prop {string} value - The currently selected language code.
 *
 * @cssprop --space-small - Defines the gap between the language buttons.
 * 
 * TODO: add translation once translation-mixin is exported from preignition-util
 */
// export default class LanguageSelect extends translate(LitElement, languageLocale, 'languageLocale') {
export default class LanguageSelect extends LitElement {

  static override styles = css`
 			:host {
				display: inline-flex;
				flex-direction: row;
				flex-wrap: wrap;
				gap: var(--space-small);
			}
    `;

  @property({ attribute: false }) languages: string[] = [];
  @property() value: string = ''; // the selected language

  override render() {
    const languages = this.languages || [];
    if (languages.length === 0) {
      return html`<p>Enable at least one language.</p>`;
    }
    const click = (lan: string) => () => {
      this.value = lan;
      this.dispatchEvent(new CustomEvent('input', { bubbles: true }));
    }
    return languages.map(lan => html`
		<lapp-button
			.filled=${this.value === lan}
			.outlined=${this.value !== lan}
			@click=${click(lan)}
			>${languageLocale[lan] || signLanguage[lan as keyof typeof signLanguage]?.[0] || lan}
		</lapp-button>
		`)

  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-language-select': LanguageSelect;
  }
}
