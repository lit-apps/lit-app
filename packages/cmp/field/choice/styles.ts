import { css, CSSResult } from 'lit';
const styles: CSSResult = css`

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
  display: flex;
  flex-direction: column;
  /* unset values that break layout */
  line-height: unset;
  white-space-collapse: unset;
  text-wrap: unset;
}

/** dense */
:host([dense]) #list { 
	display: flex;
  flex-flow: row wrap;
  align-items: center;
}

`
export default styles;