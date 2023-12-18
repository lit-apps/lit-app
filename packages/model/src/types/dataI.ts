
type uid = string
export type GroupName = 'admin' | 'editor' | 'viewer' |  'guest' | 'superAdmin'

export type UserAccess = {
	owner: uid 
	admin?: uid[] // can set editor and viewer
	editor?: uid[] // can edit
	viewer?: uid[] // can view DEPRECATED
	guest?: uid[] // can view
}
// Group is a collection of users with a name 
// when a user is added as a member, their tokens are modified to include the group group[${teamId}_${groupName}] = timestamp
export type Group = {
	name: GroupName
	team: string // id of the team for which the group applies
	owner: uid // uid owns the group - can add/remove members and editors // can set owner
	editor: uid[] // can add/remove members -- should be in a sub collection
	member: uid[] // members of the group -- should be in a sub collection
}

export type Status = 'public' | 'private'

export type Access = {
	app: string
	user: UserAccess
	status: Status
}

// ref refers to external, not entered by users
export type Ref = {
	user: string
	app: string,
}

export interface MetaData<A = Access, T = string> {
	access: A
	timestamp: any // timestamp
	timestampPublished?: any // timestamp
	deleted: boolean
	type: T
}


// the main data interface
export interface DataI<M = MetaData, R = Ref> {
	ref: R
	metaData: M
}

	


// a type that is an array of T and has $id and $path properties
// $id and $path property are added by Firebase controllers on collections
export type CollectionI<T> = (T & {$id: string, $path: string})
export type Collection<T> = CollectionI<T>[]

