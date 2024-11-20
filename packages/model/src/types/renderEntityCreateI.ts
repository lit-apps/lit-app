import { DataI } from './dataI'
import { DefaultI } from './entity.js';
export declare class RenderEntityCreateInterface<D extends DefaultI> {
	public processCreateData(data: Partial<D>): Partial<D>
	protected processCreateMetaData(metaData: unknown): DataI["metaData"]
	protected processCreateRef(ref: unknown): Partial<DataI["ref"]>
}