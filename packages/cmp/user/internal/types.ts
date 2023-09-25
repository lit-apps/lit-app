
export type UserItem = {
	uid: string;
	created: string
	provider: string
	email?: string
	displayName?: string
	photoURL?: string
	
};

type Role =  'admin' | 'editor' | 'viewer' | 'owner' | 'guest'  // | 'superAdmin' ;

export type UserItemRole = UserItem & {
	roles: Role[];
	name?: string; // the name of the user
}

export type Loader<T = UserItem> = (token: string) => Promise<T[]>;
