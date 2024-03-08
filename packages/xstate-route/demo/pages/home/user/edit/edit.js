import { html, LitElement } from "lit";
import { GLOBAL_ROUTER_EVENTS_TARGET } from "router-slot";
import { sharedStyles } from "../../../styles";
export default class EditComponent extends LitElement {
    static { this.styles = [sharedStyles]; }
    connectedCallback() {
        super.connectedCallback();
        const confirmNavigation = (e) => {
            console.log(e);
            // Check if we should navigate away from this page
            if (!confirm("You have unsafed data. Do you wish to discard it?")) {
                e.preventDefault();
                return;
            }
            GLOBAL_ROUTER_EVENTS_TARGET.removeEventListener("willchangestate", confirmNavigation);
        };
        GLOBAL_ROUTER_EVENTS_TARGET.addEventListener("willchangestate", confirmNavigation);
    }
    render() {
        return html `
			<p>EditComponent</p>
		`;
    }
}
window.customElements.define("edit-component", EditComponent);
//# sourceMappingURL=edit.js.map