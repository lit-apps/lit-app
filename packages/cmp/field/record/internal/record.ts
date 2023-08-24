import { LitElement, html, PropertyValues } from "lit";
import { property, state, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { announce } from '@vaadin/a11y-base';
import('@material/web/iconbutton/filled-icon-button.js')
import('@material/web/iconbutton/outlined-icon-button.js')
import('@material/web/button/filled-button.js')
import('@material/web/button/outlined-button.js')
import('@material/web/button/text-button.js')
import('@material/web/icon/icon.js')
import('@material/web/progress/linear-progress.js')

import { ResizeControllerMixin } from '../../../mixin/resize-controller-mixin';
import RecordEvent from '../RecordEvent';
import { getStream } from '../stream';
import locale from './record-locale.mjs';
import translate from '@preignition/preignition-util/translate-mixin';


type MediaRecorderErrorEvent = Event & {
  error?: Error
}

const isMediaSupported = navigator?.mediaDevices?.getUserMedia;

/** Global stream and recorder */
let stream: MediaStream;
let recorder: MediaRecorder;

/**
 * Record 
 * 
 * An element that allows to register a record and store it locally.
 *  
 * @fires record-changed - indicates that audio has changed
 
 */
export class Record extends ResizeControllerMixin(translate(LitElement, locale)) {

  private recorder!: MediaRecorder;
  private chunks!: Blob[];
  private timer!: number;
  private messageTimeout!: NodeJS.Timeout;

  /** a helper text to pass; it will be added as aria-label to main button or icon button */
  @property({attribute: 'aria-label'}) ariaLabel = '';

  /** the label for record button */
  @property() recordLabel = locale.record;

  /** the label for clear button */
  @property() clearLabel = locale.clearLabel;

  /** the label for clear button */
  @property() playLabel = locale.playLabel;

  /** max duration of recording (in seconds) */
  @property({ type: Number }) maxDuration = 180;

  /** indicates if we are recording  */
  @property({ reflect: true, type: Boolean }) recording = false;

  /** indicates if we are pausing recording  */
  @property({ reflect: true, type: Boolean }) pausing = false;

  /** indicates if we are pausing recording  */
  @state() confirmClear = false;

  /** the source to the audio recorded */
  @state() src!: string;

  /** current recording duration (in sec) */
  @state() currentDuration = 0;

  /** type of media */
  @property() mediaType = 'audio/webm';

  /** text indicating state and giving guidance */
  @state() supportingText = '';

  @query('audio') audioEl!: HTMLAudioElement;


  get almostComplete() {
    return this.currentDuration >= this.maxDuration * 0.8
  }

  override render() {

    if (!isMediaSupported) {
      return html`
        <div class="helper">
          ${this.tr('notSupported')}
        </div>
      `
    }

    const clsMap = {
      narrow: this.isNarrow
    }

    const audioChanged = () => {
      this.requestUpdate()
    }
    const renderAudio = () => html`
      <audio @play=${audioChanged} @pause=${audioChanged} @complete=${audioChanged} controls src=${ifDefined(this.src)}></audio>
     `
    const renderProgress = () => html`
      <md-linear-progress 
        ?data-almost-complete=${this.almostComplete}
        .value=${this.currentDuration} 
        .buffer=${this.maxDuration} 
        .max=${this.maxDuration}></md-linear-progress>
      `

    return html`
      <div class="ct">
        <div class="ct ${classMap(clsMap)}" id="controls">
          ${when(this.src, () => this.renderListenControls(), () => this.renderRecordControls())}
        </div>
         <div class="ct" id="display">
          ${when(this.src, renderAudio, renderProgress)}
        </div>
      </div>
      <div class="supporting-text">
        ${this.supportingText}&nbsp;
      </div>  
    `;
  }

  renderRecordControls() {

    const onStop = () => {
      this.recorder.stop()
    }
    const recordLabel = `${this.recordLabel} ${this.ariaLabel}`
    const renderNarrow = () => html`
     <md-filled-icon-button .selected=${this.recording} aria-label=${recordLabel} @click=${this.onRec}>
        <lapp-icon>mic</lapp-icon>
        <lapp-icon slot="selectedIcon" class="animate">${this.recorder?.state === 'paused' ? 'pause' : 'play_circle'}</lapp-icon>
      </md-filled-icon-button>
   
      <md-outlined-icon-button 
        aria-label=${this.tr('stopRecording')}
        @click=${onStop}
        .disabled=${!this.recording}>
        <lapp-icon>stop</lapp-icon>
      </md-outlined-icon-button>
    `
    const renderWide = () => html`
     <md-filled-button  
        aria-label=${recordLabel}
        @click=${this.onRec}>
        ${this.recordLabel}
        ${this.recording ?
        html`<lapp-icon slot="icon" class="animate">${this.recorder?.state === 'paused' ? 'pause' : 'play_circle'}</lapp-icon>` :
        html`<lapp-icon slot="icon">mic</lapp-icon>`
      }
      </md-filled-button>
     
      <md-outlined-button 
        @click=${onStop}
        .disabled=${!this.recording}>
        ${this.tr('stop')}
        <lapp-icon slot="icon">stop</lapp-icon>
      </md-outlined-button>
      `
    return this.isNarrow ? renderNarrow() : renderWide();
  }

  renderListenControls() {

    const playLabel = `${this.playLabel} ${this.ariaLabel}`
    const onPlay = () => {
      this.audioEl.paused ? this.audioEl.play() : this.audioEl.pause();
      this.requestUpdate();
    }
    const onClear = () => this.confirmClear = true;
    const onCancel = () => this.confirmClear = false;
    const doClear = () => {
      this.src = '';
      this.announce(this.getTranslate('announce.clear'), 'polite', 4000);
    }

    const renderClearButton = () => html`
      <md-text-button @click=${onClear}>
        ${this.clearLabel}
        <lapp-icon slot="icon">clear</lapp-icon>
      </md-text-button>
    `

    const renderConfirm = () => html`
      <md-filled-button @click=${doClear}>
        ${this.tr('startAgain')}
        <lapp-icon slot="icon">replay</lapp-icon>
      </md-filled-button>
      <span class="flex"></span>
      <md-outlined-button @click=${onCancel}>
        ${this.tr('cancel')}
        <lapp-icon slot="icon">cancel</lapp-icon>
      </md-outlined-button>
    `
    const renderNarrow = () => html`
        <md-filled-icon-button  @click=${onPlay} aria-label=${playLabel}>
          ${this.audioEl?.paused ?
        html`<lapp-icon>play_circle</lapp-icon>` :
        html`<lapp-icon>pause</lapp-icon>`
      }
        </md-filled-icon-button>`

    const renderWide = () => html`
        <md-filled-button  
            aria-label=${playLabel}
            @click=${onPlay}>
            ${this.playLabel}
            ${this.audioEl?.paused ?
        html`<lapp-icon slot="icon" class="animate">play_circle</lapp-icon>` :
        html`<lapp-icon slot="icon">pause</lapp-icon>`
      }
          </md-filled-button>
          `
    const renderClear = () => html`
     ${when(this.isNarrow, renderNarrow, renderWide)}
      <span class="flex"></span>
      ${renderClearButton()}
    `


    return this.confirmClear ? renderConfirm() : renderClear();
  }

  async onRec() {
    if (this.recorder?.state === 'recording') {
      this.recorder.pause();
      return;
    }
    if (this.recorder?.state === 'paused') {
      this.recorder.resume();
      return;
    }

    try {
      if (!stream) { this.announce(this.getTranslate('announce.requestingPermission')); }
      stream = await getStream();
      this.supportingText = '';
    } catch (e) {
      console.error(e);
      const message = e.name === 'NotAllowedError' ? `${e.message} - ${this.getTranslate('announce.blocked')}` : e.message;
      this.announce('Error: ' + message, 'alert');
      return;
    }
    if (!this.recorder) {
      this.initRecorder();
    }
    this.recorder.start();
  }

  private initRecorder() {
    this.recorder = new MediaRecorder(stream);
    this.chunks = [];

    this.recorder.addEventListener('dataavailable', (e) => {
      this.chunks.push(e.data);
    });

    this.recorder.addEventListener('stop', () => {
      const blob = new Blob(this.chunks, { type: this.mediaType });
      this.src = URL.createObjectURL(blob);
      const event = new RecordEvent({ src: this.src, type: this.mediaType, blob: blob });
      this.dispatchEvent(event);
      this.chunks = [];
      this.stopTimer();
      this.currentDuration = 0;
      this.recording = false;
      this.pausing = false;
      this.confirmClear = false;
      this.announce(this.getTranslate('announce.completed'), 'polite', 4000);
      setTimeout(() => {
        this.requestUpdate();
      }, 10);
    });

    this.recorder.addEventListener('start', () => {
      // prevent multiple recorder running at the same time
      if (recorder) {
        recorder.stop();
        recorder = this.recorder;
      }
      this.recording = true;
      this.announce(this.getTranslate('announce.recording'));
      this.currentDuration = 0;
      this.startTimer();
    });

    this.recorder.addEventListener('pause', () => {
      this.pausing = true;
      this.announce(this.getTranslate('announce.recording'));
      this.stopTimer();
    });

    this.recorder.addEventListener('resume', () => {
      this.pausing = false;
      this.announce(this.getTranslate('announce.resumed'))
      this.startTimer();
    });

    this.recorder.addEventListener('error', (event: MediaRecorderErrorEvent) => {
      this.announce('Error: ' + event.error?.message, 'alert')
    });
  }

  private startTimer() {
    this.timer = setInterval(() => {
      if (!this.pausing) {
        this.currentDuration += 0.2;
        if (this.currentDuration >= this.maxDuration) {
          this.recorder.stop();
        }
        // set a warning message if the recording is 90% elapsed
        if (this.almostComplete) {
          this.announce(this.getTranslate('announce.stopSoon'), 'assertive');
        }
      }
    }, 200);
  }

  private stopTimer() {
    clearInterval(this.timer);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.stopTimer();
  }

  private announce(message: string, mode: 'alert' | 'assertive' | 'polite' = 'polite', timeout?: number) {
    if (message) {
      announce(message, { mode: mode });
    }
    this.supportingText = message;
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
    if (timeout) {
      this.messageTimeout = setTimeout(() => {
        this.supportingText = '';
      }, timeout);
    }
  }

}

