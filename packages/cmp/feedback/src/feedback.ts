import { LitElement, html } from 'lit';
import { property, query } from 'lit/decorators.js';
import translate  from '@preignition/preignition-util/translate-mixin.js';
// @ts-expect-error - locale is not typed
import locale from './feedback-locale.mjs';
import './dialog';
import './button';
import FeedbackButton  from './button';;
import FeedbackDialog  from './dialog';;
import { PropertyValues } from 'lit';
import { APP_NAME } from '@preignition/preignition-config';

/**
 *  
 */

export default class Feedback extends translate(LitElement, locale, 'pfe-feedback') {

  private _timeout!: ReturnType<typeof setTimeout>;

  @property() appTitle: string = APP_NAME;
  @property({ type: Boolean }) showSurvey!: boolean;
  @property({type: Number}) delay: number = 4000;
  @property({type: Number}) autoShow!: number; // if set, will show button after autoShow ms
 
  @query('lapp-feedback-dialog') dialog!: FeedbackDialog;
  @query('lapp-feedback-button') button!: FeedbackButton;

  override firstUpdated(props: PropertyValues) {
    this.button.hide = true;
    this.button.show = false;
    if (this.autoShow) {
      this._timeout = setTimeout(() => this.show(), this.autoShow * 1);
    }
    super.firstUpdated(props);
  }

  override render() {
    return html`
    <lapp-feedback-dialog
      .appTitle=${this.appTitle}
      .showSurvey=${this.showSurvey}
      @feedback-submit=${() => this.button.hide = true}
    ></lapp-feedback-dialog>
    <lapp-feedback-button 
      @feedback-activate=${this.activate}
      .label=${this.tr('sendFeedback')}
      ></lapp-feedback-button>
    `;
  }

  async activate() {
    await this.updateComplete;
    this.dialog.open = true;
    this.clear();
  }

  async show(delay?: number) {
    await this.updateComplete;
    this.button.hide = false;
    setTimeout(() => this.button.show = true, 200);
    if (this._timeout) {
      clearTimeout(this._timeout);
    }
    this._timeout = setTimeout(() => this.clear(), delay || this.delay);
  }

  clear() {
    if (this._timeout) {
      clearTimeout(this._timeout);
    }
    this.button.show = false;
    this._timeout = setTimeout(() => this.hide(), this.delay * 1.5);
  }

  hide() {
    if (this._timeout) {
      clearTimeout(this._timeout);
    }
    this.button.show = false;
    this.button.hide = true;
  }

}
