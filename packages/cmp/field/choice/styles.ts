import { css, CSSResult } from 'lit';
const styles: CSSResult = css`
:host {
  /* a bit less space between checkbox and label */
  --md-list-item-list-item-leading-space: 8px;
}
#list {
	border-radius: inherit;
  display: block;
  list-style-type: none;
  min-width: 300px;
  width: 100%;
  outline: none;
  /* Add position so the elevation overlay (which is absolutely positioned)
   can be positioned relative to the list root. */
  position: relative;
  /* same color as option background */
  /* background-color: var(--md-list-item-list-item-container-color, var(--md-sys-color-surface, #fef7ff)) */
}

/** dense */
:host([dense]) #list { 
	display: flex;
  flex-flow: row wrap;
  align-items: center;
}

`
export default styles;