import { DataI } from './dataI'
export declare class RenderEntityCreateInterface<D extends DataI> {
	getNewData(...args: any[]): Partial<D>
	protected processCreateData(data: Partial<D>): Partial<D>
	protected processCreateMetaData(metaData: Partial<D["metaData"]>): Partial<D["metaData"]>
	protected processCreateRef(ref: Partial<D["ref"]>): Partial<D["ref"]>
}