import { html, LitElement, PropertyValues, TemplateResult } from "lit";
import { ROUTER_SLOT_TAG_NAME } from "router-slot";
import { IRouterSlot, Params } from "router-slot";
import { queryParentRouterSlot } from "router-slot";
import { sharedStyles } from "../../styles";

export default class UserComponent extends LitElement {
	static styles = [sharedStyles];

	get params (): Params {
		return queryParentRouterSlot(this)!.match!.params;
	}

	connectedCallback (): void {
		super.connectedCallback();
		const parent = queryParentRouterSlot(this);
		if (parent != null) {
			console.log("PARENT!!!!!!!!", {param: parent.params});
		}
	}

	firstUpdated (changedProperties: PropertyValues) {
		super.firstUpdated(changedProperties);

		const $routerSlot = this.shadowRoot!.querySelector<IRouterSlot>(ROUTER_SLOT_TAG_NAME)!;
		$routerSlot.add([
			{
				path: "edit",
				component: () => import("./edit/edit")
			}
		]);
	}

	/**
	 * Renders the element.
	 * @returns {TemplateResult}
	 */
	render (): TemplateResult {
		const {user, dashId} = this.params;
		return html`
			<p>UserComponent</p>
			<p>:user = <b>${user}</b></p>
			<p>:dashId = <b>${dashId}</b></p>
			<router-link path="edit">Go to EditComponent</router-link>
			<router-slot @changestate="${(e: Event) => console.log("State changed", e)}"></router-slot>
		`;
	}

}

window.customElements.define("user-component", UserComponent);
