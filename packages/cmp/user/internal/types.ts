// import type { TextFieldSelect } from '@preignition/pwi-textfield-select';

export type UserItem = {
	uid: string;
	email?: string;
	
};

type Role =  'admin' | 'editor' | 'viewer' | 'owner' | 'guest'  // | 'superAdmin' ;

export type UserItemRole = UserItem & {
	roles: Role[];
	name?: string; // the name of the user
}

export type Loader<T = UserItem> = (token: string) => Promise<T[]>;
