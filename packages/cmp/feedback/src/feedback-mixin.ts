import { LitElement } from 'lit';
import feedbackState from './feedbackState';
import { FeedbackShowEvent } from '../event.js';

const interval = 1000 * 60 * 5; // 5 min
const wait = 1000 * 60 * 60 * 24; // 24 hours
let count = 0;

type Constructor<T = {}> = new (...args: any[]) => T;
export declare class ShowFeedbackMixinInterface {
}

/**
 * tries to dispatch a show event every 5 minutes
 *
 * the event is fired if no feedback was sent in the las 24 hours
 * and with a probability of 0.4. It tries 6 times.
 *
 * Some users will see the feedback button after 5 mins, some after 10 ,...
 */
export const ShowFeedbackMixin = <T extends Constructor<LitElement>>(superClass: T) => {

 
  class ShowFeedbackMixinClass extends superClass  {
    private __feedbackInterval!: ReturnType<typeof setInterval>;
  
    override connectedCallback() {
      super.connectedCallback();
      this.__feedbackInterval = setInterval(this.__maybeShowFeedback.bind(this), interval);
    }

    override disconnectedCallback() {
      super.disconnectedCallback();
      clearInterval(this.__feedbackInterval);
    }

    private __maybeShowFeedback() {
      count = count + 1;
      if (count > 6 ) {
        return clearInterval(this.__feedbackInterval);
      }
      const timestamp = feedbackState.timestamp?.[0]; // Note(CG): we store latest first
      if ((!timestamp || (new Date().getTime() - timestamp > wait)) &&
      (Math.random() > 0.6)) {
          this.dispatchEvent(new FeedbackShowEvent({}));
      }
    }

  };
  return ShowFeedbackMixinClass as unknown as Constructor<ShowFeedbackMixinInterface> & T;
}

export default ShowFeedbackMixin;



