import { css, html, LitElement } from "lit";
import { sharedStyles } from "../styles";
import "weightless/card";
import "weightless/button";
export default class LoginComponent extends LitElement {
    static { this.styles = [sharedStyles, css `
		#container {
			margin: 70px auto;
			max-width: 700px;
			width: 100%;
			padding: 30px;
		}
		
		h2 {
			margin: 0;
		}
	`]; }
    login() {
        localStorage.setItem("session", "secretToken");
        history.replaceState(null, "", "/");
    }
    /**
     * Renders the component.
     * @returns {TemplateResult}
     */
    render() {
        return html `
			<wl-card id="container">
				<h2>Login to continue</h2>
				<p>The routes are guarded behind a login. In order to get to the app you need to have a session.</p>
				<wl-button @click="${() => this.login()}">Login</wl-button>
			</wl-card>
		`;
    }
}
window.customElements.define("login-component", LoginComponent);
//# sourceMappingURL=login.js.map