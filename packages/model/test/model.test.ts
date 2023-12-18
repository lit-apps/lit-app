import { html, css, LitElement } from "lit";
import { customElement, state } from 'lit/decorators.js';
import type { IWindow } from 'happy-dom'

// testing with vitest - see https://vitest.dev/guide
import { beforeEach, describe, it, vi, assert, expect } from 'vitest'

import { State } from "../src/state";
import { StateEvent } from "../src/state-event";
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
      <div id="myState_a">${myState.a}</div>
      <div id="myExtendedState_a">${myExtendedState.a}</div>
      <div id="myExtendedState_c">${myExtendedState.c}</div>
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
    expect(Object.getPrototypeOf(myExtendedState).constructor.propertyMap.size).toBe(3)
  });

  it("properly handles sub-classing", async () => {
    const el = getEl() as StateEl;
    const elext = getElExt() as StateElExt;
    const a = getElExt('myState_a')
    const extA = getElExt('myExtendedState_a')
    const extC = getElExt('myExtendedState_c')
    
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

  it("inherited @property({value: 'bbb'}) are set on child class", async () => {
    expect(myExtendedState.b).toBe('bbb')
  });

  it("can be listened to", async () => {
    myExtendedState.addEventListener(StateEvent.eventName, ((event: StateEvent) => {
      expect(event.key).toBe('a')
      expect(event.state).toBe(myExtendedState)
      expect(event.value).toBe('___')
    }) as EventListener)
    myExtendedState.a = '___'
  });

  it("handles initMap with initial values", async () => {
    class S extends State {
			@property({value: 1}) a;
			@property({value: 1, skipReset: true}) b;
		}
    expect([...S.propertyMap.keys()].length).toEqual(2)
		
  });


  it("returns all values via stateValue", async () => {
    class S extends State {
			@property({value: 1}) a;
			@property({value: 2}) b;
			@property({value: {a: 1}}) c;
		}
    const s = new S()
    expect(s.stateValue).toEqual({a: 1, b: 2, c: {a: 1}})
		
  });


  it("initiate values for multiple instances of same class", async () => {
    class S extends State {
			@property({value: 1}) a;
		}

    const s1 = new S()
    const s2 = new S()
    expect(s1.a).toEqual(1)
    expect(s2.a).toEqual(1)
		
  });

  it("handled reset as expected", async () => {
    class S extends State {
			@property({value: 1}) a;
			@property({value: 1, skipReset: true}) b;
			@property({}) c;
		}

    const s = new S()
    
    expect(s.a).toEqual(1)
    expect(s.b).toEqual(1)
    expect(s.c).toBeUndefined()

    s.a = 2
    s.b = 2
    s.c = 2

    expect(s.a).toEqual(2)
    expect(s.b).toEqual(2)
    expect(s.c).toEqual(2)
    
    s.reset()

    expect(s.a).toEqual(1)
    expect(s.b).toEqual(2)
    expect(s.c).toEqual(2)
	
  });
  
  it("can subscribe and unsubscribe", async () => {
    class S extends State {
			@property({value: 1}) a;
			@property({value: 1}) b;
		}

    const s = new S()
    const cb = (key, value, state) => {}
    const spy = vi.fn(cb)
    const unsubscribe = s.subscribe(spy, 'a')
    s.a = 2
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('a', 2, s)
    
    s.b = 2
    expect(spy).toHaveBeenCalledTimes(1)
    
    s.a = 2
    expect(spy).toHaveBeenCalledTimes(1)
    
    s.a = 3
    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy).toHaveBeenCalledWith('a', 3, s)
    
    unsubscribe()
    s.a = 4
    expect(spy).toHaveBeenCalledTimes(2)
    
  })
  it("can reset", async () => {
    myState.a = '123'
    myState.b = '123'
    myState.reset()
    expect(myState.a).toBe('123') // a does not have a {value} set on @property
    expect(myState.b).toBe('bbb')
    
  })
});
