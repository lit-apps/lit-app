import {customElement} from 'lit/decorators.js';

import { UserImgList } from './internal/img-list.js';

declare global {
  interface HTMLElementTagNameMap {
    'lapp-user-img-list': LappUserImg;
  }
}

/**
 * An element to display users with a list of images
 */
@customElement('lapp-user-img-list')
export  class LappUserImg extends UserImgList {
 
}
