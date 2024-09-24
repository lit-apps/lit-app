
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

// TODO: once this is a separate package, we can get Role from userAccess
type Role = 'admin' | 'editor' | 'owner' | 'guest'  // | 'superAdmin' ;

// TODO: once this is a separate package, we can get Role from User
export type UserProfileT = {
	deleted: boolean
	disabled: boolean
	displayName: string
	email: string
	photoURL: string
	phoneNumber: string
	emailVerified: boolean
	type: 'user'
	uid: string
}


export type UserUidRoleT = UserUidT & { roles: Role[] };

export type UserItemRole = UserItem & UserUidRoleT & {
	name?: string; // the name of the user
}
export type Loader<T = UserItem> = (token: string) => Promise<T[]>;
