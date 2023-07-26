import { LitElement, PropertyValueMap, PropertyValues } from "lit";
import { html, TemplateResult, nothing } from 'lit';
import { when } from 'lit/directives/when.js';
import { property, query, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js'
import '../../../../list/list'
import '../../../../list/list-item'
import '../../../checkbox/checkbox'
import '@material/web/icon/icon'
import '@material/web/iconbutton/outlined-icon-button'
import '@material/web/iconbutton/filled-tonal-icon-button'
import { animate } from '@lit-labs/motion';
import MultiChoiceMixin from '../../multiMixin';
import '../../list-item'
/**
 * An example element.
 *  
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 * 
 * Relevant resource for list re-order and D&D: 
 * - https://jsbin.com/botepol/edit?html,output
 * - https://github.com/lit/lit/issues/3016
 * - https://github.com/lit/lit/discussions/2865
 * 
 * The way reordering works is the following:
 * - user select the item to move
 * - the element calculates from which index to which index the item should be moved
 * - an animation state is turned on
 * - all list-items are set to display: bock, margin-top: 0
 * - we calculate the new margin-top for the item to move and the item to move to
 * - we reset options to the appropriate order at the end of the animation
 */

import IllustrationMixin from '../../illustrationMixin';
import type { Option } from '../../types';
import type { HTMLEvent } from '../../../../types';
import { Checkbox } from '../../checkbox/internal/checkbox';
// type Option = O & { initialIndex: number }
export abstract class Order extends
  MultiChoiceMixin(
    IllustrationMixin(
      Checkbox)) {

  protected override fieldName = 'order';
  
  @state() animating: boolean = false;
  private movingIndex: number = -1;
  private targetIndex: number = -1;
  private movingElHeight: number = 0;
  private movingDistance: number = 0;
  private isSelecting!: boolean ;
  private animationEndCallback: (() => void)[] = [];      
  private resetAnimation() {
    this.movingIndex = -1
    this.targetIndex = -1
    this.animating = false
  }

  private onAnimationComplete() {
    this.animationEndCallback.forEach(cb => cb())
    this.animationEndCallback = []
    this.resetAnimation()
  }

  override willUpdate(props: PropertyValues): void {
    if (props.has('animating') && this.input) {
      if (this.animating) {
        // fix the height of the list
        this.input.style.height = getComputedStyle(this.input).height
      } else {
        // reset the height of the list
        this.input.style.height = ''
      }
    }
    super.willUpdate(props)
  }

  override async onChange(e?: HTMLEvent<LitElement>, index: number = -1, option?: Option) {
    if (this.animating) return
    const length = (this._value || []).length
    const isSelecting = !Order.isCodeSelected(this._value, option?.code || '')
    const targetIndex = isSelecting ? length : length - 1
    this.isSelecting = isSelecting
    if (targetIndex === index) {
      this.resetAnimation()
      return super.onChange(e)
    }
    this.moveOption(index, targetIndex, option as Option)
    
  }

  private async moveOption(index: number, targetIndex: number, option: Option) {
    const currentEl = this.items[index]
    const targetEl = this.items[targetIndex]
    // distance in px between e.target and targetEl
    this.targetIndex = targetIndex
    this.movingIndex = index
    this.movingElHeight = currentEl.offsetHeight
    this.movingDistance = targetEl.offsetTop - currentEl.offsetTop
    await this.updateComplete
    this.animating = true
    setTimeout(() => {
      this.getOptionEl(this.items[targetIndex])?.focus()
    }, 250)
  }

  protected override renderChoiceOptions(options: Option[] = [] ) {
    if(options.length === 0) {
      return this.renderEmptyOption()
    }
    // sort options so that selected options are at the top
    options.sort((a, b) => {
      const aSelected = Order.isCodeSelected(this._value, a.code)
      const bSelected = Order.isCodeSelected(this._value, b.code)
      if (aSelected && bSelected) {
        return this._value.indexOf(a.code) - this._value.indexOf(b.code)
      }
      return aSelected ? -1 : bSelected ? 1 : 0
    })

    return html`
    ${repeat(
      options,
      (option) => option.code,
      (option, index) => {
        const checked = Order.isCodeSelected(this._value, option.code)
        let marginTop: number;
        
        if(this.isSelecting)  {
          marginTop = (this.animating && index === this.movingIndex) ?
          (this.movingDistance - this.movingElHeight) : (this.animating && index  === (this.movingIndex + 1)) ?
            - (this.movingDistance) : (this.animating && index === this.targetIndex) ?
            this.movingElHeight : 0
        } else {
          marginTop = (this.animating && index === this.movingIndex) ?
          (this.movingDistance ) : (this.animating && index  === (this.movingIndex + 1)) ?
            - (this.movingDistance + this.movingElHeight) : this.animating && index === (this.targetIndex + 1) ?
            this.movingElHeight : 0
        }

        // console.log('marginTop', this.animating, index, marginTop, this.movingDistance)
        return html`
           <lapp-choice-list-item
           .isMulti=${true}
           .selector=${this.choiceInputSelector}
            ${animate({
                keyframeOptions: {
                  duration: this.animating ? 200 : 0,
                  easing: 'ease-in-out',
                },
                onComplete: () => {
                  this.onAnimationComplete()
                  this._value = this.selected
                  // this.requestUpdate()
                }
              })}
            style="margin-top: ${marginTop}px; display: block;"
            data-variant="horizontal"
            .listItemRole=${'option'}
            .disabled=${this.isDisabled(option)}
            @change=${(e: HTMLEvent<LitElement>) => this.onChange(e, index, option)}
            .headline=${option.md || option.label}
            .supportingText=${option.supportingText || ''}>
            ${this.renderOptionIllustration(option)}
            ${this.renderPriority(checked, index)}
            ${this.renderUpDown(checked, index, option)}
            ${this.renderCheckbox(option, index)}
            </lapp-choice-list-item>`
      })}
  `
  }
  
  protected renderUpDown(checked: boolean, index: number, option: Option) {
    if (!checked) return html``
    const onClick =(targetIndex: number) => (e: Event) => {
      e.stopPropagation()
      this.isSelecting = targetIndex < index
      this.animationEndCallback.push(async  () => {
          // swap values of _value between index and targetIndex
          console.log('swap', index, targetIndex)
          await this.updateComplete
          this._value = Order.swap(this._value, index, targetIndex)
          this.requestUpdate()
      })
      this.moveOption(index,targetIndex, this.options![index])
    }
    const up = () => html`
     <md-outlined-icon-button 
      slot="end" 
      aria-label=${this.tr('order.moveUp', {label: option.label})}
      data-variant="icon" 
      class="swap up" 
      @click=${onClick(index -1)} >
      <md-icon>arrow_upward</md-icon></md-outlined-icon-button>
    `
    const down = () => html`
    <md-outlined-icon-button 
     slot="end" 
     data-variant="icon" 
     aria-label=${this.tr('order.moveDown', {label: option.label})}
     class="swap down" 
     @click=${onClick(index + 1)} >
     <md-icon>arrow_downward</md-icon></md-outlined-icon-button>
   `
    return html`
      ${when(index > 0, up)}
      ${when(index < this._value.length -1 , down)}
    `
  }
  protected renderPriority(checked: boolean, index: number) {
    return html`
      <div slot="start" class="${checked ? 'checked ' : ''}priority" data-variant="icon">${checked ? index + 1 : ''}</div>
    `
  }
}

