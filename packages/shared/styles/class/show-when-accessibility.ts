import { css, CSSResult } from 'lit';

/**
 * CSS styles for accessibility features.
 *
 * This stylesheet defines classes to control the visibility of elements
 * based on different accessibility modes such as read-aloud, easy-read,
 * and sign language.
 *
 * Classes:
 * - `.show-when-readaloud`: Hidden by default, shown when the `isreadaloud` class is present.
 * - `.hide-when-readaloud`: Shown by default, hidden when the `isreadaloud` class is present.
 * - `.show-when-easyread`: Hidden by default, shown when the `iseasyread` class is present.
 * - `.hide-when-easyread`: Shown by default, hidden when the `iseasyread` class is present.
 * - `.show-when-signlanguage`: Hidden by default, shown when the `issignlanguage` class is present.
 * - `.hide-when-signlanguage`: Shown by default, hidden when the `issignlanguage` class is present.
 */
const style: CSSResult = css`
  .show-when-readaloud {
    display:none;
  }
  .isreadaloud .show-when-readaloud {
    display: inherit;
  }
  .isreadaloud .hide-when-readaloud {
    display:none;
  }
  .show-when-easyread {
    display:none;
  }
  .iseasyread .hide-when-easyread {
    display:none;
  }
  .iseasyread .show-when-easyread {
    display: inherit;
  }
  .show-when-signlanguage {
    display:none;
  }
  .issignlanguage .hide-when-signlanguage {
    display:none;
  }
  .issignlanguage .show-when-signlanguage {
    display: inherit;
  }

 `;

 export default style;
 