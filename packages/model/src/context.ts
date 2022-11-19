/**
 * context for entity management
 */
 import {createContext} from '@lit-labs/context';

import {
	EntityStatus,
	EntityAccess,
} from './types';

export const entityStatusContext = createContext<EntityStatus>('entity-status-context');
export const entityAccessContext = createContext<EntityAccess>('entity-access-context');