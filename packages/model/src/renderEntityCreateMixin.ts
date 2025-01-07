
import AbstractEntity from './AbstractEntity';
import '@vaadin/grid/lit-all-imports.js'
import type { RenderInterface, StaticRenderInterface } from './types/renderEntityCreateI';
import { DataI } from './types/dataI';
import { HostElementI } from './types/actionTypes.js';
import { PartialBy, RecursivePartial } from '@lit-app/shared/types.js';

type Constructor<T = {}> = new (...args: any[]) => T;
export {
	RenderInterface
}

/**
 * 
 * Mixin in charge of creating new Entity data
 * 
 */
export default function renderMixin<D extends DataI>(
	superclass: Constructor<AbstractEntity<D>>
) {
	const staticApply: {
		entityName?: string,
	} & StaticRenderInterface<D> = {

		processCreateData( host: HostElementI<D>, data: RecursivePartial<D> = {}): Partial<D> {
			return {
				...data,
				metaData: this.processCreateMetaData(host, data.metaData ),
				ref: this.processCreateRef(host, data.ref)
			} as Partial<D>;
		},

		processCreateMetaData( host: HostElementI<D>, metaData: Partial<D["metaData"]> = {})  {
			// if (typeof metaData !== 'object' || metaData === null) {
			// 	throw new Error('metaData must be an object');
			// }
			return {
				type: this.entityName,
				deleted: false,
				access: {
					app: host.appID || null,
					status: 'private'
				},
				...metaData,
			}
		},

		processCreateRef( host: HostElementI<D>, ref: Partial<D["ref"]> = {}) {
			return {
				app: host.appID || null,
				...ref,
			}
		}

	}

	class R extends superclass {

		// @ts-expect-error - we are cheating
		declare ['constructor']: typeof staticApply
		
		/** 
		 * returns data to be stored in the database when creating a new entity
		 * @param userID - the user owning the entity - it can be a different user than the one logged in
		 * @param businessID - the business owning the entity
		 * @param organisationOwnerID - the organisation owning the entity (e.g. ida_secretariat)
		 * @param appOwnerID - the group owning the entity (e.g. gds)
		 */

		processCreateData(data: Partial<D> = {}) {
			return this.constructor.processCreateData(this.host, data);
		}

		private processCreateMetaData(metaData: Partial<D["metaData"]> = {}) {
			return this.constructor.processCreateMetaData(this.host, metaData);
		}

		private processCreateRef(ref: Partial<D["ref"]> = {}) {
			return this.constructor.processCreateRef(this.host, ref);
		}

	};
	Object.assign(R, staticApply);
	return R as unknown as Constructor<RenderInterface<D>> & typeof superclass & StaticRenderInterface<Partial<D>>;
}
