import { RecursivePartial } from '@lit-app/shared/types.js';
import { HostElementI } from './actionTypes.js';
import { DataI } from './dataI';
import { DefaultI } from './entity.js';

export type MetaDataFromD<D> = D extends { metaData: any } ? D["metaData"] : never;
export type RefFromD<D> = D extends { ref: any } ? D["ref"] : never;

// type PD<D extends D> = Partial<D> & { metaData: D["metaData"], ref: D["ref"] };
export interface StaticRenderInterface<D extends DefaultI> {
	processCreateData(host: HostElementI, data: RecursivePartial<D>): Partial<D>
	// processCreateMetaData(host: HostElementI, metaData: unknown): Partial<DataI["metaData"]>
	// processCreateRef(host: HostElementI, ref: unknown): Partial<DataI["ref"]>
	processCreateMetaData(host: HostElementI, metaData: unknown): MetaDataFromD<D>
	processCreateRef(host: HostElementI, ref: unknown): RefFromD<D>
	// renderTitle(data: any, config: any): any;
}
export declare class RenderInterface<D extends DefaultI> {
	public processCreateData(data: RecursivePartial<D>): Partial<D>
	private processCreateMetaData(metaData: unknown): DataI["metaData"]
	private processCreateRef(ref: unknown): Partial<DataI["ref"]>
	// renderTitle(data: any, config: any): any;
	// using MetaDataFromD<D> and RefFromD<D> does not work - 
	// processCreateMetaData(metaData: unknown): MetaDataFromD<D>
	// private processCreateRef(ref: unknown): RefFromD<D>
}