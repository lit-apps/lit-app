import { ReactiveController, ReactiveControllerHost } from 'lit';

/**
 * A controller that checks if the user has scrolled to the end of the page.
 */
export default class EndPageController implements ReactiveController {
  unsubscribe!: () => void;
  host: ReactiveControllerHost;
  /**
   * Whether the user has scrolled to the end of the page.
   */
  value!: boolean;
  
  constructor(host: ReactiveControllerHost, private width = 800) {
    (this.host = host).addController(this);
  }

  private subscribe() {
    const check = () => {
      const oldValue = this.value;
      this.value =  document.documentElement.offsetWidth < this.width;
      if (oldValue !== this.value) {
        this.host.requestUpdate();
      }
    }
    window.addEventListener('resize', check);
    setTimeout(check, 1000);
    return () => {
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
