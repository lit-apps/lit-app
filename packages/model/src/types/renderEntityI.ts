import { TemplateResult } from 'lit';
import { Actions } from './action';
import { Collection, CollectionI } from './dataI';
import { DefaultI, RenderConfig } from './entity';
import { RenderInterface as RenderActionInterface } from './renderEntityActionI';
import { ModelComponent } from './modelComponent.js';
import { Parser } from '@json2csv/plainjs';

export declare class RenderInterface<
	D extends DefaultI = DefaultI, 
	A extends Actions = Actions,
	C extends RenderConfig = RenderConfig
> extends RenderActionInterface<D, A> {
	showMetaData: boolean
	itemIdPath: string
	
	public renderFooter(_data: D, _config: C): TemplateResult
	public renderBody(data: D, config: C): TemplateResult
	public renderHeader(data: D, config: C): TemplateResult
	public renderSubHeader(data: D, config: C): TemplateResult
	
	private renderArrayContent(data: Collection<D>, config: C): TemplateResult
	private renderGrid(data: Collection<D>, config: C): TemplateResult
	/* renderContent should be private, but we use it in renderEntityActionMixin */
	protected onGridDblClick(e: CustomEvent ): void
  protected onActiveItemChanged(e: CustomEvent): void
	protected renderDataLoading( config: C): TemplateResult
	protected renderTitle(data: D, config: C): TemplateResult | string
	protected renderArrayTitle(data: Collection<D>, config: C): TemplateResult | string
	protected renderGridColumns(config: C): TemplateResult
	protected renderGridDetail(data: CollectionI<D>, config: C, _model: any, _grid: any): TemplateResult
	protected renderTable(data: CollectionI<D>, config: C, tableFields?: [string, ModelComponent][]): TemplateResult
	protected renderMetaData(_data: D, _config: C): TemplateResult
	protected renderCard(data: Collection<D>, config: C): TemplateResult
	protected renderCardItem(data: D, config: C, index?: number): TemplateResult
	protected renderEmptyArray(_config: C): TemplateResult
	protected renderList(_data: Collection<D>, _config: C): TemplateResult
	protected renderListItem(_data: D, _config: C): TemplateResult
	public renderFormNew(data: D, config: C): TemplateResult
	public renderForm(data: D, config: C): TemplateResult
	public getCsvParser(renderConfig: C): Parser<any, any>
}