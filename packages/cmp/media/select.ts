import type { position, sizing } from '@lit-app/cmp/media/image';
import { set } from '@lit-app/shared/dataUtils';
import { alignIcon, liteYoutube, typography } from '@lit-app/shared/styles';
import { HTMLEvent } from '@lit-app/shared/types.js';
import type { MdDialog } from '@material/web/dialog/dialog.js';
import { MdTabs } from '@material/web/tabs/tabs.js';
import '@preignition/lit-firebase/query';
import { LitElement, css, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import Gallery from '../media/gallery.js';
import { FirebaseUploadFile } from '../upload/internals/storage-mixin.js';
import { LappYoutubeId } from '../youtube/youtube-id';
;
import('../field/text-field');
import('../media/gallery.js');
import('../button/button')
import('../youtube/youtube')
import('../youtube/youtube-id')
import('../upload/document-firebase');
import('./image')
import('@vaadin/button/vaadin-lit-button.js');
import('@material/web/button/filled-button.js');
import('@material/web/button/outlined-button.js');
import('@material/web/button/text-button.js');
import('@material/web/dialog/dialog.js');
import('@material/web/tabs/tabs.js');
import('@material/web/tabs/secondary-tab.js');

export type CollectionType = 'illustration' | 'easyread'
type DataT = {
  mediaType: string;
  url: string;
  videoId: string;
  alt: string;
  playLabel: string;
  params: string;
  valid: boolean;
}

interface MediaSelectEventDetail {
  collectionType: CollectionType;
  data?: any;
  promise?: Promise<any>;
}

export class MediaSelectEvent extends CustomEvent<MediaSelectEventDetail> {
  static readonly eventName = 'media-select';
  constructor(detail: MediaSelectEventDetail) {
    super(MediaSelectEvent.eventName, {
      detail: detail,
      cancelable: false,
      bubbles: true,
      composed: true
    });
  }
}

declare global {
  interface HTMLElementEventMap {
    [MediaSelectEvent.eventName]: MediaSelectEvent;
  }
}


const toMediaItems = (obj: FirebaseUploadFile) => {
  // TODO(cg): handle thumbnail and getDownloadURL for each file.
  return Object.entries(obj || {}).map(([_k, v]) => Object.assign({ src: v.url }, v));
};

const initYoutube = { mediaType: 'youtube', playLabel: 'play', params: 'controls=0&modestbranding=2&rel=0&cc_load_policy=1' };
const initImage = { mediaType: 'image' };


/**
 *  A widget to select a media item (image or video) and show the selection
 */
@customElement('lapp-media-select')
export default class LappMediaSelect extends LitElement {

  static override styles = [
    typography,
    alignIcon,
    liteYoutube,
    css`
    :host {
      --_gap: var(--lapp-media-select-gap, var(--space-small));
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-small);
      --lapp-media-gallery-width: 150px;
      --lapp-media-gallery-height: 150px;
    }

    .ct {
      display: flex;
      gap: var(--_gap);
    }

    md-dialog {
      min-width: var(--lapp-media-select-dialog-min-width, 840px);
    }

    md-dialog h4 {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    md-dialog h4 span{
      flex: 1;
    }
    
    lapp-media-gallery {
      min-height: 133px;
      display: block;
      
    }
    
    .preview {
      width: 100%;
      min-height: var(--lapp-media-select-min-height, 200px);
    }
    .settings {
      flex: 1;
      display: flex;
      flex-direction: column;
      max-width: 600px;
      align-items: baseline;
      margin: auto;
    }
   
    `
  ]

  /**
   * firebase database collection
   */
  @property() collectionPath!: string
  /**
   * firebase storage collection
   */
  @property() collectionStore!: string
  /**
   * used to set the collection type for delegateDialog
   */
  @property() collectionType: CollectionType = 'illustration'
  /**
   * true to make chose media outlined (filled by default)
   */
  @property({ type: Boolean }) outlined!: boolean;
  /**
   * when true, delegate the dialog to a parent container, firing events instead of opening the dialog
   */
  @property({ type: Boolean }) delegateDialog!: boolean
  /**
   * when true, hides content and only display dialog. 
   * This is useful when the dialog is delegated to a parent container
   */
  @property({ type: Boolean }) hideContent!: boolean
  /**
   * true to open the dialog
   */
  @property({ type: Boolean }) open!: boolean
  @property({ attribute: false }) data!: DataT | null

  /**
   * Sets a sizing option for the image.  Valid values are `contain` (full
   * aspect ratio of the image is contained within the element and
   * letterboxed) or `cover` (image is cropped in order to fully cover the
   * bounds of the element), or `null` (default: image takes natural size).
   */
  @property() sizing: sizing = 'contain';

  /**
   * When a sizing option is used (`cover` or `contain`), this determines
   * how the image is aligned within the element bounds.
   */
  @property() position: position = 'center'
  @state() _dataYoutube: any = initYoutube
  @state() _dataImage: any = initImage
  @state() _selected: number = 0

  @query('md-dialog') dialog!: MdDialog;
  @query('lapp-media-gallery') gallery!: Gallery;

  get mediaType() {
    return this.data?.mediaType;
  }

  get placehoder() {
    return escape('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24"><path fill="#121299" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>');
  }

  override render() {
    return [
      !this.hideContent ? this.renderContent() : '',
      this.open ? this.renderDialog() : ''];
  }

  renderContent() {
    const openDialog = async () => {
      if (this.delegateDialog) {
        const selectEvent = new MediaSelectEvent({
          data: this.data,
          collectionType: this.collectionType
        });
        this.dispatchEvent(selectEvent);
        const promise = await selectEvent.detail.promise;
        if (promise !== undefined) {
          this.data = promise;
          this.dispatchEvent(new CustomEvent('data-changed', { detail: { value: promise } }));
        }
        return
      }
      this.open = true
    };
    const onRemove = () => {
      this.data = null;
      this.dispatchEvent(new CustomEvent('data-changed', { detail: { value: this.data } }));
    };

    const youtubePreview = () => {
      return html`
        <lapp-youtube class="preview" 
          videoid="${this.data?.videoId || ''}" 
          playlabel="${this.data?.playLabel || ''}" 
          params="${this.data?.params || ''}"></lapp-youtube>
        ${modifyMedia()}
      `;
    };

    const imagePreview = () => {
      return html`
      <lapp-image id="img" class="preview" 
        fade 
        .placeholder=${this.placehoder} 
        .alt=${this.data?.alt || ''}
        .src=${this.data?.url || ''} 
        .position=${this.position} 
        preload 
        .sizing=${this.sizing}></lapp-image>
        ${modifyMedia()}
        `;
    };

    const modifyMedia = () => html`<div class="ct">
      <md-outlined-button  aria-haspopup="dialog"   @click=${openDialog}><lapp-icon slot="icon">perm_media</lapp-icon>Replace Media</md-outlined-button>
      <md-text-button @click=${onRemove}><lapp-icon slot="icon">close</lapp-icon>Remove Media</md-text-button>
    </div>`;

    const choseMedia = () => html`<lapp-button .outlined=${this.outlined} .filled=${!this.outlined} aria-haspopup="dialog" @click=${openDialog}><lapp-icon slot="icon"  icon="perm_media"></lapp-icon>Choose a Media</lapp-button>`;

    if (this.mediaType === 'youtube') {
      return youtubePreview();
    }
    if (this.mediaType === 'image') {
      return imagePreview();
    }
    if (!this.mediaType) {
      return choseMedia();
    }
    return html`<div><lapp-icon>info</lapp-icon>Resource type not supported</div>${choseMedia()}`;
  }

  renderDialog() {
    const onClose = () => {
      this.open = false;
      if (this.dialog.returnValue === 'ok') {
        if (this._selected === 1) { // youtube
          this.data = { ...this._dataYoutube };
        }

        if (this._selected === 0) { // image
          this.data = { ...this._dataImage };
        }
        this.dispatchEvent(new CustomEvent('data-changed', { detail: { value: this.data } }));
      }
    };

    const onOpen = () => {
      this._dataYoutube = { ...initYoutube };
    };
    const onChange = (e: HTMLEvent<MdTabs>) => {
      this._selected = e.target.activeTabIndex
    }
    const renderTab = () => html`
    <md-tabs .activeTabIndex=${this._selected} @change=${onChange}>
      <md-secondary-tab @click=${() => this._selected = 0}><lapp-icon slot="icon">image</lapp-icon>Image</md-secondary-tab>
      <md-secondary-tab @click=${() => this._selected = 1} ><lapp-icon slot="icon">smart_display</lapp-icon>Youtube Video</md-secondary-tab>
    </md-tabs>`;

    const onMetaChanged = (e: CustomEvent) => {
      this.gallery.items = toMediaItems(e.detail.value);
    }
    const renderImage = () => html`
      <h4><span>Image</span>${renderTab()}</h4>
      <lapp-upload-document-firebase 
        max-files-size="5000000" 
        accept="image/*, video/*" 
        .path=${this.collectionPath} 
        .store=${this.collectionStore}
        @meta-data-changed=${onMetaChanged} 
        .hideExisting=${true}>
        <vaadin-button slot="add-button" theme="primary">
          Upload Media Files ...
        </vaadin-button>
          <lapp-media-gallery 
            viewType="image" 
            noToolbar
            @selected-items-changed=${(e: CustomEvent) => {
        if (e.detail.value[0]) {
          this._dataImage = { ...e.detail.value[0], ...initImage };
        }
      }}>
           <slot name="gallery"></slot>
        </lapp-media-gallery>

    </lapp-upload-document-firebase>`;

    const onVideoIdChanged = (e: HTMLEvent<LappYoutubeId>) => {
      const { valid, value } = e.target;
      this._dataYoutube.videoId = value;
      this._dataYoutube.valid = valid || null;
      this._dataYoutube = { ...this._dataYoutube }
    }
    const supportingText = html`<span >video parameters as in <a href="https://developers.google.com/youtube/player_parameters#Parameters" target="_blank">here</a>.</span>`
    const onInput = (path: string) => (e: HTMLEvent<HTMLInputElement>) => {
      set(path, e.target.value, this);
      this._dataYoutube = { ...this._dataYoutube }
    }
    const renderYoutube = () => html`
      <h4><span>Youtube Video</span>${renderTab()}</h4>
      <div class="settings">
        <div>Youtube Settings</div>
        <div style="display:flex;flex-direction:row;width:100%;">
          <lapp-youtube-id style="flex:1; margin-right: var(--space-small);"  
            required 
            .value=${this._dataYoutube?.videoId || ''} 
            @valid-id-changed=${onVideoIdChanged}></lapp-youtube-id>
          <lapp-text-field 
            style="flex:1" 
            label="play label" 
            supporting-text="label for play button" 
            .value=${this._dataYoutube?.playLabel || ''} 
            @input=${onInput('_dataYoutube.playLabel')}></lapp-text-field>
        </div>
        <lapp-text-field 
          style="width: 100%" 
          label="parameters" 
          .supportingText=${supportingText as unknown as string} 
          .value=${this._dataYoutube?.params || ''} 
          @input=${onInput('_dataYoutube.params')}>
        </lapp-text-field>
      </div>
    `;

    return html`
    <md-dialog 
      open
      @open=${onOpen}
      @close=${onClose} >
       <div slot="headline">Media Chooser</div>
        <form id="form-media" method="dialog" slot="content">
          ${this._selected === 1 ? renderYoutube() : renderImage()}
        </form>
        <div slot="actions"> 
          <md-outlined-button 
            form="form-media"
            value="close">Cancel</md-outlined-button>
          <md-filled-button 
            .disabled=${(this._selected === 1 && !this._dataYoutube?.videoId) || (this._selected === 0 && !this._dataImage.url)} 
            form="form-media"
            value="ok">Select</md-filled-button>
        </div>
      </md-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-media-select': LappMediaSelect;
  }
}
