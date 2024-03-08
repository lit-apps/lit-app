var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import "weightless/dialog";
import "weightless/title";
import { ROUTER_SLOT_TAG_NAME } from "router-slot";
import { sharedStyles } from "../pages/styles";
export default class DialogComponent extends LitElement {
    constructor() {
        super(...arguments);
        this.parent = null;
    }
    static { this.styles = [sharedStyles]; }
    firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties);
        const $routerSlot = this.shadowRoot.querySelector(ROUTER_SLOT_TAG_NAME);
        if (this.parent != null) {
            $routerSlot.parent = this.parent;
        }
        $routerSlot.add([
            {
                path: "step-one",
                component: () => import("./step-one/step-one")
            },
            {
                path: "step-two",
                component: () => import("./step-two/step-two")
            },
            {
                path: "**",
                redirectTo: "step-one"
            }
        ]);
    }
    close() {
        this.dispatchEvent(new CustomEvent("close"));
    }
    /**
     * Renders the component.
     * @returns {TemplateResult}
     */
    render() {
        return html `
			<wl-dialog open fixed backdrop id="content" @didHide="${this.close}" size="large">
			   <wl-title level="3" slot="header">This is a dialog</wl-title>
			   <div slot="content">
					<router-link path="step-one">Go to StepOneComponent</router-link>
					<br />
					<router-link path="step-two">Go to StepTwoComponent</router-link>
					<router-slot id="dialog"></router-slot>
			   </div>
			   <div slot="footer">
					<wl-button @click="${this.close}" inverted flat>Close dialog</wl-button>
			   </div>
			</wl-dialog>
		`;
    }
}
__decorate([
    property({ type: Object })
], DialogComponent.prototype, "parent", void 0);
window.customElements.define("dialog-component", DialogComponent);
//# sourceMappingURL=dialog.js.map