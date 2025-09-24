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
  white-space: initial;  /* this is needed for not breaking Safari */

}

/** inline */
:host([inline]) #list { 
  align-items: flex-end;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: wrap;
  
}
:host([inline]) #list [md-list-item] {
  flex: 1;
  min-width: 130px;
  max-width: 280px;
}
:host([inline]:not([child-label-inline])) div[slot="headline"] { 
  flex: 1;
  text-align: center;
}
@media (max-width: 600px) {
  #list {
    --md-list-item-leading-space: 0px;
    --md-list-item-trailing-space: 0px;
    min-width: unset;
  }
}
`
export default styles; 