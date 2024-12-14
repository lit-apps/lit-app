import { ContextMixinFactory } from '@lit-app/shared/context/context-mixin-factory.js';
import { createContext } from '@lit/context';

type DocIdT = string | undefined;
export const docIdContext = createContext<DocIdT>('doc-id-context');
export const {
	ConsumeMixin: ConsumeDocIdMixin,
	ProvideMixin: ProvideDocIdMixin
} = ContextMixinFactory<{ docId: DocIdT }>(docIdContext, 'docId');
