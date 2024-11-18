import { css, CSSResult } from 'lit';

/**
 * CSS styles for custom YouTube components (`lite-youtube` and `lapp-youtube`).
 * 
 * These styles include:
 * 
 * - Basic styling for the components, including background color, position, display, and cursor.
 * - A gradient overlay with a title, positioned at the top of the component.
 * - Responsive iframe styling to maintain a 16:9 aspect ratio.
 * - Styling for a play button, including its position, size, and background image.
 * - Hover and focus effects for the play button.
 * - Post-click styles to hide the play button and gradient overlay.
 * - A utility class for visually hidden elements.
 * 
 * copied from https://github.com/paulirish/lite-youtube-embed/blob/master/src/lite-yt-embed.css
 * 
 * The styles make use of CSS custom properties (variables) for colors and transition timings.
 */
const style: CSSResult = css`
lite-youtube, lapp-youtube {
    background-color: #000;
    position: relative;
    display: block;
    contain: content;
    background-position: center center;
    background-size: cover;
    cursor: pointer;
    max-width: 720px;
}

/* gradient */
lite-youtube::before, lapp-youtube::before {
    content: attr(data-title);
    display: block;
    position: absolute;
    top: 0;
    background-image: linear-gradient(rgba(var(--color-primary-rgb), 0.25), transparent);
    background-repeat: repeat-x;
    background-position: top;
    height: 99px;
    padding-bottom: 50px;
    width: 100%;
    transition: all var(--time-fast, 0.2s) cubic-bezier(0, 0, 0.2, 1);
    font-family: "YouTube Noto",Roboto,Arial,Helvetica,sans-serif;
    color: hsl(0deg 0% 93.33%);
    text-shadow: 0 0 2px rgba(0,0,0,.5);
    font-size: 18px;
    padding: 25px 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    box-sizing: border-box;
    /* background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADGCAYAAAAT+OqFAAAAdklEQVQoz42QQQ7AIAgEF/T/D+kbq/RWAlnQyyazA4aoAB4FsBSA/bFjuF1EOL7VbrIrBuusmrt4ZZORfb6ehbWdnRHEIiITaEUKa5EJqUakRSaEYBJSCY2dEstQY7AuxahwXFrvZmWl2rh4JZ07z9dLtesfNj5q0FU3A5ObbwAAAABJRU5ErkJggg==); */
}

/* responsive iframe with a 16:9 aspect ratio
    thanks https://css-tricks.com/responsive-iframes/
*/
lite-youtube::after, lapp-youtube::after {
    content: "";
    display: block;
    padding-bottom: calc(100% / (16 / 9));
}
lite-youtube > iframe, lapp-youtube > iframe {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    border: none;
}

/* play button */
lite-youtube > .lty-playbtn, lapp-youtube > .lty-playbtn  {
    width: 68px;
    height: 48px;
    position: absolute;
    transform: translate3d(-50%, -50%, 0);
    top: 50%;
    left: 50%;
    z-index: 1;
    background-color: transparent;
    /* YT's actual play button svg */
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 68 48"><path fill="%23f00" fill-opacity="0.8" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"></path><path d="M 45,24 27,14 27,34" fill="%23fff"></path></svg>');
    filter: grayscale(100%);
    transition: filter var(--time-fast, 0.2s) cubic-bezier(0, 0, 0.2, 1);
    border: none;
}

lite-youtube:hover > .lty-playbtn,
lapp-youtube:hover > .lty-playbtn,
lite-youtube .lty-playbtn:focus, 
lapp-youtube .lty-playbtn:focus {
    filter: none;
}

/* Post-click styles */
lite-youtube.lyt-activated, lapp-youtube.lyt-activated {
    cursor: unset;
}
lite-youtube.lyt-activated::before,
lapp-youtube.lyt-activated::before,
lite-youtube.lyt-activated > .lty-playbtn ,
lapp-youtube.lyt-activated > .lty-playbtn {
    opacity: 0;
    pointer-events: none;
}
.lyt-visually-hidden {
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }

`;

export default style; 