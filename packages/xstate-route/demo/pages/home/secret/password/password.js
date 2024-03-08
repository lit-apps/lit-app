import { html, LitElement } from "lit";
import { showDialog } from "weightless";
import { GLOBAL_ROUTER_EVENTS_TARGET, ROUTER_SLOT_TAG_NAME } from "router-slot";
import { addListener } from "router-slot";
import { basePath, path } from "router-slot";
import { sharedStyles } from "../../../styles";
import { data } from "../data";
export default class PasswordComponent extends LitElement {
    static { this.styles = [sharedStyles]; }
    firstUpdated() {
        super.connectedCallback();
        const $routerSlot = this.shadowRoot.querySelector(ROUTER_SLOT_TAG_NAME);
        $routerSlot.add([
            {
                path: "dialog",
                resolve: (async ({ slot, match }) => {
                    const DialogComponent = (await import("../../../../dialog/dialog")).default;
                    const $dialog = new DialogComponent();
                    $dialog.parent = slot;
                    function cleanup() {
                        if (document.body.contains($dialog)) {
                            document.body.removeChild($dialog);
                        }
                    }
                    $dialog.addEventListener("close", () => {
                        history.pushState(null, "", `${basePath()}home/secret/password`);
                        cleanup();
                    });
                    const unsub = addListener(GLOBAL_ROUTER_EVENTS_TARGET, "popstate", () => {
                        if (!path().includes("dialog")) {
                            cleanup();
                            unsub();
                        }
                    });
                    document.body.appendChild($dialog);
                })
            }
        ]);
    }
    /**
     * Opens a dialog without routing inside it.
     */
    async openDialogWithoutRouting() {
        history.native.pushState(null, "", `item/1234`);
        GLOBAL_ROUTER_EVENTS_TARGET.addEventListener("popstate", close, { once: true });
        const { result } = await showDialog({
            fixed: true,
            backdrop: true,
            blockScrolling: true,
            container: document.body,
            duration: 200,
            template: html `<p slot="content">This is a dialog with a special path!</p>`
        });
        await result;
        GLOBAL_ROUTER_EVENTS_TARGET.removeEventListener("popstate", close);
        history.native.back();
    }
    render() {
        return html `
			<p>PasswordComponent</p>
			<span>Resolved password: ${data.secretPassword}</span>
			
			<router-slot></router-slot>
			<router-link path="dialog">Open dialog with routes</router-link>
			<button @click="${this.openDialogWithoutRouting}">Open dialog WITHOUT routes</button>
		`;
    }
}
window.customElements.define("password-component", PasswordComponent);
//# sourceMappingURL=password.js.map