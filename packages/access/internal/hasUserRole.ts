import type { AccessT } from '@lit-app/model';

/** 
 * return true when a user has access against a resource
 * @param role the role to test (owner, editor, viewer, ...)
 * @param access the access object or the groupID
 * @param uid the user id to test
 */
function hasUserRole<A extends AccessT>(role: keyof A['user'], access: A, uid: string): boolean {
	const userRole = access?.user?.[role as keyof typeof access.user];
	return uid && userRole === uid ||
		(Array.isArray(userRole) && (userRole.indexOf(uid) >= 0))
}

export default hasUserRole