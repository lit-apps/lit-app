import { html, LitElement } from "lit";
import { sharedStyles } from "../../../styles";
export default class CodeComponent extends LitElement {
    static { this.styles = [sharedStyles]; }
    render() {
        return html `
			<p>CodeComponent</p>
		`;
    }
}
window.customElements.define("code-component", CodeComponent);
//# sourceMappingURL=code.js.map