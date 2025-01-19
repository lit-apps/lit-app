import { showWhenAccessibility } from '@lit-app/shared/styles';
import { ContextProvider, consume, createContext } from '@lit/context';
import { LitElement, adoptStyles } from 'lit';
import { property } from 'lit/decorators.js';
import { StateController } from '../../state/src';
import { AccessibilityStateI } from '../../state/src/types';


export const accessibilityContext = createContext<AccessibilityStateI>('accessibility-context');
type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * ConsumeAccessibilityMixin a mixin that consumes accessibility context:
 */
export declare class ContextAccessibilityMixinInterface {
	accessibility: AccessibilityStateI;
	get accessibilityClasses(): {
		issignlanguage: boolean;
		isreadaloud: boolean;
		iseasyread: boolean;
	};
}

export const ConsumeAccessibilityMixin = <T extends Constructor<LitElement>>(superClass: T) => {

	class ContextConsumeAccessibilityMixinClass extends superClass {

		@consume({ context: accessibilityContext, subscribe: true })
		@property({ attribute: false }) accessibility!: AccessibilityStateI;

		// we add showWhenAccessibility styles to the renderRoot
		protected override createRenderRoot() {
			const root = super.createRenderRoot() as ShadowRoot;
			adoptStyles(root, [...(root.adoptedStyleSheets || []), showWhenAccessibility]);
			return root;
		}

		/**
		 * @returns {Object} - object with classes for each accessibility feature
		 * this is to be used in situations like: 
		 * ```return html`<div class="value ${classMap(this.accessibilityClasses)}">${parse(this.format(value))}</div>````
		 */
		get accessibilityClasses() {
			return {
				issignlanguage: this.accessibility?.signlanguage || false,
				isreadaloud: this.accessibility?.readaloud || false,
				iseasyread: this.accessibility?.easyread ||
					this.accessibility?.easyreadEmulate || false
			}
		}
	};
	return ContextConsumeAccessibilityMixinClass as unknown as
		Constructor<ContextAccessibilityMixinInterface> & T;
}

/**
 * ProvideAccessibilityMixin a mixin that provides accessibility context:
 * Any time accessibility state is updated, it will update the context and notify consumers
 * 
 * We are gradually switching to use context approach in order to better adapt to DOM native API, and are not 
 * sure about how state will work when we distribute part of the app as web components.
 */
export const ProvideAccessibilityMixin =
	(state: AccessibilityStateI) =>
		<T extends Constructor<LitElement>>(superClass: T) => {

			class ContextProvideAccessibilityMixinClass extends superClass {

				// this controller pass updated state value to consumers
				_accessibilityProvider = new ContextProvider(
					this,
					{ context: accessibilityContext, initialValue: state }
				);

				// this controller notify _accessibilityProvider about accessibility state changes
				_accessibilityStateController = new StateController(
					this,
					state,
					() => this._accessibilityProvider.setValue(state, true)
				);
			};

			return ContextProvideAccessibilityMixinClass as unknown as
				Constructor<ContextAccessibilityMixinInterface> & T;
		}
