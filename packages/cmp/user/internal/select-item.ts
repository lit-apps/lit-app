import userItemMixin from './user-item-mixin.js';
import { MdSelectOption } from '@material/web/select/select-option.js';
import('@material/web/select/select-option.js');

/**
 *  A card widget to display user information
 */

export class UserSelectItem extends userItemMixin(MdSelectOption) {


}
