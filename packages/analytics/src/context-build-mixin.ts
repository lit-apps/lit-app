import { BuildResultLocaleI } from '@lit-app/app-survey/src/entity/BuildM.js';
import { ContextMixinFactory } from '@lit-app/shared/context/index.js';
import { createContext } from '@lit/context';

// context for holding a reference to the form Firestore document
export const buildContext = createContext<BuildResultLocaleI>('build-context');

export declare class ContextCustomerInterface {
  build: BuildResultLocaleI;
}
export const {
  ConsumeMixin: ConsumeBuildMixin,
  ProvideMixin: ProvideBuildMixin
} = ContextMixinFactory<ContextCustomerInterface>(buildContext, 'build', undefined, true);
