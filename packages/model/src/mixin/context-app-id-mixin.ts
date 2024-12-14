import { createContext } from '@lit/context';
import { ContextMixinFactory } from '@lit-app/shared/context/context-mixin-factory.js';

export const appIdContext = createContext<string>('app-id-context');
export const {
	ConsumeMixin: ConsumeAppIdMixin, 
	ProvideMixin: ProvideAppIdMixin
} = ContextMixinFactory<{appID: string}>(appIdContext, 'appID');
