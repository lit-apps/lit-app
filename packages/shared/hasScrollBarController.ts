import { ReactiveController, ReactiveControllerHost } from 'lit';

/**
 * A controller that checks is the page has a vertical scrollbar.
 */
export default class EndPageController implements ReactiveController {
  unsubscribe!: () => void;
  host: ReactiveControllerHost;
  
  /**
   * Whether the page has a vertical scrollbar.
   */
  value!: boolean;

  constructor(host: ReactiveControllerHost, private target = document.documentElement) {
    (this.host = host).addController(this);
  }

  private subscribe() {
    const check = () => {
      const oldValue = this.value;
      this.value = this.target.scrollHeight > this.target.clientHeight ;
      if (oldValue !== this.value ) {
        this.host.requestUpdate();
      }
    }
    window.addEventListener('scroll', check);
    window.addEventListener('resize', check);
    setTimeout(check, 1000);
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    };
  }

  hostConnected() {
    this.unsubscribe = this.subscribe()
  }

  hostDisconnected() {
    this.unsubscribe?.()
  }

}
