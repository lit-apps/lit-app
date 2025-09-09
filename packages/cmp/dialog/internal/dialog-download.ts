import type { Parser } from "@json2csv/plainjs";
import { ToastEvent } from '@lit-app/shared/event';
import { HTMLEvent } from '@lit-app/shared/types';
import { MdDialog } from '@material/web/dialog/dialog';
import { css, html, LitElement } from "lit";
import { property, query, state } from 'lit/decorators.js';
import { LappChoiceRadio } from "../../field/choice-radio.js";
import { DownloadEvent } from "../dialog-download.js";
import downloadCSV from '../downloadCSV.js';
import downloadJSON from '../downloadJSON.js';
import { tokenState } from "@lit-app/base/state";

import('@material/web/dialog/dialog.js')
import('@material/web/button/text-button.js')
import('@material/web/checkbox/checkbox.js');
import('@material/web/button/filled-button.js')
import('../../field/text-field')
import('../../copy/copy')

export type AllowedExportFormats = 'json' | 'csv'

/**
 *  A dialog to download a file
 */
export class DialogDownload extends LitElement {

  static override styles = css`
  .separator{
    margin: auto;
    margin-top: var(--space-medium);
    margin-bottom: var(--space-x-large);
    border-top: var(--color-divider) solid 1px;
    width: 66%;
  }

  lapp-text-field {
    width: 100%;
  }

  label {
    display: flex;
    align-items: center;
  }
    `;


  /**
   * Heading for the dialog .
   */
  @property() heading: string = 'Download';

  /** 
   *  whether the dialog is open 
   */
  @state() open: boolean = false;

  /** 
   * whether the download is made client-side
   * In which case, the component will just emit a download event
   */
  @property({ type: Boolean }) clientSide!: boolean;

  /** 
   * whether the dialog allows 
   * and displays a copy button
   */
  @property({ type: Boolean }) allowCopy!: boolean;

  /** 
   * when true, hide the understand risk stuff
   */
  @property({ type: Boolean }) hideUnderstandRisk!: boolean;

  /** 
   * true when user understands the risk
   */
  @state() _understandRisk: boolean = false;

  /** 
   * true when currently downloading
   */
  @state() downloading!: boolean;

  /** 
   *  download name
   */
  @property() name: string = 'download';

  /** 
   * download format
   */
  @property() format: AllowedExportFormats = 'json';

  /**
   * available formats for download
   * 
   * If set, the dialog will display a radio button to select the format
   * @example:  ['json', 'csv']
   */
  @property({ attribute: false }) formats!: AllowedExportFormats[];

  /**
   * a @json2csv/plainjs parse to format csv data
   */
  @property({ attribute: false }) parser: Parser<any, any> | undefined;

  /** 
   *  - api href
   */
  @property() href!: string;

  @query('md-dialog') dialog!: MdDialog;

  get downloadName() {
    return `${this.name}.${this.format}`
  }

  get query() {
    const paramsObj = { format: this.format };
    const searchParams = new URLSearchParams(paramsObj);
    return searchParams.toString()
  }

  get copyQuery() {
    return this.query
  }

  get downloadDisabled() {
    return !this._understandRisk && !this.hideUnderstandRisk
  }

  get downloadDetail() {
    return {
      name: this.name,
      format: this.format
    }
  }

  override render() {
    if (!this.open) { return '' }
    const onClose = () => {
      if (this.dialog.returnValue === 'ok') {
        /** event sent when user clicks on `export` button */
        this.dispatchEvent(new CustomEvent('download', {
          detail: this.downloadDetail, composed: true
        }));
        this.dispatchEvent(new ToastEvent('creating a new export file'));
      }
      this.close()
      this._clearContent()
    };

    return html`
      <md-dialog 
        open
        @close=${onClose}>
        <lapp-icon slot="icon">download</lapp-icon>
        <div slot="headline">${this.heading}</div>
        <form slot="content" method="dialog" id="form-download">
        ${this.hideUnderstandRisk ?
        this.renderSettings() :
        [this.renderUnderstandRisk(),
        this._understandRisk ?
          [html`<div class="separator"></div>`,
          this.renderSettings(),
          this.formats?.length ? this.renderSelectFormat(this.formats) : ''
          ] : ''
        ]}
        ${this.allowCopy ? this.renderCopy() : ''}
        </form>
        <div slot="actions">
          ${this.renderAction()}
        </div>
      </md-dialog>
    `;
  }

  renderUnderstandRisk() {
    return html`
    <div><span style="color: var(--color-danger);">Privacy warning</span>: if you export data, you are responsible for handling GDPR or other privacy requests involving the exported data.</div>
    <label >
      <md-checkbox touch-target="wrapper" 
      aria-label="I understand my responsibilities"
      .checked=${this._understandRisk} @change=${(e: HTMLEvent<HTMLInputElement>) => this._understandRisk = e.target.checked}></md-checkbox>
      I understand my responsibilities
    </label>
    `
  }

