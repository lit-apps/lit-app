import '@vaadin/grid/theme/material/vaadin-grid-column.js';
import '@vaadin/grid/theme/material/vaadin-grid-sort-column.js';
import '@vaadin/grid/theme/material/vaadin-grid.js';
import AbstractEntity from './AbstractEntity';
import type { RenderInterface } from './types/renderEntityCreateI';
import { DataI } from './types/dataI';

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
	class R extends superclass {

		/** 
		 * returns data to be stored in the database when creating a new entity
		 * @param userID - the user owning the entity - it can be a different user than the one logged in
		 * @param businessID - the business owning the entity
		 * @param organisationOwnerID - the organisation owning the entity (e.g. ida_secretariat)
		 * @param appOwnerID - the group owning the entity (e.g. gds)
		 */

		processCreateData(data: Partial<D> = {}) {
			return {
				...data,
				metaData: this.processCreateMetaData(data.metaData),
				ref: this.processCreateRef(data.ref)
			}
		}

		processCreateMetaData(metaData: Partial<D["metaData"]> = {}) {
			// if (typeof metaData !== 'object' || metaData === null) {
			// 	throw new Error('metaData must be an object');
			// }
			return {
				type: this.entityName,
				deleted: false,
				access: {
					app: this.host.appID || null,
					status: 'private'
				},
				...metaData,
			}
		}

		processCreateRef(ref: Partial<D["ref"]> = {}) {
			return {
				app: this.host.appID || null,
				...ref,
			}
		}

	};
	return R as unknown as Constructor<RenderInterface<D>> & typeof superclass;
}
