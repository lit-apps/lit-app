import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('lapp-animated-counter')
export class AnimatedCounter extends LitElement {
  @property()
  headline = 'Counter';

  @property({ type: Number })
  value = 0;

  @property({ type: Number })
  partialValue: number | undefined = undefined;

  @state()
  private currentValue = 0;
  @state()
  private currentPartialValue = 0;

  private animationFrameId: number | null = null;

  static override styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--lapp-animated-counter-padding, 2rem);
      box-sizing: border-box;
    }

    .headline, ::slotted(*) {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }

    .counter {
      font-size: var(--lapp-animated-counter-font-size, 4rem);;
      font-weight: bold;
    }
  `;

  override updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('value') || changedProperties.has('partialValue')) {
      this.animateCounter();
    }
  }

  private animateCounter() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    const start = this.currentValue;
    const end = this.value;
    const duration = 1000; // Animation duration in milliseconds
    const startTime = performance.now();
    const partialStart = this.currentPartialValue;
    const partialEnd = this.partialValue;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      this.currentValue = Math.round(start + (end - start) * easeOutQuart);
      if (this.partialValue !== undefined) {
        this.currentPartialValue = Math.round(partialStart + (partialEnd! - partialStart) * easeOutQuart);
      }

      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(animate);
      }
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  override render() {
    return html`
      <slot name="headline">
        <div class="headline">${this.headline}</div>
      </slot>
      <div class="counter">${this.partialValue !== undefined ? `${this.currentPartialValue}/` : ''}${this.currentValue}</div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-animated-counter': AnimatedCounter;
  }
}