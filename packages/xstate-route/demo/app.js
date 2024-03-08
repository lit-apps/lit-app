import { GLOBAL_ROUTER_EVENTS_TARGET, path, RouterSlot } from "router-slot";
import { html } from "lit";
import { ROUTER_SLOT_TAG_NAME } from "router-slot";
// import "./../lib/router-link";
/**
 * Asserts that the user is authenticated.
 */
function sessionGuard() {
    if (localStorage.getItem("session") == null) {
        history.replaceState(null, "", "login");
        return false;
    }
    return true;
}
// Setup the router
customElements.whenDefined(ROUTER_SLOT_TAG_NAME).then(async () => {
    const routerSlot = document.querySelector(ROUTER_SLOT_TAG_NAME);
    let hasInitialized = false;
    routerSlot.addEventListener("changestate", () => {
        if (!hasInitialized) {
            document.body.classList.add("initialized");
            hasInitialized = true;
        }
    });
    GLOBAL_ROUTER_EVENTS_TARGET.addEventListener("pushstate", (e) => {
        console.log("On push state", `'${path()}'`);
    });
    GLOBAL_ROUTER_EVENTS_TARGET.addEventListener("replacestate", (e) => {
        console.log("On replace state", path());
    });
    GLOBAL_ROUTER_EVENTS_TARGET.addEventListener("popstate", (e) => {
        console.log("On pop state", path(), e.state);
    });
    GLOBAL_ROUTER_EVENTS_TARGET.addEventListener("changestate", (e) => {
        console.log("On change state", path());
    });
    GLOBAL_ROUTER_EVENTS_TARGET.addEventListener("navigationstart", (e) => {
        console.log("Navigation start", e.detail);
    });
    GLOBAL_ROUTER_EVENTS_TARGET.addEventListener("navigationend", (e) => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        console.log("Navigation end", e.detail);
    });
    GLOBAL_ROUTER_EVENTS_TARGET.addEventListener("navigationsuccess", (e) => {
        console.log("Navigation success", e.detail);
    });
    GLOBAL_ROUTER_EVENTS_TARGET.addEventListener("navigationcancel", (e) => {
        console.log("Navigation cancelled", e.detail);
    });
    GLOBAL_ROUTER_EVENTS_TARGET.addEventListener("navigationerror", (e) => {
        console.log("Navigation failed", e.detail);
    });
    await routerSlot.add([
        {
            path: `login`,
            component: () => import("./pages/login/login")
        },
        {
            path: `home`,
            component: () => import("./pages/home/home"),
            guards: [sessionGuard]
        },
        {
            // You can give the component as a HTML element if you want
            path: `div`,
            component: () => {
                const $div = document.createElement("div");
                $div.innerText = `Heres a <div> tag!`;
                const $slot = new RouterSlot();
                $slot.add([
                    {
                        path: "route",
                        pathMatch: "suffix",
                        component: () => html `<div>Here is another &lt;div> tag! - this time from template</div>`
                    },
                    {
                        path: "**",
                        redirectTo: "/div/route"
                    }
                ]);
                $div.appendChild($slot);
                return $div;
            }
        },
        {
            path: "**",
            redirectTo: `home`,
            preserveQuery: true
        }
    ]);
});
//(window as any)["matchRoute"] = matchRoute;
//# sourceMappingURL=app.js.map