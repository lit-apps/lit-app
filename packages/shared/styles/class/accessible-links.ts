import { css, CSSResult } from 'lit';


/**
 * CSS styles for accessible links.
 *
 * This style applies to anchor (`<a>`) elements with a `target="_blank"` attribute.
 * It adds an icon after the link to indicate that it opens in a new tab or window.
 * The icon is created using an SVG mask image.
 *
 * - The `a[target=_blank]:after` selector targets all anchor elements with `target="_blank"` and adds an icon after the link.
 * - The `mask-image` and `-webkit-mask-image` properties are used to apply the SVG icon as a mask.
 * - The `background-color` is set to the current text color (`currentcolor`).
 * - The icon is displayed as an inline block with specific dimensions.
 * - The `a.shy[target=_blank]:after` selector hides the icon for links with the `shy` class.
 * 
 * An alternative approach - but the color is not inherited! : 
 * a[target=_blank] {
 *   background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M5 21q-.825 0-1.413-.587Q3 19.825 3 19V5q0-.825.587-1.413Q4.175 3 5 3h7v2H5v14h14v-7h2v7q0 .825-.587 1.413Q19.825 21 19 21Zm4.7-5.3-1.4-1.4L17.6 5H14V3h7v7h-2V6.4Z'/%3E%3C/svg%3E");
 *   background-position: center right;
 *   background-repeat: no-repeat;
 *   background-size: 0.857em;
 *   padding-right: 1em;
 * }
 */

// const url = css`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M5 21q-.825 0-1.413-.587Q3 19.825 3 19V5q0-.825.587-1.413Q4.175 3 5 3h7v2H5v14h14v-7h2v7q0 .825-.587 1.413Q19.825 21 19 21Zm4.7-5.3-1.4-1.4L17.6 5H14V3h7v7h-2V6.4Z'/%3E%3C/svg%3E`
const url = css`data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M5 21q-.825 0-1.413-.587Q3 19.825 3 19V5q0-.825.587-1.413Q4.175 3 5 3h7v2H5v14h14v-7h2v7q0 .825-.587 1.413Q19.825 21 19 21Zm4.7-5.3-1.4-1.4L17.6 5H14V3h7v7h-2V6.4Z'/></svg>`

const style: CSSResult = css`

a[target=_blank]:after {
  content: '';
  mask-image: url("${url}");
  -webkit-mask-image: url("${url}");
  background-color: currentcolor;
  display: inline-block;
  vertical-align: top;
  width: 1.3rem;
  height: 1.28rem;
  } 
  
  a.shy[target=_blank]:after {
    display: none;
    }
    `;
export default style
