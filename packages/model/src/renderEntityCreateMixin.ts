import '@vaadin/grid/theme/material/vaadin-grid-column.js';
import '@vaadin/grid/theme/material/vaadin-grid-sort-column.js';
import '@vaadin/grid/theme/material/vaadin-grid.js';
import AbstractEntity from './entityAbstract';

import { DataI } from './types/dataI';

type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * 
 * Mixin in charge of creating new Entity data
 * 
 */



export declare class RenderEntityCreateInterface<D extends DataI> {
	getNewData(...args: any[]): Partial<D>
	protected processCreateData(data: Partial<D>): Partial<D>
	protected processCreateMetaData(metaData: Partial<D["metaData"]>): Partial<D["metaData"]>
	protected processCreateRef(ref: Partial<D["ref"]>): Partial<D["ref"]>
}
/**
 * RenderMixin 
 */
export default function renderMixin<D extends DataI>(superclass: Constructor<AbstractEntity>) {
	class R extends superclass {

		/** 
		 * returns data to be stored in the database when creating a new entity
		 * @param userID - the user owning the entity - it can be a different user than the one logged in
		 * @param businessID - the business owning the entity
		 * @param organisationOwnerID - the organisation owning the entity (e.g. ida_secretariat)
		 * @param appOwnerID - the group owning the entity (e.g. gds)
		 */
		// TODO : this should be a static method		
		getNewData(..._args: any[]): Partial<D> {
			// @ts-ignore
			return {}
		}

		processCreateData(data: Partial<D> = {}) {
			return {
				...data,
				metaData: this.processCreateMetaData(data.metaData),
				ref: this.processCreateRef(data.ref)
			}
		}

		processCreateMetaData(metaData: Partial<D["metaData"]> = {}) {
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
	return R as unknown as Constructor<RenderEntityCreateInterface<D>> & typeof superclass;
}
