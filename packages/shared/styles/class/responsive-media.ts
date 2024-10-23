import { CSSResult, css } from 'lit';

/**
 * Defines a CSS style for markdown images and videos to ensure they fit within their container.
 *
 * This is to be used in markdown to make images and videos responsive.
 * 
 * The styles applied are:
 * - `max-width: 100%`: Ensures the media does not exceed the width of its container.
 * - `max-height: 100%`: Ensures the media does not exceed the height of its container.
 * - `object-fit: contain`: Scales the media to maintain its aspect ratio while fitting within the container.
 */
const style: CSSResult = css`
  .markdown img, 
  .markdown video {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`

export default style;