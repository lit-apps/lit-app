import { ReactiveController, ReactiveControllerHost } from 'lit';

/**
 * A controller that checks if the user has scrolled to the end of the page.
 */
export class IsEndPage implements ReactiveController {
  unsubscribe!: () => void;
  host: ReactiveControllerHost;
  /**
   * Whether the user has scrolled to the end of the page.
   */
  value!: boolean;

  constructor(host: ReactiveControllerHost, private offset = 20) {
    (this.host = host).addController(this);
  }

  private subscribe() {
    const checkIfPageEnd = () => {
      const oldValue = this.value;
      this.value = window.innerHeight + window.scrollY >= document.body.offsetHeight - this.offset;
      const hasVScroll = document.body.scrollHeight > document.body.clientHeight - 1;
      if (oldValue !== this.value) {
        this.host.requestUpdate();
      }
    }
    window.addEventListener('scroll', checkIfPageEnd);
    window.addEventListener('resize', checkIfPageEnd);
    setTimeout(checkIfPageEnd, 1000);
    return () => {
      window.removeEventListener('scroll', checkIfPageEnd)
      window.removeEventListener('resize', checkIfPageEnd)
    };
  }

  hostConnected() {
    this.unsubscribe = this.subscribe()
  }

  hostDisconnected() {
    this.unsubscribe?.()
  }

}
