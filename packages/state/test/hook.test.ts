import { html, LitElement } from "lit";
import { customElement } from 'lit/decorators.js';
import type { IWindow } from 'happy-dom'

// testing with vitest - see https://vitest.dev/guide
import { beforeEach, describe, it, vi, assert, expect } from 'vitest'

import { State } from "../src/state";
import { property } from '../src/decorators/property'
import { hook } from '../src/decorators/hook'
import { Hook } from '../src/hook'

const cb = () => {}
const spy = vi.fn(cb)

class TestHook extends Hook {
	static override hookName = 'test'
	override fromState(...args): void {
		// @ts-ignore
		spy(...args)
	}
}

class MyState extends State {
	@hook('test', { path: 1 })
	@property() a = 1
	
	@hook('test')
	@property() hook
	
	@property({ value: 'bbb' }) b: string
}

const myState = new MyState()


declare global {
	interface Window extends IWindow { }
}

describe("hook", () => {

	beforeEach(async () => {
		window.location.href = "http://localhost:3000/index?aa=5"
		await window.happyDOM.whenAsyncComplete()
		await new Promise(resolve => setTimeout(resolve, 0))
	})

	it("stores hook config", () => {
		expect(MyState.propertyMap.get('a')?.hook?.test).toEqual({ path: 1 })
	});

	it("stores a hook property, event when no config", () => {
		expect(MyState.propertyMap.get('hook')?.hook?.test).toBeDefined()
	});

	it("connects with a hook", () => {

		const testHook = new TestHook(myState)
		// const spy = vi.spyOn(testHook, 'fromState')
		expect(testHook.unsubscribe).toBeDefined()
		expect(testHook.hookedProps.length).toEqual(2)

		expect(spy).toHaveBeenCalledTimes(0)

		myState.a = 1
		expect(spy).toHaveBeenCalledTimes(0)

		myState.a = 2
		expect(spy).toHaveBeenCalledTimes(1)
		expect(spy).toHaveBeenCalledWith('a', 2, myState)


		myState.b = 'ccc'
		expect(spy).toHaveBeenCalledTimes(1)

		testHook.toState({a: 5})
		expect(myState.a).toBe(5)
		expect(spy).toHaveBeenCalledTimes(2)
		expect(spy).toHaveBeenCalledWith('a', 5, myState)

		testHook.unsubscribe()
		myState.a = 3
		expect(spy).toHaveBeenCalledTimes(2)

	});

	it("throws when hookName not specified", () => {
		class TestHook2 extends Hook {
		}
		expect(() =>new TestHook2(myState) ).toThrowError(/hookName/)
	});


});
