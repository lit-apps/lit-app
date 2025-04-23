import type { MixinBase, MixinReturn } from '@lit-app/shared/types.js';
import { consume, createContext, provide } from '@lit/context';
import { ReactiveElement } from 'lit';
import { property } from 'lit/decorators.js';

export const uidContext = createContext<string>('uid-context');
export const superAdminContext = createContext<boolean>('super-admin-context');

/**
 * ConsumeUidMixin a mixin that consumes uid context
 */
export declare class UidMixinInterface {
	uid: string;
	superAdmin: boolean;
}

export const ConsumeUidMixin = <T extends MixinBase<ReactiveElement>>(
	superClass: T
): MixinReturn<T, UidMixinInterface> => {

	abstract class ContextConsumeUidMixinClass extends superClass {
		@consume({ context: uidContext, subscribe: true })
		@property() uid!: string;
		@consume({ context: superAdminContext, subscribe: true })
		@property() superAdmin!: boolean;
	};
	return ContextConsumeUidMixinClass;
}

/**
 * ProvideUidMixin a mixin that provides uid context
 */
export const ProvideUidMixin = <T extends MixinBase<ReactiveElement>>(
	superClass: T
): MixinReturn<T, UidMixinInterface> => {

	abstract class ContextProvideUidMixinClass extends superClass {
		@provide({ context: uidContext })
		@property() uid!: string;
		@provide({ context: superAdminContext })
		@property() superAdmin!: boolean;
	};

	return ContextProvideUidMixinClass;
}
