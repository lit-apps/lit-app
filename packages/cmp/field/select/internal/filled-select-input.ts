import '../../field/filled-field.js';

import {literal} from 'lit/static-html.js';

import {SelectInput} from './select-input.js';

export abstract class FilledSelectInput extends SelectInput {
  protected readonly fieldTag = literal`lapp-filled-field`;
}
