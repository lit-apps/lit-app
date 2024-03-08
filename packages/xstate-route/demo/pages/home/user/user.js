import { html, LitElement } from "lit";
import { ROUTER_SLOT_TAG_NAME } from "router-slot";
import { queryParentRouterSlot } from "router-slot";
import { sharedStyles } from "../../styles";
export default class UserComponent extends LitElement {
    static { this.styles = [sharedStyles]; }
    get params() {
        return queryParentRouterSlot(this).match.params;
    }
    connectedCallback() {
        super.connectedCallback();
        const parent = queryParentRouterSlot(this);
        if (parent != null) {
            console.log("PARENT!!!!!!!!", { param: parent.params });
        }
    }
    firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties);
        const $routerSlot = this.shadowRoot.querySelector(ROUTER_SLOT_TAG_NAME);
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
    render() {
        const { user, dashId } = this.params;
        return html `
			<p>UserComponent</p>
			<p>:user = <b>${user}</b></p>
			<p>:dashId = <b>${dashId}</b></p>
			<router-link path="edit">Go to EditComponent</router-link>
			<router-slot @changestate="${(e) => console.log("State changed", e)}"></router-slot>
		`;
    }
}
window.customElements.define("user-component", UserComponent);
//# sourceMappingURL=user.js.map