import { html, LitElement } from "lit";
import { sharedStyles } from "../../pages/styles";
export default class StepOneComponent extends LitElement {
    static { this.styles = [sharedStyles]; }
    render() {
        return html `
			<p>Step 1</p>
		`;
    }
}
window.customElements.define("step-one-component", StepOneComponent);
//# sourceMappingURL=step-one.js.map