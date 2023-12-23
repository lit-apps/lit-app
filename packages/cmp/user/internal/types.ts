type UserUidT = {
	uid: string
};

export type UserItem = UserUidT & {
	created: string
	provider: string
	email?: string
	displayName?: string
	photoURL?: string

};

type Role = 'admin' | 'editor' | 'viewer' | 'owner' | 'guest'  // | 'superAdmin' ;

export type UserUidRoleT = UserUidT & { roles: Role[] };

export type UserItemRole = UserItem & UserUidRoleT & {
	name?: string; // the name of the user
}
export type Loader<T = UserItem> = (token: string) => Promise<T[]>;
