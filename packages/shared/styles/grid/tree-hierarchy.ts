import { css, CSSResult } from "lit";


// TODO: add this as a theme, see register-styles.ts

const style: CSSResult = css`

vaadin-grid::part(level-0)  {
  font-size: 15px;
  font-weight: var(--font-weight-bold);
}
vaadin-grid::part(level-1 )  {
  /* font-size: var(--font-size-large); */
  font-weight: var(--font-semi-bold);
}
vaadin-grid::part(cell)  {
  /* font-size: var(--font-size-large); */
  min-height: 38px;
  cursor: pointer;
}
vaadin-grid {
  --vaadin-grid-cell-padding: 6px 16px;
}`

export default style;
