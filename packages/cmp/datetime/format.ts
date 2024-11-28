import { html, LitElement } from "lit";
import { customElement, property } from 'lit/decorators.js';

const shortOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
const longOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }

type date = (Date | number ) & {toDate(): Date }

/**
 * Custom element for formatting and displaying dates.
 * 
 * @element lapp-datetime-format
 * 
 * @property {Object} date - The date to be formatted. Can be a Date object or a Promise resolving to a Date.
 * @property {Intl.LocalesArgument} locale - The locale to be used for formatting the date.
 * @property {Object} options - The options to be used for long date formatting.
 * @property {number} interval - The interval in milliseconds to determine if a shorter date format should be used. Default is 12 hours.
 * 
 * @method createRenderRoot - Overrides the default render root to render in the light DOM.
 * @method render - Renders the formatted date inside a <span> element.
 * @method formatDate - Formats the given date based on the interval and locale settings.
 * 
 * @param {date | Promise<date>} date - The date to be formatted. Can be a Date object or a Promise resolving to a Date.
 * @returns {string} - The formatted date string or 'loading ...' if the date is a Promise.
 */
@customElement('lapp-datetime-format')
export class DateTimeFormat extends LitElement {

  @property({ type: Object }) date!: date;
  @property() locale!: Intl.LocalesArgument;
  @property({ type: Object }) options = longOptions
  // when date - now small smaller that interval, display a longer format
  @property({ type: Number }) interval: number =  1000 * 60 * 60 * 12; // 12 hours
    
  // Note(cg): we want to render value in light dom so that
  // textContent work on parent elements.
  override createRenderRoot() {
    return this;
  }

  override render() {
    return html`<span>${this.formatDate(this.date)}</span>`;
  }

  formatDate(date: date| Promise<date>) {
    // Note(CG): we can set a promise resolving to a date.
    if (date instanceof Promise) {
      date.then(d => this.date = d)
      return 'loading ...'
    }
    if (date) {
      try {
        const now = new Date().valueOf();
        const d: Date = date.toDate ? date.toDate() : new Date(date);
        const diff = now - d.valueOf(); // Note(CG): diff < 0 => date is in the future
        return (diff > -this.interval && diff < this.interval) ?
          (d.toLocaleDateString(this.locale, shortOptions) + ', ' + d.toLocaleTimeString(this.locale)) :
          d.toLocaleDateString(this.locale, this.options);
      } catch (e) {
        return date;
      }
    }
    return '';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-datetime-format': DateTimeFormat;
  }
}
