import { LitElement, html, css } from 'lit';
import { when } from 'lit/directives/when.js';
import { customElement, property, state } from 'lit/decorators.js';

import { GetSet as getSet } from '@preignition/preignition-util';
import translate from '@preignition/preignition-util/translate-mixin.js';
import screenshot from '@preignition/preignition-util/screenshot.js';
// @ts-expect-error - locale is not typed
import locale from './feedback-locale.mjs';

import('@material/web/dialog/dialog.js');
import type { MdDialog } from '@material/web/dialog/dialog.js';
import('@material/web/button/filled-button.js');
import('@material/web/button/outlined-button.js');
import('@material/web/button/text-button.js');
import('@material/web/checkbox/checkbox.js');

import('@lit-app/cmp/field/text-field')
import '@lit-app/cmp/field/choice-star';
import feedbackState from './feedbackState';
import { typography } from '@lit-app/shared/styles';
import { StateController } from '@lit-app/state';
import { HTMLEvent } from '@lit-app/shared/types';
import { FeedbackSubmitEvent } from '../event.js';

type Selected = 'simple' | 'more' | 'idea' | 'bug'

/**
 *  
 */

@customElement('lapp-feedback-dialog')
export default class pfeDialog extends
  getSet(
    translate(LitElement, locale, 'pfe-feedback')) {

  bindFeedbackState: StateController<typeof feedbackState> = new StateController(this, feedbackState);

  static override styles = [
    typography,
    css`
      .narrow {
        width: 70%;
      }

      .ct {
        display: flex;
        gap: var(--space-small);
        justify-content: center;
        flex-wrap: wrap;
        margin-bottom: var(--space-small);
      }

      lapp-text-field, label, lapp-choice-star {
        width: 100%;
      }
      label {
        display: flex;
        align-items: center;
      }

      form {
        min-height: 280px;
        display: flex;
        flex-direction: column;
        gap: var(--space-small);
      }

      img {
        margin-top: var(--space-medium);
        max-width: 100%;
        /* max-height:400px; */
        width:auto;
        height:auto;
      }

      @media only screen and (max-width: 640px) {
        .narrow {
          width: 100%;
        }
    }

  `];

  @property() appTitle: string = 'accessible surveys';
  @property({ type: Boolean }) showSurvey!: boolean;
  @property({ type: Boolean }) open!: boolean;
  @state() _selected: Selected = 'simple';

  get grade() {
    return feedbackState?.data?.grade?.experience;
  }

  get poorGrade() {
    return this.grade && (Number(this.grade)) < 3;
  }

  override render() {
    const submitDisabled = !this.grade || (this.poorGrade && !feedbackState?.data?.feedback?.experience);
    const canSubmit = !submitDisabled ||
      feedbackState?.data?.idea?.description ||
      feedbackState?.data?.issue?.description;
    const onClose = (e: HTMLEvent<MdDialog>) => {
      if (e.target.returnValue === 'submit') {
        this.submit();
      }
      this.open = false;
    }
    return html`
    <md-dialog
      .open=${this.open}
      @close=${onClose}
    >
    <div slot="headline">${this.tr('heading', { title: this.appTitle })}</div>
    <form id="form-feedback" slot="content" method="dialog" novalidate="">
      ${this._selected === 'more' ? this.renderMore() :
        this._selected === 'bug' ? this.renderBug() :
          this._selected === 'idea' ? this.renderIdea() :
            this.renderSimple()}
      ${this.renderButtons()}  
    </form>
    <div slot="actions">
      <md-outlined-button autofocus form="form-feedback" value="close">${this.tr('cancel')}</md-outlined-button>
      <md-filled-button  form="form-feedback" .disabled=${!canSubmit} value="submit">${this.tr('submit')}</md-filled-button>
    </div>
  </md-dialog>
    `;
  }

  renderSimple() {
    const grade = this.grade;
    return html`
    <lapp-choice-star 
      .selected=${grade || ''} 
      required
      @selected-changed=${this.onInput('data.grade.experience', 'selected', feedbackState)} 
      .label=${this.tr('grade.experience', { title: this.appTitle })}></lapp-choice-star>
    <lapp-text-field 
			type="textarea"
      .value=${feedbackState?.data?.feedback?.experience || ''}
      .required=${!!this.poorGrade}
      rows="3"
      @input=${this.onInput('data.feedback.experience', 'value', feedbackState)} 
      label=${grade ? this.tr('tellUsWhy', { grade: grade }) : this.tr('tellUsMore')}></lapp-text-field>
    ${this.showSurvey ? this.renderSurvey() : ''}
    
    `;
  }

  renderSurvey() {
    const grade = feedbackState?.data?.grade?.survey;
    return html`
    <lapp-choice-star 
      .selected=${grade || ''} 
      @selected-changed=${this.onInput('data.grade.survey', 'selected', feedbackState)} 
      .label=${this.tr('grade.survey')}></lapp-choice-star>
    <lapp-text-field 
			type="textarea"
        .value=${feedbackState?.data?.feedback?.survey || ''}
        @input=${this.onInput('data.feedback.survey', 'value', feedbackState)} 
        label=${grade ? this.tr('tellUsWhy', { grade: grade }) : this.tr('tellUsMore')}></lapp-text-field>
        `;
  }

  renderBug() {
    return html`
    <div >${this.tr('reportIssue')}</div>  
    <lapp-text-field 
        maxLength="80"
        required
        .label=${this.tr('titleIssue')}
        .value=${feedbackState?.data?.issue?.title || ''}
        @input=${this.onInput('data.issue.title', 'value', feedbackState)} 
    ></lapp-text-field>
    <lapp-text-field 
			  type="textarea"
        required
        .label=${this.tr('describeIssue')}
        .helper=${this.tr('describeIssueHelp')} 
        .value=${feedbackState?.data?.issue?.description || ''}
        @input=${this.onInput('data.issue.description', 'value', feedbackState)} 
        rows="5"></lapp-text-field>
    <div class="ct">
      <md-outlined-button form="none" @click=${() => this.takeScreenshot()}>
        <lapp-icon slot="icon">screenshot</lapp-icon>
        ${this.tr('takeScreenshot')}
      </md-outlined-button>
      ${when(feedbackState.data?.screenshot, () => html`
      <md-text-button  form="none" @click=${() => this.clearScreenshot()} >
        <lapp-icon slot="icon">close</lapp-icon>
        ${this.tr('clear')}
      </md-text-button>`)}
    </div>
    ${when(feedbackState.data?.screenshot, () => html`
    <p>${this.tr('warnScreenshot')}</p>
    <img src="${feedbackState.data.screenshot || ''}">`)}
    ${this.renderContacted()}
    `;
  }

  renderIdea() {
    return html`
    <div>${this.tr('proposeIdea', { title: this.appTitle })}</div> 
    <lapp-text-field 
        maxLength="80"
        required
        .label=${this.tr('titleIdea')}
        .value=${feedbackState?.data?.idea?.title || ''}
        @input=${this.onInput('data.idea.title', 'value', feedbackState)} 
    ></lapp-text-field> 
    <lapp-text-field 
			type="textarea"
        required
        .label=${this.tr('describeIdea')}
        .helper=${this.tr('describeIdeaHelp', { title: this.appTitle })} 
        .value=${feedbackState?.data?.idea?.description || ''}
        @input=${this.onInput('data.idea.description', 'value', feedbackState)} 
        rows="5"></lapp-text-field>
    ${this.renderContacted()}
    `;
  }

  renderContacted() {
    return html`
    <label>
      <md-checkbox touch-target="wrapper" 
        aria-label=${this.tr('consent')}
        .checked=${!!feedbackState?.data?.consent}
        @change=${this.onInput('data.consent', 'checked', feedbackState)} 
      ></md-checkbox>
      ${this.tr('consent')}
     </label>
    ${feedbackState?.data?.consent ? html`
    <lapp-text-field 
        type="email"
        .label=${this.tr('email')}
        .helper=${this.tr('emailHelper')}
        .value=${feedbackState?.data?.email || ''}
        @input=${this.onInput('data.email', 'value', feedbackState)} 
        ></lapp-text-field> 
    ` : ''}
    `;
  }


  renderMore() {
    return html`
      <div >${this.tr('tellUs')}</div> 
      <lapp-choice-star
      class="narrow" 
      .selected=${feedbackState?.data?.grade?.easyToUse || ''} 
      @selected-changed=${this.onInput('data.grade.easyToUse', 'selected', feedbackState)} 
      .label=${this.tr('grade.easyToUse', { title: this.appTitle })}></lapp-choice-star>
      <lapp-choice-star 
      class="narrow" 
      .selected=${feedbackState?.data?.grade?.complete || ''} 
      @selected-changed=${this.onInput('data.grade.complete', 'selected', feedbackState)} 
      .label=${this.tr('grade.complete', { title: this.appTitle })}></lapp-choice-star>
      <lapp-choice-star 
      class="narrow" 
      .selected=${feedbackState?.data?.grade?.responsive || ''} 
      @selected-changed=${this.onInput('data.grade.responsive', 'selected', feedbackState)} 
      .label=${this.tr('grade.responsive', { title: this.appTitle })}></lapp-choice-star>
      <lapp-choice-star 
      class="narrow" 
      .selected=${feedbackState?.data?.grade?.reliable || ''} 
      @selected-changed=${this.onInput('data.grade.reliable', 'selected', feedbackState)} 
      .label=${this.tr('grade.reliable', { title: this.appTitle })}></lapp-choice-star>
      `;
  }

  renderButtons() {
    const navigate = (n: Selected) => (e: Event) => {
      this._selected = n;
      e.preventDefault();
    };
    const grade = feedbackState?.data?.grade?.experience;
    return html`
    <div class="ct">
      ${this._selected === 'simple' ?
        html`
        <md-filled-button form="none" .disabled=${!grade} @click=${navigate('more')} >
          <lapp-icon slot="icon">star</lapp-icon>
          ${this.tr('button.more')}
        </md-filled-button>
        <md-outlined-button form="none" .disabled=${!grade} @click=${navigate('idea')} >
          <lapp-icon slot="icon">lightbulb</lapp-icon>
          ${this.tr('button.idea')}
        </md-outlined-button>
        <md-outlined-button form="none" .disabled=${!grade} @click=${navigate('bug')} >
         <lapp-icon slot="icon">bug_report</lapp-icon>
         ${this.tr('button.bug')}
         </md-outlined-button>
      ` :
        html`
        <md-filled-button form="none" @click=${navigate('simple')} >
          <lapp-icon slot="icon">arrow_back</lapp-icon>
          ${this.tr('button.back')}
        </md-filled-button>`} 
    </div>
    `;
  }

  async takeScreenshot() {
    this.open = false;
    await this.updateComplete;
    try {
      const frame = await screenshot();
      this.open = true;
      feedbackState.data.screenshot = frame;
      feedbackState.data = { ...feedbackState.data };
    } catch (err) {
      console.error('Error: ' + err);
    }
  }
  clearScreenshot() {
    feedbackState.data.screenshot = '';
    feedbackState.data = { ...feedbackState.data };
  }

  submit() {
    this.dispatchEvent(new FeedbackSubmitEvent(feedbackState.data));
    const ts = [new Date().getTime()].concat(feedbackState.timestamp || [])
      .filter((_d, i) => i <= 5);
    feedbackState.timestamp = ts;
    feedbackState.data = {
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-feedback-dialog': pfeDialog;
  }
}
