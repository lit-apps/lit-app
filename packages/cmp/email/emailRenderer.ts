import { html } from "lit"
import { LappMdEditor } from "../field/md-editor.js"
import('@lit-app/cmp/field/text-field')

type ConfigT = {
  hideTo?: boolean,
  hideCC?: boolean,
}

export type EmailRendererT = {
  to: string,
  cc?: string,
  replyTo?: string,
  text: string,
  subject: string,
  toHelper?: string,

} & ConfigT

/** 
 * A renderer for email
 */

export function emailRenderer(this: EmailRendererT, { hideTo, hideCC }: ConfigT = {}) {
  hideTo = hideTo || this.hideTo
  hideCC = hideCC || this.hideCC
  return html`
  <lapp-text-field class="flex" label="subject" maxlength="200" .value=${this.subject || ''} @input=${(e: CustomEvent) => this.subject = (e.target as HTMLInputElement).value}></lapp-text-field>
  ${hideTo ? '' : html`<lapp-text-field class="flex" 
    label="to"  
    .supportingText=${this.toHelper}
    .value=${this.to || ''} 
    @input=${(e: CustomEvent) => this.to = (e.target as HTMLInputElement).value}></lapp-text-field>`}
  ${hideCC ? '' : html`<lapp-text-field class="flex" label="cc"  .value=${this.cc || ''} @input=${(e: CustomEvent) => this.cc = (e.target as HTMLInputElement).value}></lapp-text-field>`}
  ${this.replyTo !== undefined ? html`<lapp-text-field class="flex" 
    label="reply to"  
    .value=${this.replyTo || ''} @input=${(e: CustomEvent) => this.replyTo = (e.target as HTMLInputElement).value}></lapp-text-field>` : ''}
  <lapp-md-editor class="flex" .writeLabel=${'Email'} rows='12' pure .resize=${'vertical'}
    supporting-text="" 
    .md=${this.text || ''}
    @md-changed=${(e: CustomEvent) => this.text = (e.target as LappMdEditor).md}
  ></lapp-md-editor>
  `
}