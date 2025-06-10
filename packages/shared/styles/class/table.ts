import { css, CSSResult } from "lit";

const style: CSSResult = css`

table {
  border-spacing: 0;
  border-collapse: collapse;
  display: block;

}

table {
  margin-top: 0;
  margin-bottom: var(--space-medium);
}


table th {
  background-color: var(--color-surface-container-high);
  font-weight: var(--font-weight-semi-bold, 600);
}

table th,
table td {
  padding: 6px 13px;
  border: 1px solid var(--color-outline);
}

table td>:last-child {
  margin-bottom: 0;
}

table tr {
  background-color: var(--color-background);
  border-top: 1px solid var(--color-border-muted);
}

table tr:nth-child(2n) {
  background-color: var(--color-surface-container);
}

table img {
  background-color: transparent;
}
`

export default style;
