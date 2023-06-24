import { LitElement, html, css, PropertyValueMap, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import userMixin from './user-mixin';
import {LifSpan} from '@preignition/lit-firebase/span';

/**
 *  
 */

export class UserName extends userMixin(LifSpan) {

  static override styles = css`
    :host {
      display: inline-flex;
    }
    `;

  override willUpdate(props: PropertyValues<this>){
    super.willUpdate(props);
    if (props.has('uid')) {
      this.path = this.namePath;
    }
    
  }  

}

