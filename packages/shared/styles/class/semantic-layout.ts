import { css, CSSResult } from 'lit';

/**
 * Defines the CSS styles for the semantic layout of the application.
 * 
 * - The `:host` selector styles the custom element itself, setting it to a flex container
 *   with a minimum height calculated based on the viewport height and a custom property.
 *   It also sets the flex direction to column and removes any default margin.
 *   Additionally, it defines a custom property for the maximum width of the aside element.
 * 
 * - The `aside` selector styles the aside element to have a flexible width of 20% of the viewport width,
 *   with a maximum width defined by a custom property.
 * 
 * - The `#main` selector styles the main content container to be a flex container that takes up
 *   the remaining space, with box-sizing set to border-box. It also ensures that all direct children
 *   of `#main` have box-sizing set to border-box.
 * 
 * - The `#content` selector styles the content area to be flexible and centered, with a maximum width
 *   defined by a custom property and automatic margins.
 * 
 * - A media query is included to change the display of the `#main` container to block when the screen
 *   width is 992px or less, making the layout more responsive.
 * 
 * @example
 * ```html
 *   <header>
 *     header content
 *   </header>
 *  
 *   <section id="main">
 *     <div id="content">
 *       content
 *     </div>
 *     <aside>
 *       aside content
 *     </aside>
 *   </section>
 *   
 *   <footer>
 *     footer content
 *   </footer>
 * ```  
 */
const style: CSSResult = css`
 :host {
      display: flex;
      min-height: calc(100vh - var(--app-template-height));
      flex-direction: column;
      margin: 0;
      /* color: var(--color-primary-text, #212121); */
      --sl-aside-max-width: 380px;
    }
   
    
    /* header {
      text-align: center;
    } */
   
    aside {
      flex: 0 0 20vw;
      max-width: var(--sl-aside-max-width);  
    }

    /* we used <div id="main"> instead of <main> 
     * because we want to keep main at appliction level.
     */
    #main {
      display: flex;
      flex: 1;
      box-sizing: border-box;
    }

    #main > * {
      box-sizing: border-box;
    }
    
    #content {
      flex: 1;
      max-width: var(--sl-content-max-width, var(--size-layout-max-width));
      margin: auto;
    }

    @media screen and (max-width: 992px) {
      #main {
        display: block;
      }
    }
  `;

export default style;

