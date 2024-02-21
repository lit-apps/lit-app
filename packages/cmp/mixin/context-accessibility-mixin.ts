import { LitElement, adoptStyles } from 'lit';
import { property } from 'lit/decorators.js'
import { consume, provide, createContext } from '@lit/context';
import { showWhenAccessibility } from '@preignition/preignition-styles';

type Accessibility = {
	signlanguage: boolean,
	voice: boolean,
	readaloud: boolean,
	readaloudConfig: {
		rate: number
	},
	easyread: boolean,
	easyreadEmulate: boolean,
	accessibleDevice: boolean
}

export const accessibilityContext = createContext<Accessibility>('accessibility-context');
type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * ConsumeAccessibilityMixin a mixin that consumes accessibility context:
 */
export declare class ContextAccessibilityMixinInterface {
	accessibility: Accessibility;
	get accessibilityClasses(): {
		issignlanguage: boolean;
		isreadaloud: boolean;
		iseasyread: boolean;
	};
}

export const ConsumeAccessibilityMixin = <T extends Constructor<LitElement>>(superClass: T) => {

	class ContextConsumeAccessibilityMixinClass extends superClass {
		
		@consume({ context: accessibilityContext })
		@property() accessibility!: Accessibility;

		// we add showWhenAccessibility styles to the renderRoot
		protected override createRenderRoot() {
			const root = super.createRenderRoot() as ShadowRoot;
			adoptStyles(root, [...root.adoptedStyleSheets, showWhenAccessibility]);
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
				iseasyread: this.accessibility?.easyread || this.accessibility?.easyreadEmulate || false
			}
		}
	};
	return ContextConsumeAccessibilityMixinClass as unknown as Constructor<ContextAccessibilityMixinInterface> & T;
}

/**
 * ProvideAccessibilityMixin a mixin that consumes accessibility context:
 */
export const ProvideAccessibilityMixin = <T extends Constructor<LitElement>>(superClass: T) => {

	class ContextProvideAccessibilityMixinClass extends superClass {
		@provide({ context: accessibilityContext })
		@property() accessibility!: Accessibility;
	};

	return ContextProvideAccessibilityMixinClass as unknown as Constructor<ContextAccessibilityMixinInterface> & T;
}
