import { LitElement, PropertyValues, TemplateResult } from "lit";
import "weightless/dialog";
import "weightless/title";
import { IRouterSlot } from "router-slot";
export default class DialogComponent extends LitElement {
    static styles: import("lit").CSSResult[];
    parent: IRouterSlot | null;
    firstUpdated(changedProperties: PropertyValues): void;
    private close;
    /**
     * Renders the component.
     * @returns {TemplateResult}
     */
    render(): TemplateResult;
}
//# sourceMappingURL=dialog.d.ts.map