import userItemMixin from './user-item-mixin.js';
import { MdListItem } from '@material/web/list/list-item.js';
import('@material/web/list/list-item.js');

/**
 *  A card widget to display user information
 */

export class UserCard extends userItemMixin(MdListItem) {


}
