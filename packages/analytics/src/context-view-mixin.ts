import { ContextMixinFactory } from '@lit-app/shared/context/index.js';
import { createContext } from '@lit/context';
import { AnalyticsI } from './AnalyticsM.js';

// context for holding a reference to the form Firestore document
export const viewContext = createContext<AnalyticsI>('view-context');

export declare class ContextCustomerInterface {
  view: AnalyticsI;
}
export const {
  ConsumeMixin: ConsumeViewMixin,
  ProvideMixin: ProvideViewMixin
} = ContextMixinFactory<ContextCustomerInterface>(viewContext, 'view', undefined, true);
