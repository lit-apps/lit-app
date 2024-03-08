import { css, LitElement, html } from "lit";
import "weightless/nav";
import { basePath, GLOBAL_ROUTER_EVENTS_TARGET, isPathActive, query, queryString } from "router-slot";
import { sharedStyles } from "../styles";
import "weightless/button";
import './fsm/fsm';
const ROUTES = [
    {
        path: "secret",
        component: () => import("./secret/secret")
    },
    {
        path: "fsm",
        component: () => html `<fsm-component></fsm-component>`,
    },
    {
        path: "user/:user/dashboard/:dashId",
        component: () => import("./user/user"),
        setup: (page, info) => {
            //page.userId = info.match.params.userId;
            console.log({ page, info });
        }
    },
    {
        path: "**",
        redirectTo: "secret",
        preserveQuery: true
    }
];
export default class HomeComponent extends LitElement {
    static { this.styles = [sharedStyles, css `
		#child {
		    margin: 70px 0 0 0;
            padding: 30px;
		}
		
		a, button, wl-button {
			margin: 0 12px 0 0;
		}
	`]; }
    firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties);
        console.log({
            query: query(),
            queryString: queryString()
        });
        GLOBAL_ROUTER_EVENTS_TARGET.addEventListener("changestate", () => this.requestUpdate());
    }
    logout() {
        localStorage.clear();
        history.replaceState(null, "", "/login");
    }
    render() {
        console.info('');
        return html `
			<wl-nav fixed shadow>
			   <h1 slot="title">router-slot</h1>
			   <div slot="right">
			   <a href="home/secret/code${queryString()}" ?data-active="${isPathActive(`${basePath()}home/secret`)}">Go to SecretComponent</a>
				<a href="home/fsm" ?data-active="${isPathActive(`${basePath()}home/fsm`)}">Go to xstate-route</a>
				<a href="home/user/@andreasbm/dashboard/123${queryString()}" ?data-active="${isPathActive(`${basePath()}home/user/@andreasbm/dashboard/123`)}">Go to UserComponent</a>
					<wl-button @click="${() => this.logout()}" inverted flat>Logout</wl-button>
			   </div>
			</wl-nav>
			<div id="child">
				<router-slot .routes="${ROUTES}"></router-slot>
			</div>
		`;
    }
}
window.customElements.define("home-component", HomeComponent);
//# sourceMappingURL=home.js.map