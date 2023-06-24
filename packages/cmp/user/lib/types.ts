// import type { TextFieldSelect } from '@preignition/pwi-textfield-select';
export type UserItem = {
	uid: string;
	email?: string;
	
};

export type UserItemRoles = UserItem & {
	roles: string[];
}

export type Loader<T = UserItem> = (token: string) => Promise<T[]>;
