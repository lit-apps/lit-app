/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {createTokenTests} from '../testing/tokens.js';

import {LapList} from './list.js';
import {LapListItem} from './list-item.js';

describe('<md-list>', () => {
  describe('.styles', () => {
    createTokenTests(LapList.styles);
  });
});

describe('<md-list-item>', () => {
  describe('.styles', () => {
    createTokenTests(LapListItem.styles);
  });
});
