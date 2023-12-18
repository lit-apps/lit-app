import '../../field/filled-field.js';

import {literal} from 'lit/static-html.js';

import {Select} from './select.js';

export abstract class FilledSelect extends Select {
  protected readonly fieldTag = literal`lapp-filled-field`;
}
