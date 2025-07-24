import '@vaadin/tooltip/vaadin-tooltip.js';
import { customElement, property } from 'lit/decorators.js';

/**
 * Set the tooltip overlay background color to match the Lumo theme. 
 */
import watch from '@lit-app/shared/decorator/watch.js';
import { ContextConsumer, createContext } from '@lit/context';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { html, LitElement, nothing, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
const tooltipOverlay = css`
  [part='overlay'] {
    background: var(--color-inverse-surface) linear-gradient(var(--lumo-contrast-5pct), var(--lumo-contrast-5pct));
    color: var(--color-inverse-on-surface);
    font-size: var(--font-size-medium);
    line-height: var(--line-height-small);
  }
`;

registerStyles('vaadin-tooltip-overlay', [tooltipOverlay], { moduleId: 'lumo-tooltip-overlay' });

/**
 * Represents a map of tooltip definitions that can be used across components.
 * Each key is a unique identifier for a tooltip and the value contains tooltip properties.
 */
export type TooltipDefinitionsMapT = Map<string, string | TemplateResult>;

/**
 * Context that provides tooltip definitions throughout the application.
 * Components can consume this context to get tooltip configurations.
 */
export const tooltipDefinitionsContext = createContext<TooltipDefinitionsMapT>(
  Symbol('tooltip-definitions-context')
);

/**
 * A tooltip component. 
 * 
 * With Vaadin - this is the right approach when managing focus is important.
 * We use lapp-tooltip in forms
 * 
 * @example 
 * ```html
 * <vaadin-tooltip text="tooltip" for="button" ></vaadin-tooltip>
 * <md-filled-icon-button id="button" toggle aria-label="Label"
 *   <lapp-icon>format_bold</lapp-icon>
 * </md-filled-icon-button>
 * ``` 
 * 
 * 
 */
@customElement('lapp-tooltip')
export default class lappTooltip extends LitElement {
  static override styles = css`
    :host {
      display: contents;
      white-space: inherit;

      --_tooltip-background-color: var(--tooltip-background-color, var(--color-secondary-text));
      --_tooltip-border-color: var(--tooltip-border-color, var(--color-primary));
      --_tooltip-icon-color: var(--tooltip-icon-color, var(--color-secondary-text));
      --_tooltip-hover-color: var(--tooltip-hover-color, var(--color-on-secondary));

    }
    span {
      border-bottom: 2px dotted var(--_tooltip-border-color);
    }

    :host(:not([discrete])) span {
      margin: 0 0.32em 0 0.15em; /* adds spacing similar to word spacing */
      position: relative;
      border-radius: 2px;
      padding: 0.12em 0.25em 0em 0.25em;
      border-bottom: 2px dotted var(--_tooltip-background-color);
    }

    span:hover, span:focus {
      background-color: var(--_tooltip-background-color);
      color: var(--_tooltip-hover-color);
      cursor: pointer;
    }

    :host(:not([discrete])) span::after {
        content: "";
        position: absolute;
        background-color: var(--_tooltip-background-color);
        opacity: 0.1;
        inset: 0px;
        border-radius: 4px;
    }

    lapp-icon {
        width: 0.92em;
        height: 0.92em;
        font-size: 0.92em;
        color: var(--_tooltip-icon-color);
        position: absolute;
        right: -0.6em;
        top: -0.2em;
        border: 1px solid white;
         border-radius: 50%;
      }
  `

  private definitionConsumer!: ContextConsumer<typeof tooltipDefinitionsContext, this>;
  /**
   * `text` the text to display in the tooltip
   */
  @property() text: string = '';

  /**
   * `term` the term id to get tooltip for
   */
  @property() term!: string;
  @watch('term') termChanged(term: string) {
    if (term && !this.definitionConsumer) {
      this.definitionConsumer = new ContextConsumer(
        this, {
        context: tooltipDefinitionsContext,
        subscribe: true,
      });
    }
  }

  /** when true, render a discrete version, without icon and outline */
  @property({ type: Boolean, reflect: true }) discrete: boolean = false;

  /** To use to not make tooltips focusable */
  @property({ type: Boolean }) skipFocus: boolean = false;

  /** the icon to display with the tooltip - only used when discrete is false */
  @property() icon: string = 'info';

  // @property({ attribute: false }) definitions!: TooltipDefinitionsMapT;

  constructor() {
    super();
    this._generateId();
  }

  private _id!: string;
  private _generateId() {
    this._id = `tooltip-${tooltipCounter}`;
    tooltipCounter++;
  }

  private get _text() {
    if (this.term) {
      if (!this.definitionConsumer) {
        return `loading ${this.term}...`
      }
      const definition = this.definitionConsumer.value?.get(this.term);
      if (!definition) {
        return `missing definition for ${this.term}`
      }
      return definition;
    }
    return this.text;
  }

  protected override render() {
    const icon = this.discrete ? nothing : html`<lapp-icon>${this.icon}</lapp-icon>`;
    return html`
      <vaadin-tooltip for=${this._id} .text=${this._text as string}></vaadin-tooltip>
      <span tabindex=${ifDefined(this.skipFocus === true ? undefined : 0)} id=${this._id}><slot></slot>${icon}</span>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lapp-tooltip': lappTooltip;
  }
}

let tooltipCounter = 0