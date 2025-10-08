declare global {
  interface Window extends IWindow { }
}


import { html, css, LitElement } from "lit";
import { customElement, state } from 'lit/decorators.js';
import type { IWindow } from 'happy-dom'

// testing with vitest - see https://vitest.dev/guide
import { beforeEach, describe, it, vi, assert, expect } from 'vitest'

import { State } from "../src/state";
import { StateEvent } from "../src/state-event";
import { StateController } from "../src/state-controller";
import { property } from '../src/decorators/property'
import { query } from '../src/decorators/query'
import { storage } from '../src/decorators/storage';

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



describe("decorator", () => {

  beforeEach(async () => {
    await window.happyDOM.whenAsyncComplete()
    await new Promise(resolve => setTimeout(resolve, 0))
  })


  it("does not shares propertymap between instances between subclasses", () => {
		expect(MyState.propertyMap).not.toBe(YourState.propertyMap)
  });

	it("stores types in propertyMap", () => {
		expect(MyState.propertyMap.get('a')?.type).toBe(Number)
		expect(YourState.propertyMap.get('a')?.type).toBe(String)
  });

	it("instantiate @property({value})", () => {
		class S extends State {
			@property({value: 1}) a;
		}
		const s = new S()
		expect(s.a).toBe(1)
  });

	it("sync @property({value}) with local storage", () => {
		class S extends State {
			@storage({key: 'aa'})
			@property({value: 1}) a;
		}
		const s = new S()
		expect(localStorage.getItem('_ls_aa')).toBe(1)
		s.a = 2
		expect(localStorage.getItem('_ls_aa')).toBe(2)
  });

	it("sync @property({value}) with local storage with no prefix", () => {
		class S extends State {
			@storage({key: 'aa', prefix: null })
			@property({value: 1}) a;
		}
		const s = new S()
		expect(localStorage.getItem('aa')).toBe(1)
		s.a = 2
		expect(localStorage.getItem('aa')).toBe(2)
  });

	it("sync @query({value}) ", async () => {
		class S extends State {
			@query({parameter: 'aa'})
			@property({value: 1}) a;
		}
		const s = new S()
		expect(s.a).toEqual('5')
		
  });

	it("resets to the initial value", async () => {
		class S extends State {
			@query({parameter: 'aa'})
			@property({value: 1}) a;
		}
		const s = new S()
		expect(s.a).toEqual('5')
		s.reset()
		expect(s.a).toEqual(1)
		
  });

	it("saves query to storage", async () => {
		class S extends State {
			@query({parameter: 'aa'})
			@storage({key: 'aaa'})
			@property({value: 1}) a;
		}
		const s = new S()
		expect(s.a).toEqual('5')
		expect(localStorage.getItem('_ls_aaa')).toBe('5')
		s.a = 2
		expect(localStorage.getItem('_ls_aaa')).toBe(2)
  });
	
	it("converts query to storage, according to type", async () => {
		class S extends State {
			@query({parameter: 'aa'})
			@storage({key: 'aaa'})
			@property({value: 1, type: Number}) a;
		}
		const s = new S()
		expect(s.a).toEqual(5)
		expect(localStorage.getItem('_ls_aaa')).toBe(5)
		
  });

	
});
