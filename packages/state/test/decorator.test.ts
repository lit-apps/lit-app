import { html, css, LitElement } from "lit";
import { customElement, state } from 'lit/decorators.js';
import type { IWindow } from 'happy-dom'

// testing with vitest - see https://vitest.dev/guide
import { beforeEach, describe, it, vi, assert, expect } from 'vitest'

import { State } from "../src/state";
import { LitStateEvent } from "../src/state-event";
import { StateController } from "../src/state-controller";
import {property} from '../src/decorators/property'
import { storage } from '../src/decorators/local-storage';


class MyState extends State {
  @property({type: Number}) a = 1  
  @property({value: 'bbb'}) b: string
}

class YourState extends State {
  @property({type: String}) a = 'a'  
  @property({value: 'b'}) b: string
  @property({value: 'b'}) c
}

const myState = new MyState()

@customElement('state-el')
class StateEl extends LitElement {

  state = new StateController<MyState>(this, myState)
  override render() {
    return html`
      <div>${myState.a}</div>
    `;
  }
}

declare global {
  interface Window extends IWindow { }
}

describe("decorator", () => {

  beforeEach(async () => {
    document.body.innerHTML = '<state-el></state-el>'
    await window.happyDOM.whenAsyncComplete()
    await new Promise(resolve => setTimeout(resolve, 0))
  })

  function getEl(): StateEl | null | undefined {
    return document.body.querySelector('state-el') as StateEl
  }


  it("does not shares typemap between instances between subclasses", () => {
		expect(MyState.typeMap).not.toBe(YourState.typeMap)
  });

	it("stores types in typeMap", () => {
		expect(MyState.typeMap.get('a')).toBe(Number)
		expect(YourState.typeMap.get('a')).toBe(String)
  });

	it("instantiate @property({value})", () => {
		class S extends State {
			@property({value: 1}) a;
		}
		const s = new S()
		expect(s.a).toBe(1)
  });

	it("instantiate @property({value})", () => {
		class S extends State {
			@storage({storageKey: 'aa'})
			@property({value: 1}) a;
		}
		const s = new S()
		expect(localStorage.getItem('_ls_aa')).toBe(1)
  });
});
