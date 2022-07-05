import { html, css, LitElement } from "lit";
import { customElement, state } from 'lit/decorators.js';
import type { IWindow } from 'happy-dom'

// testing with vitest - see https://vitest.dev/guide
import { beforeEach, describe, it, vi, assert, expect } from 'vitest'

import { State } from "../src/state";
import { LitStateEvent } from "../src/state-event";
import { StateController } from "../src/state-controller";
import {property} from '../src/decorators/property'


class MyState extends State {
  @property() a = 'aaa'  
  @property({value: 'bbb'}) b: string
}

class MyExtendedState extends MyState {
  @property() c = 'ccc'  
}

const myState = new MyState()
const mySecondState = new MyState()
const myExtendedState = new MyExtendedState()

@customElement('state-el')
class StateEl extends LitElement {

  state = new StateController<MyState>(this, myState)
  override render() {
    return html`
      <div>${myState.a}</div>
    `;
  }
}

@customElement('state-el-ext')
class StateElExt extends StateEl {
  stateExt = new StateController<MyExtendedState>(this, myExtendedState)
  override render() {
    return html`
      <div id="myState.a">${myState.a}</div>
      <div id="myExtendedState.a">${myExtendedState.a}</div>
      <div id="myExtendedState.c">${myExtendedState.c}</div>
    `;
  }
}

declare global {
  interface Window extends IWindow { }
}

describe("state", () => {

  beforeEach(async () => {
    document.body.innerHTML = '<state-el></state-el><state-el-ext></state-el-ext>'
    myState.a = 'aaa'
    myExtendedState.c = 'ccc'
    await window.happyDOM.whenAsyncComplete()
    await new Promise(resolve => setTimeout(resolve, 0))
  })

  function getEl(): StateEl | null | undefined {
    return document.body.querySelector('state-el') as StateEl
  }
  function getElExt(id?: string): StateElExt | HTMLElement | null | undefined {
    const el = document.body.querySelector('state-el-ext')
    if(id) {
      return el?.shadowRoot?.querySelector('#' + id)
    }
    return el as StateElExt
  }

  it("is defined", () => {
    const el = getEl();
    assert.instanceOf(el, StateEl);
  });

  it("renders with state init values", async () => {
    const el = getEl();
    expect(el?.shadowRoot?.innerHTML).toContain('aaa')
  });


  it("reacts to to state changes", async () => {
    const el = getEl();
    myState.a = '___'
    await el?.updateComplete
    expect(el?.shadowRoot?.innerHTML).toContain('___')
  });

  it("change in one state does not affect other states", async () => {
    expect(mySecondState.a).toBe('aaa')
  });

  it("extended states include properties from ancestors", async () => {
    expect(myExtendedState.propertyKeys.length).toBe(3)
  });

  it("properly handles sub-classing", async () => {
    const el = getEl() as StateEl;
    const elext = getElExt() as StateElExt;
    const a = getElExt('myState.a')
    const extA = getElExt('myExtendedState.a')
    const extC = getElExt('myExtendedState.c')

    await elext?.updateComplete
    await el?.updateComplete
    expect(a?.innerHTML).toContain('aaa')
    expect(el?.shadowRoot?.innerHTML).toContain('aaa')
    expect(extA?.innerHTML).toContain('aaa')
    expect(extC?.innerHTML).toContain('ccc')
    
    myState.a = '___'
    await elext?.updateComplete
    await el?.updateComplete
    expect(a?.innerHTML).toContain('___')
    expect(el?.shadowRoot?.innerHTML).toContain('___')
    expect(extA?.innerHTML).toContain('aaa')
    expect(extC?.innerHTML).toContain('ccc')
    
    myExtendedState.a = '---'
    await elext?.updateComplete
    await el?.updateComplete
    expect(a?.innerHTML).toContain('___')
    expect(el?.shadowRoot?.innerHTML).toContain('___')
    expect(extA?.innerHTML).toContain('---')
    expect(extC?.innerHTML).toContain('ccc')
    
    myExtendedState.c = 'xxx'
    await el?.updateComplete
    expect(a?.innerHTML).toContain('___')
    expect(el?.shadowRoot?.innerHTML).toContain('___')
    expect(extA?.innerHTML).toContain('---')
    expect(extC?.innerHTML).toContain('xxx')

  });
  
  it("can be instantiatied through @property({value: 'bbb'})", async () => {
    expect(myState.b).toBe('bbb') 
  });

  it("inherited @property({value: 'bbb'}) are not set on child class", async () => {
    expect(myExtendedState.b).toBeUndefined()
  });

  it("can be listened to", async () => {
    myExtendedState.addEventListener(LitStateEvent.eventName, ((event: LitStateEvent) => {
      expect(event.key).toBe('a')
      expect(event.state).toBe(myExtendedState)
      expect(event.value).toBe('___')
    }) as EventListener)
    myExtendedState.a = '___'
  });


});
