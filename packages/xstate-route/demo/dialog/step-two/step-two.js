import { html, LitElement } from "lit";
import { sharedStyles } from "../../pages/styles";
export default class StepTwoComponent extends LitElement {
    static { this.styles = [sharedStyles]; }
    render() {
        return html `
			<p>Step 2</p>
		`;
    }
}
window.customElements.define("step-two-component", StepTwoComponent);
//# sourceMappingURL=step-two.js.map