import { DataI } from './dataI'
export declare class RenderEntityCreateInterface<D extends DataI> {
	public processCreateData(data: Partial<D>): Partial<D>
	protected processCreateMetaData(metaData: any): D["metaData"]
	protected processCreateRef(ref: Partial<D["ref"]>): Partial<D["ref"]>
}