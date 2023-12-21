import { consume, ContextProvider, createContext } from '@lit/context';
import { PropertyValues, ReactiveElement } from 'lit';
import { state, property } from 'lit/decorators.js';

export const docIdContext = createContext<DocId>('doc-id-context');

type Constructor<T = {}> = new (...args: any[]) => T;
type DocId = string | undefined;
/**
 * ConsumeDocIdMixin a mixin that consumes data context
 */
export declare class DocIdMixinInterface {
	get docId(): DocId;
	docIdProvider?: ContextProvider<typeof docIdContext>;
}

export const ConsumeDocIdMixin = <T extends Constructor<ReactiveElement>>(superClass: T) => {

	class ContextConsumeDocIdMixinClass extends superClass {
		@consume({ context: docIdContext, subscribe: true })
		@property() docId!: DocId;
	};
	return ContextConsumeDocIdMixinClass as unknown as Constructor<DocIdMixinInterface> & T;
}

/**
 * ProvideDocIdMixin a mixin that provides docID context
 */
export const ProvideDocIdMixin = <T extends Constructor<ReactiveElement >>(superClass: T) => {

	class ContextProvideDocIdMixinClass extends superClass {

		docId: DocId;
		docIdProvider = new ContextProvider(this, {context: docIdContext, initialValue: this.docId});

	};

	return ContextProvideDocIdMixinClass as unknown as Constructor<DocIdMixinInterface> & T;
}
