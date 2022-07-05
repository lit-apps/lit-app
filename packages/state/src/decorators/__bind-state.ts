/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

/*
 * IMPORTANT: For compatibility with tsickle and the Closure JS compiler, all
 * property decorators (but not class decorators) in this file that have
 * an @ExportDecoratedItems annotation must be defined as a regular function,
 * not an arrow function.
 */
import { ReactiveElement, ReactiveControllerHost } from '@lit/reactive-element';
import { decorateProperty } from '@lit/reactive-element/decorators/base.js';
import { State } from '../state';
import { StateController } from '../state-controller';

/**
 * bind a state to a ReactivElement
 *
 * @param state the state to listen to
 * ```ts
 * const myState = new State()
 * class MyElement {
 * 
 *   @bindState(state)
 * 
 *   render() {
 *     return html`
 *       <div>
 *         ${myState.value}
 *       </div>
 *     `;
 *   }
 *
 * }
 * ```
 * @category Decorator
 */
export function bindState(state: State) {
	return decorateProperty({
		finisher: (ctor: typeof ReactiveElement, name: PropertyKey) => {
			new StateController<State>(ctor.prototype, state)

		},
	});
}
