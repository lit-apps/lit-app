import { Parser } from '@json2csv/plainjs';
import { TemplateResult } from 'lit';
import { Collection, CollectionI } from './dataI';
import { DefaultI, RenderConfig } from './entity';
import { ModelComponent } from './modelComponent.js';

export declare abstract class RenderInterface<
	D extends DefaultI = DefaultI,
	C extends RenderConfig = RenderConfig
> {
	showMetaData: boolean
	itemIdPath: string

	protected onGridDblClick(e: CustomEvent): void
	protected onActiveItemChanged(e: CustomEvent): void
	// getEntityData(data: D | Collection<D>, config: C): unknown
	// getDataProvider(data: unknown, config: C): undefined | GridDataProvider<D>
	protected renderDataLoading(config: C): TemplateResult
	// protected renderTitle(data: D, config: C): TemplateResult | string
	protected renderArrayTitle(data: Collection<D>, config: C): TemplateResult | string
	renderGridColumns(config: C): TemplateResult
	protected renderGridEmptyState(config: C): TemplateResult
	protected renderGridDetail(data: CollectionI<D>, config: C, _model: any, _grid: any): TemplateResult
	renderTable(data: CollectionI<D>, config: C, tableFields?: [string, ModelComponent][]): TemplateResult
	protected renderMetaData(_data: D, _config: C): TemplateResult
	protected renderCard(data: Collection<D>, config: C): TemplateResult
	renderGrid(data: Collection<D>, config: C): TemplateResult
	protected renderCardItem(data: D, config: C, index?: number): TemplateResult
	protected renderEmptyArray(_config: C): TemplateResult
	protected renderList(_data: Collection<D>, _config: C): TemplateResult
	protected renderListItem(_data: D, _config: C): TemplateResult
	protected renderArrayContent(data: Collection<D>, config: C): TemplateResult;
	canRender(data: D, config: C): boolean
	renderFooter(_data: D, _config: C): TemplateResult
	renderBody(data: D, config: C): TemplateResult
	renderHeader(data: D, config: C): TemplateResult
	renderSubHeader(data: D, config: C): TemplateResult
	renderBody(data: D, config: C): TemplateResult;
	/* renderContent should be private, but we use it in renderEntityActionMixin */
	renderContent(data: D, config: C): TemplateResult;
	renderHeader(data: D | Collection<D>, config: C): TemplateResult;
	renderSubHeader(data: D, config: C): TemplateResult;
	renderFooter(data: D, config: C): TemplateResult;
	renderForm(data: D, config: C): TemplateResult;
	renderFormNew(data: D, config: C): TemplateResult;
	renderFieldUpdate(name: string, config: any, data?: D): TemplateResult;
	getCsvParser(renderConfig: C | undefined): Parser<any, any>;
	renderTitle(data: D, config: C): TemplateResult | string;
	getDefaultData(): Partial<D>;
}

export interface StaticRenderEntity<
	D extends DefaultI = DefaultI,
	C extends RenderConfig = RenderConfig
> extends Pick<RenderInterface<D, C>, 'getCsvParser' | 'renderGridColumns' | 'renderTable' | 'getDefaultData'> {

}