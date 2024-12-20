import { consume, ContextProvider, createContext } from '@lit/context';
import { ReactiveElement } from 'lit';
import { property } from 'lit/decorators.js';

export const docIdContext = createContext<DocId>('doc-id-context');

type Constructor<T = {}> = abstract new (...args: any[]) => T;
type DocId = string | undefined;
/**
 * ConsumeDocIdMixin a mixin that consumes data context
 */
export declare class DocIdMixinInterface {
	get docId(): DocId;
	docIdProvider?: ContextProvider<typeof docIdContext>;
}

export const ConsumeDocIdMixin = <T extends Constructor<ReactiveElement>>(superClass: T) => {

	abstract class ContextConsumeDocIdMixinClass extends superClass {
		@consume({ context: docIdContext, subscribe: true })
		@property() docId!: DocId;
	};
	return ContextConsumeDocIdMixinClass as unknown as Constructor<DocIdMixinInterface> & T;
}

/**
 * ProvideDocIdMixin a mixin that provides docID context
 */
export const ProvideDocIdMixin = <T extends Constructor<ReactiveElement >>(superClass: T) => {

	abstract class ContextProvideDocIdMixinClass extends superClass {

		docId: DocId;
		docIdProvider = new ContextProvider(this, {context: docIdContext});

	};

	return ContextProvideDocIdMixinClass as unknown as Constructor<DocIdMixinInterface> & T;
}
