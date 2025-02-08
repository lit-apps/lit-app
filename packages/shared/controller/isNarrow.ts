import { ReactiveController, ReactiveControllerHost } from 'lit';
type listenerT = () => void;
const listeners: listenerT[] = [];
window.addEventListener('resize', () => {
  listeners.forEach(listener => listener())
});


/**
 * A controller that checks whether the screen is narrow. 
 * 
 * The default width is 800px.
 */
export class IsNarrow implements ReactiveController {
  private unsubscribe?: () => void;

  /**
   * Whether the width of the viewport is less than the specified width.
   */
  value: boolean;

  /**
   * Creates a new instance of the `IsNarrow` class.
   * @param host The ReactiveControllerHost instance.
   * @param width The width threshold for determining if the viewport is narrow. Default is 800.
   */
  constructor(private host: ReactiveControllerHost, private width = 800) {
    this.value = false;
    this.host.addController(this);
    this.check();
  }

  private check() {
    const oldValue = this.value;
    this.value = document.documentElement.offsetWidth < this.width;
    if (oldValue !== this.value) {
      this.host.requestUpdate();
    }
  }

  private subscribe() {
    const check = () => this.check()
    listeners.push(check);
    return () => {
      listeners.splice(listeners.indexOf(check), 1);
    };
  }

  hostConnected() {
    this.unsubscribe = this.subscribe()
  }

  hostDisconnected() {
    this.unsubscribe?.()
  }

}
