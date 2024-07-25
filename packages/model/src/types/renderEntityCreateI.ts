import { DataI } from './dataI'
export declare class RenderEntityCreateInterface<D extends DataI> {
	// getNewData(...args: any[]): Partial<D>
	public processCreateData(data: Partial<D>): Partial<D>
	// metaData is any because restriting it to D["metaData"] causes an error with extended Objects. 
	protected processCreateMetaData(metaData: any): D["metaData"]
	protected processCreateRef(ref: Partial<D["ref"]>): Partial<D["ref"]>
}