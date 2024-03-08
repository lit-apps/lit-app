import { LitElement, PropertyValues, TemplateResult } from "lit";
import { Params } from "router-slot";
export default class UserComponent extends LitElement {
    static styles: import("lit").CSSResult[];
    get params(): Params;
    connectedCallback(): void;
    firstUpdated(changedProperties: PropertyValues): void;
    /**
     * Renders the element.
     * @returns {TemplateResult}
     */
    render(): TemplateResult;
}
//# sourceMappingURL=user.d.ts.map