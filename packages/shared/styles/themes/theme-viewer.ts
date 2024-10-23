import { LitElement, html, css } from 'lit';
import { StyleInfo, styleMap } from 'lit/directives/style-map.js';
import { property, customElement } from 'lit/decorators.js';
@customElement('theme-viewer')
export default class ThemeViewer extends LitElement {
  @property({ type: Object }) theme!: {[key: string]: string | null | undefined}

  static override styles = css`
      :host {
        display: block;
        width: 3rem;
        height: 3rem;
        text-align: center;
        font-size: 2rem;
        box-sizing: content-box;
      }
      .ct {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        border-width: 0.5rem;
        border-radius: 0.2rem;
        border-style: solid;
        box-sizing: border-box;
      }
      
      .ct > div {
        text-align: center;
        width: 100%;
      }
    `;

  override render() {
    const styles: StyleInfo = {
      backgroundColor: this.theme['--color-background'] || this.theme['--md-sys-color-on-primary'],
      color: this.theme['--color-primary-text'] || this.theme['--md-sys-color-on-background'],
      borderColor: this.theme['--color-primary'] || this.theme['--md-sys-color-primary'],
      borderBottomColor: this.theme['--color-tertiary'] || this.theme['--md-sys-color-tertiary'],
    };
    return html`
    <div class="ct" style=${styleMap(styles)}><div aria-hidden="true">a</div></div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'theme-viewer': ThemeViewer;
  }
}


