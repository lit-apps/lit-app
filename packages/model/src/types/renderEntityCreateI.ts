import { RecursivePartial } from '@lit-app/shared/types.js';
import { HostElementI } from './actionTypes.js';
import { DataI } from './dataI'
import { DefaultI } from './entity.js';

// type PD<D extends D> = Partial<D> & { metaData: D["metaData"], ref: D["ref"] };
export interface StaticRenderInterface<D extends DefaultI> {
	processCreateData(host: HostElementI, data: RecursivePartial<D>): Partial<D>
	processCreateMetaData(host: HostElementI, metaData: unknown): Partial<DataI["metaData"]>
  processCreateRef(host: HostElementI, ref: unknown): Partial<DataI["ref"]>
}
export declare class RenderInterface<D extends DefaultI> {
	public processCreateData(data: RecursivePartial<D>): Partial<D>
	private processCreateMetaData(metaData: unknown): DataI["metaData"]
	private processCreateRef(ref: unknown): Partial<DataI["ref"]>
}