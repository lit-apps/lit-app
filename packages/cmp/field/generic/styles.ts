import {css, CSSResult} from 'lit';
const styles: CSSResult = css`
:host > span, 
:host > div {
	display: inline-flex;
	flex: 1;
}
:host {
	/* TODO MD3: remove this when migrating to MD3 */
  /* default field container color */
  --md-filled-field-container-color: var(--mdc-text-field-fill-color, whitesmoke);
}

/* allow focus ring to display */
[data-role][slot], 
md-outlined-icon-button[slot] {
	overflow: visible;
}

`
export default styles;