  renderSettings() {
    return html`
    <slot>
      <p>Set the name of export before proceeding.</p>
      <lapp-text-field
        label="export file name" 
        helper="Name under which the export will be saved" 
        .value=${this.name || ''} 
        @input=${(e: HTMLEvent<HTMLInputElement>) => this.name = e.target.value}></lapp-text-field>
    </slot>
    `
  }

  renderSelectFormat(formats: string[]) {
    const onSelected = (e: HTMLEvent<LappChoiceRadio>) => {
      this.format = e.target.selected as AllowedExportFormats;
    }
    return html`
    <p>Set the type of export before proceeding.</p>
       <lapp-choice-radio 
        dense
        label="Type of export" 
        name="format"
        .selected=${this.format} 
        .options=${formats.map(f => ({ label: f, code: f }))}
        @selected-changed=${onSelected}
      ></lapp-choice-radio>
    `
  }

  renderCopy() {
    if (this.clientSide) {
      return html`
      <lapp-copy 
        .buttonType=${'button'}
        @content-copied-reset=${() => this.close()}
        @content-copied=${() => this.dispatchEvent(new CustomEvent('toast', { detail: 'content copied to clipboard', bubbles: true, composed: true }))}
        outlined
        @click=${this.onCopy}
        .disabled=${this.downloadDisabled} 
        .label=${'copy to clipboard'}
      ></lapp-copy>`
    }
    return html`
    <lapp-copy .buttonType=${'button'}
      @content-copied-reset=${() => this.close()}
      @content-copied=${() => this.dispatchEvent(new CustomEvent('toast', { detail: 'link copied to clipboard', bubbles: true, composed: true }))}
      outlined
      .content=${`${location.origin}${this.href}?${this.copyQuery}`}
      .disabled=${this.downloadDisabled} 
      .label=${'copy URL'}  
    ></lapp-copy>`
  }




  renderAction() {
    return html`
      <md-filled-button 
        value="ok"
        form="form-download"
        .disabled=${this.downloadDisabled} 
        @click=${this.clientSide ? this._clickDownloadClient : this._clickDownload} 
        autofocus
        ><lapp-icon slot="icon">cloud_download</lapp-icon>Export Now</md-filled-button>
      <md-text-button form="form-download" value="close">Cancel</md-text-button>`
  }

  onCopy(e: CustomEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  private async _clickDownload() {
    this.downloading = true;
    await this.initiateDownload(this.href + '?' + this.query, this.downloadName);
    this.downloading = false;
    this.close()
  }
  /**
   * download client-side 
   * This will emit an form-download event, which should be handled by the parent components
   * and return the download data.
   * 
   */
  private async _clickDownloadClient() {
    // const promise = new Promise((resolve) => {
    //   const event = new DownloadEvent({ promise: resolve });
    //   this.dispatchEvent(event);
    // });
    const event = new DownloadEvent({ promise: undefined });
    this.dispatchEvent(event);
    const data = await event.detail.promise;
    if (data) {
      console.log('download data', data)
      if (this.format === 'json') {
        return downloadJSON(data, this.downloadName)
      }
      if (this.format === 'csv') {
        // Method to convert data to CSV format
        const convertToCSV = (data: any[]): string => {
          // TODO: use the async parser to liberate the main thread
          if (this.parser) {
            return this.parser.parse(data)
          }
          const headers = Object.keys(data[0])
          const csvRows = data.map(row =>
            headers.map(header => JSON.stringify(row[header], (_key, value) => value === null ? '' : value)).join(',')
          );
          return [headers.join(','), ...csvRows].join('\r\n');
        }
        return downloadCSV(convertToCSV(data), this.downloadName)
      }
    }

  }

  protected _clearContent() {
    // this.cc = this.to = this.text = this.subject = '';
  }

  private async initiateDownload(url: string, downloadName: string, retry = 0) {
    if (retry > 1) {
      this.dispatchEvent(new ToastEvent(`Error downloading file: Authentication failed after retry`, 'error'));
      console.error('Error downloading file: Authentication failed after retry');
      return;
    }
    try {
      // Pre-download check (e.g., using a HEAD request or a custom API call)
      const response = await fetch(url, { method: 'HEAD' });

      // Check if the response is OK (status in the range 200-299)
      if (response.ok) {
        // Proceed with the download
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        // make sure the router is not triggered
        downloadLink.setAttribute('data-router-slot', 'disabled');
        downloadLink.download = downloadName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } else {
        // Handle errors (e.g., invalid credentials, file not found)
        console.error('Error downloading file:', response.statusText, response);
        if (response.status === 401 && response.statusText === 'Token expired') {
          // specific case of token expired
          await tokenState.doRefreshToken();
          this.dispatchEvent(new ToastEvent(`Refreshed authentication token, retrying download...`, 'info'));
          await this.initiateDownload(url, downloadName, retry + 1);
          return;
        }

        this.dispatchEvent(new ToastEvent(`Error downloading file: ${response.statusText} `, 'error'));
        // Here, you can dispatch an event or call a function to handle the error
      }
    } catch (error) {
      this.dispatchEvent(new ToastEvent(`Network Error: ${error} `, 'error'));
      console.error('Network error:', error);
    }
  }

  show() {
    this.open = true
  }
  close() {
    this.open = false
  }
}
