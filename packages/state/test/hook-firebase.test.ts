import { html, LitElement } from "lit";
import { customElement } from 'lit/decorators.js';
import type { IWindow } from 'happy-dom'
import { HookFirebase} from './hook-firebase'
// testing with vitest - see https://vitest.dev/guide
import { beforeEach, describe, it, vi, assert, expect } from 'vitest'

import { State } from "../src/state";
import { property } from '../src/decorators/property'
import { hook } from '../src/decorators/hook'
import { Hook } from '../src/hook'
import { remove, set, getDatabase, ref, get, child, onValue } from 'firebase/database';
import { initializeApp } from "firebase/app"


const firebaseConfig = {
  apiKey: 'AIzaSyDTP-eiQezleFsV2WddFBAhF_WEzx_8v_g',
  authDomain: 'polymerfire-test.firebaseapp.com',
  databaseURL: 'https://polymerfire-test.firebaseio.com',
}

initializeApp(firebaseConfig);

const testRef = ref(getDatabase(), '/testDocument')
const wait = async (ms: number = 200) => await new Promise(resolve => setTimeout(resolve, ms))


const cb = () => {}
const spy = vi.fn(cb)

class MyState extends State {
	@hook('firebase')
	@property() a
	@hook('firebase', { path: 'bPath'})
	@property() b
	@property() c
} 

const myState = new MyState()
const hookFirebase = new HookFirebase(myState)


declare global {
	interface Window extends IWindow { }
}

describe("hook", () => {

	beforeEach(async () => {
		await window.happyDOM.whenAsyncComplete()
		await remove(testRef)
		await new Promise(resolve => setTimeout(resolve, 0))
	})

	it("can read from firebase", async () => {
		// This is just to test the firebase settings
		await set(testRef, {_: 1})
		const value = await get(child(testRef, '_')).then(snap => snap.val())
		expect(value).toEqual(1)
	});

	it("settings a value to the state reflects to firebase", async () => {
		expect(myState.a).not.toBeDefined()
		expect(myState.b).not.toBeDefined()
		// @ts-expect-error  - we are cheating
		expect(hookFirebase._unsubscribe.length).toBe(0) 
		hookFirebase.ref = testRef
		// @ts-expect-error  - we are cheating
		expect(hookFirebase._unsubscribe.length).toBe(2) 
		myState.a = 1
		myState.b = 2
		await wait(500)
		const valueA = await get(child(testRef, 'a')).then(snap => snap.val())
		const valueB = await get(child(testRef, 'bPath')).then(snap => snap.val())
		expect(valueA).toBe(1)
		expect(valueB).toBe(2)

	});

	it("settings a value to firebase reflects to the state", async () => {
		const s = new MyState()
		const hookFirebase = new HookFirebase(s)
		expect(s.a).not.toBeDefined()
		expect(s.b).not.toBeDefined()
		// @ts-expect-error  - we are cheating
		expect(hookFirebase._unsubscribe.length).toBe(0) 
		hookFirebase.ref = testRef
		// @ts-expect-error  - we are cheating
		expect(hookFirebase._unsubscribe.length).toBe(2) 
		await set(child(testRef, 'a'), 1)
		await set(child(testRef, 'bPath'), 2)
		await wait(500)
		expect(myState.a).toBe(1)
		expect(myState.b).toBe(2)

	});

	it("gets value from firebase on init", async () => {
		await set(child(testRef, 'a'), 2)
		await set(child(testRef, 'bPath'), 3)
		const s = new MyState()
		const hookFirebase = new HookFirebase(s)
		hookFirebase.ref = testRef
		await wait(500)
		expect(myState.a).toBe(2)
		expect(myState.b).toBe(3)
	});

	it("sets value at firebase level if state is defined but firebase is not", async () => {
		let valueB = await get(child(testRef, 'bPath')).then(snap => snap.val())
		expect(valueB).toBe(null)

		const s = new MyState()
		const hookFirebase = new HookFirebase(s)
		s.b = "imustexist"

		hookFirebase.ref = testRef
		await wait(500)
		valueB = await get(child(testRef, 'bPath')).then(snap => snap.val())
		expect(valueB).toBe("imustexist")
	});

	it("does not set value at firebase level if state is defined and firebase value exists", async () => {
		await set(child(testRef, 'bPath'), 'iexist')
		await wait(500)
		let valueB = await get(child(testRef, 'bPath')).then(snap => snap.val())
		expect(valueB).toBe('iexist')

		const s = new MyState()
		const hookFirebase = new HookFirebase(s)
		s.b = "i will be overriden"

		hookFirebase.ref = testRef
		await wait(500)
		valueB = await get(child(testRef, 'bPath')).then(snap => snap.val())
		expect(valueB).toBe('iexist')
		expect(s.b).toBe('iexist')
	});

	it("stores all hooked stateValue through a call to store", async () => {
		
		const s = new MyState()
		const hookFirebase = new HookFirebase(s)
		s.a = 1;
		s.b = 2;
		s.c = 3;

		hookFirebase.ref = testRef
		hookFirebase.store()
		await wait(500)
		const value = await get(testRef).then(snap => snap.val())
		expect(value).toEqual({a: 1, bPath: 2})
	});

	it("can be reset", async () => {
		
		const s = new MyState()
		const hookFirebase = new HookFirebase(s)
		s.a = 1;
		s.b = 2;
		s.c = 3;

		hookFirebase.ref = testRef
		await wait(500)
		s.reset()
		expect(hookFirebase.ref).toBe(undefined)
	});

});
