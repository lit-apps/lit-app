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

`
export default styles;