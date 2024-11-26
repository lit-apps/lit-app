/**
 * Feedback State
*/

import { property, State, storage } from '@lit-app/state'

type grade = '0' | '1' | '2' | '3' | '4' | '5';
export type feedback = {
  feedback?: {
    experience: string
    survey: string
  },
  issue?: {
    title: string
    description: string
  },
  bug?: {
    description: string
  },
  idea?: {
    title: string
    description: string
  },
  screenshot?: string,
  email?: string,
  consent?: boolean,
  grade?: {
    experience: grade,
    survey?: grade,
    easyToUse?: grade,
    complete?: grade,
    responsive?: grade,
    reliable?: grade,
  }
}
class FeedbackState extends State {
  @storage({ key: 'feedbackData' })
  @property({ value: {}, type: Object }) data!: feedback;

  @storage()
  @property({ type: Number }) timestamp!: number[];

}
const feedbackState = new FeedbackState();
export default feedbackState;

if (import.meta.env.DEV) {
  // @ts-expect-error  - we are cheating
  window._feedbackState = feedbackState;
}
