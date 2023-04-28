/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {TestTable} from './lib/test-table.js';


export {TestTableTemplate} from './lib/test-table.js';

declare global {
  interface HTMLElementTagNameMap {
    'lap-test-table': MdTestTable;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('lap-test-table')
export class MdTestTable<S extends string = string> extends TestTable<S> {
  // static override styles= [testTableStyles];
}
