import { CSSResult, nothing, TemplateResult } from 'lit';
import {
	Model
} from './types/modelComponent';
import entries from './typeUtils/entries';

import {
	AnyEvent, Create, EntityCreateDetail, Open
} from './events';
import {
	 Actions
} from './types/action';
import {
	EntityElement
} from './types/entity';
import { ToastEvent } from '@lit-app/event';
import { PartialBy, Role, Strings } from './types';
import { GetAccess } from './types/getAccess';

export interface StaticEntityI<D = any> {
	entityName: string
	icon: string
	model: Model<D>
	actions: Actions
	styles: CSSResult | CSSResult[];
	getAccess: GetAccess
	locale?: Strings
	roles: Role[]
	userLoader: (search: string) => Promise<any>
}

export interface PublicEntityMethods {
	/* Some render methods are used in generic components - we declare them here */
	/* main render method  */
	
	renderBody(data: any, config?: any): TemplateResult | typeof nothing
	
	renderHeader(data: any, config?: any): TemplateResult | typeof nothing
	
	renderFooter(data: any, config?: any): TemplateResult | typeof nothing
	
	/* dialog methods  */
	
	renderCreateDialog(data: any, config?: any): TemplateResult | typeof nothing
	
	/* main action method  */
	renderAction(this: AbstractEntity, name: keyof typeof this['actions'], data: any, config?: any): TemplateResult | typeof nothing

	/* action methods  */
	create(details: PartialBy<EntityCreateDetail, 'entityName'>): Create
	open(entityName: string, id?: string): Open | null
}

export interface EntityI extends AbstractEntity, PublicEntityMethods {}

/**
 * Abstract class for entities
 */

export default class AbstractEntity  {

	static declare entityName: string
	static declare icon: string
	static declare model: Model<any>
	static declare actions: Actions
	static declare styles: CSSResult | CSSResult[];
	static locale?: Strings
	static roles: Role[] = [
		{ name: 'owner', level: 1 },
		{ name: 'admin', level: 2 },
		{ name: 'editor', level: 3 },
		{ name: 'guest', level: 4 }]

	static userLoader: (search: string) => Promise<any>

	/**
	 * The access control for this entity - this needs to be overridden in subclasses
	 * Ideally we would like to make this static protected, but TS prevents this
	 * See https://github.com/microsoft/TypeScript/issues/34516 
	 * and https://github.com/Microsoft/TypeScript/issues/14600
	 * { 
	 *   isOwner: (_access: Access, _data: any) => true,
	 *   canEdit: (_access: Access, _data: any) => true,
	 *   canView: (_access: Access, _data: any) => true,
	 *   canDelete: (_access: Access, _data: any) => true
	 * }
	 */
	static declare getAccess: GetAccess
	
	/**
	 * inspired from https://github.com/Microsoft/TypeScript/issues/3841#issuecomment-1488919713
	 * We will need to set the type of constructor on all subclasses so that
	 * the type of actions is properly inferred. 
	 */
	declare ['constructor']: typeof AbstractEntity;

	// define a private _icon property to be used by the icon getter
	_icon!: string
	get icon(): string {
		return this._icon || this.constructor.icon
	}
	set icon(icon: string) {
		this._icon = icon
		this.host.requestUpdate()
	}

	_selected: number = 0
	get selected(): number {
		return this._selected
	}
	set selected(selected: number) {
		this._selected = selected
		this.host.requestUpdate()
	}

	get entityName() {
		return (this.constructor).entityName

	}
	get model() {
		return (this.constructor).model
	}

	get actions() {
		return (this.constructor).actions;
	}

	/**
 * @param element the element to render the action on
 * @param realTime when true, will dispatch update events on data-input 
 *         this also changes the rendering of renderEntityActions
 * @param listenOnAction when true, will listen to action events on the element
 */
	constructor(public host: EntityElement, public realTime: boolean = false, public listenOnAction: boolean = false) {
		
		if(!this.constructor.entityName) {
			throw new Error('entityName is required')
		}
		if(!this.constructor.model) {
			throw new Error(`model is required for  ${this.entityName}`)
		}
		if(!this.constructor.actions) {
			throw new Error(`actions is required for  ${this.entityName}`)
		}

		host.addController(this);
		// we only add event listeners if the element is a dataController (e.g. skip list and grids)
		if (this.listenOnAction) {
			entries<Actions>(this.actions).forEach(([_k, action]) => {
				if (action.event && action.onAction) {
					host.addEventListener(action.event.eventName, ((event: AnyEvent) => {
						action.onAction?.call(this.host, event)
						event.onActionProcessed = true;
					}) as EventListener)
				}
			})
		}
		// @ts-ignore
		if (import.meta.hot) {
			// @ts-ignore
			import.meta.hot.accept((Entity: AbstractEntity) => {
				console.info('Entity HMR', Entity)
				if (Entity) {
					this.host.requestUpdate()
				}
			})
		}
	}
	/**
 * Bind an Entity with a LitElement. 
 * This needs to be done before any other operations like rendering can be performed.
 * @param el ReactiveElement
 */
	public bind(el: EntityElement) {
		this.host = el;
	}


	/* hostConnected is required by the controller interface */
	hostConnected() {
	}
	/* hostDisconnected is required by the controller interface */
	hostDisconnected() {
	}

	/* renderContent is required by the controller interface because it participate to subclass instantiation */
	renderContent(_data: any, _config?: any): TemplateResult | typeof nothing {
		return nothing
	}
	onError(error: Error) {
		console.error(error)
		// TODO: centralize the way we handler errors (see stripe-web-sdk for inspiration)
		// For the time being, we just dispatch Toast Event
		this.host?.dispatchEvent(new ToastEvent(error.message, 'error'))
	}

	// @-ts-expect-error


}
