import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { LappTextfield } from '../field/text-field';
import { ValueChangedEvent } from '@lit-app/shared/event';
import { HTMLEvent } from '@lit-app/shared/types.js';
import('../field/text-field')

// source for regex: https://webapps.stackexchange.com/questions/54443/format-for-id-of-youtube-video/101153#101153
const videoReg = '[0-9A-Za-z_\\-]{10}[048AEIMQUYcgkosw]';

// @ts-expect-error = inputOrTextarea is private
interface FieldI extends LappTextfield {
  inputOrTextarea: HTMLInputElement | HTMLTextAreaElement
}

export interface validIdChangedDetail {
  value: string
  valid: boolean | undefined | null
}

export class validIdChangedEvent extends CustomEvent<validIdChangedDetail> {
  static readonly eventName = 'valid-id-changed';
  constructor(value: string, valid: boolean | undefined | null) {
    super(validIdChangedEvent.eventName, {
      bubbles: true,
      composed: true,
      detail: { value, valid }
    });
  }
}

declare global {
  interface HTMLElementEventMap {
    'ValidIdChanged': validIdChangedEvent,
  }
}

/**
 * An element to set valid youtube ID
 */
@customElement('lapp-youtube-id')
export class LappYoutubeId extends LitElement {
  static override styles = css`
    :host {
      display: inline-flex;
      flex-direction: column;
    }
    `;
  @property() label = 'Enter a youtube video ID'
  @property() helper = 'unique id for youtube video (11 chars)'
  @property() helperNoVideo = 'video does not exist on youtube'
  @property() helperOk = 'valid id, the video exists'
  @property() value = ''
  @property({ type: Boolean }) required = false
  @state() videoExists!: boolean | undefined | null

  @query('lapp-text-field') field!: FieldI;
  @query('img') image!: HTMLImageElement;

  get valid() {
    return this.field?.validity?.valid;
  }

  // get videoExists() {
  //  
  //   return this.image?.naturalWidth !== 120;
  // }
  override updated(props: PropertyValues<this>) {
    if (props.has('videoExists')) {
      this.dispatchEvent(new validIdChangedEvent(this.value, this.videoExists));
    }
    if (props.has('value')) {
      this._checkVideoExists();
    }
    super.updated(props);
  }

  private async _checkVideoExists() {
    const inputOrTextarea = this.field?.inputOrTextarea;
    if (!inputOrTextarea && this.field) {
      await this.field.updateComplete;
    }
    if (this.field?.inputOrTextarea) {
      if (!this.valid) {
        this.videoExists = undefined;
      }
      if (this.valid) {
        this.videoExists = this.value ? null : undefined;
      }
    }
  }

  override firstUpdated(props: PropertyValues<this>) {
    super.firstUpdated(props);
    // force validity check
    // this.videoExists = this.img?.naturalWidth !== 120;
    console.log('first updated', props);
    this._checkVideoExists();
  }

  override render() {
    const onLoad = (e: HTMLEvent<HTMLImageElement>) => {
      console.log('loaded', e);
      //  invalid video returns a 120px width image: https://gist.github.com/tonY1883/a3b85925081688de569b779b4657439b
      this.videoExists = e.target.naturalWidth !== 120;
    }
    const onInput = (e: HTMLEvent<FieldI>) => {
      this.value = e.target.value;
      this.dispatchEvent(new ValueChangedEvent(this.value));
    }

    const supportingText = this.videoExists === true ? 
      this.helperOk : 
      (this.videoExists === false && this.value) ? this.helperNoVideo : this.helper;
    return html`
     <lapp-text-field 
      .label=${this.label}
      .supportingText=${supportingText}
      .required=${this.required}
      .value=${this.value || ''}
      pattern=${videoReg} 
      @input=${onInput}
     >
     ${this.videoExists === true ? html`<lapp-icon slot="trailing-icon">check</lapp-icon>` : ''} 
     ${this.videoExists === false && !!this.value ? html`<lapp-icon slot="trailing-icon">error</lapp-icon>` : ''} 
     ${this.videoExists === null ? html`<lapp-icon slot="trailing-icon">pending</lapp-icon>` : ''} 
    </lapp-text-field>
     ${this.valid && this.value ? html`
     <img style="display: none;"  src="https://i.ytimg.com/vi/${this.value}/hqdefault.jpg" @load=${onLoad}>` : ''}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-youtube-id': LappYoutubeId;
  }
} 