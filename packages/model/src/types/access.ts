type uid = string
type app = string

/**
 * The base roles for the application.
 * Some entities will have additional roles like 'reviewer'
 */
export type RoleT = 'admin' | 'editor' | 'owner' | 'guest'  // | 'superAdmin' ;

/**
 * the type of access status for an entity
 */
export type StatusT = 'public' | 'private'

export type UserAccessT = {
  owner: uid
  admin?: uid[] // can set editor and viewer
  editor?: uid[] // can edit
  guest?: uid[] // can view
}

export type AccessT<A = UserAccessT> = {
  app: app
  user: A
  // this is breaking tsoa  - hence the code below ... 
  userById: { [uid: uid]: (keyof A)[] }
  //userById: { [uid: string]: (keyof UserAccessT)[] }
  status: StatusT
}

// storing the access information for an entity
export type AuthorizationT = {
  isOwner: boolean
  canEdit: boolean
  canView: boolean
  canDelete: boolean
}

/**
 * Type definition for a function that retrieves entity access information.
 *
 * @template D - The type of the data parameter. Defaults to `any`.
 * @template AT - The type of the access parameter. Extends `Access` and defaults to `any`.
 * @template EAT - The type of the returned entity access information. Extends `EntityAccessT` and defaults to `any`.
 *
 * @param access - The access information of type `AT`.
 * @param data - The data of type `D`.
 * @returns The entity access information of type `EAT`.
 */
export type GetAccessT<
  D = any,
  AT extends AccessT = AccessT,
  EAT extends AuthorizationT = AuthorizationT
> = (access: AT, data: D) => EAT




// export type RoleFrom<A extends UserAccess> = {
//   [K in keyof A]: A[K] extends uid[] ? K : never
// }[keyof A]

// export function roleFrom<A extends UserAccess>(access: Access<A>, userId: uid): RoleFrom<A> | undefined {
//   for (const role in access.user) {
//     if (access.user[role as keyof A]?.includes(userId)) {
//       return role as RoleFrom<A>;
//     }
//   }
//   return undefined;
// }