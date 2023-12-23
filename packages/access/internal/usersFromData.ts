import { ResourceI, entries } from '@lit-app/model';
import type { UserUidRoleT } from '@lit-app/cmp/user/internal/types';

/**
 * Return all users from metaData.access.user
 */
function usersFromData(data: ResourceI) {
	const users: UserUidRoleT[] = [];
	entries(data.metaData.access.user || {})
		.forEach(([role, value]) => {
			const v = Array.isArray(value) ? value : [value];
			v.forEach((uid) => {
				const user = users.find((user) => user.uid === uid);
				if (!user) {
					users.push({ uid, roles: [role] });
				}
				else {
					user.roles.push(role);
				}
			});
		});
	return users;
}

export default usersFromData;