import { Brand, Schema } from 'effect';

type uid = string & Brand.Brand<"uid">
export const uid = Brand.nominal<uid>()

type app = string & Brand.Brand<"app">
export const app = Brand.nominal<app>()

const Role = ['admin', 'guest', 'editor', 'owner'] as const;
const RoleType = Schema.Literal(...Role);
// type RoleT = Schema.Schema.Type<typeof RoleType>
const AccessType = Schema.Literal(...['public', 'private', 'protected']);

export const UserAccess = Schema.Struct({
  owner: Schema.String.pipe(Schema.fromBrand(uid)),
  admin: Schema.optional(Schema.Array(Schema.String.pipe(Schema.fromBrand(uid)))),
  editor: Schema.optional(Schema.Array(Schema.String.pipe(Schema.fromBrand(uid)))),
  guest: Schema.optional(Schema.Array(Schema.String.pipe(Schema.fromBrand(uid)))),
})

export const Access = Schema.Struct({
  app: Schema.String.pipe(Schema.fromBrand(app)),
  user: UserAccess,
  userById: Schema.Record({ key: Schema.String.pipe(Schema.fromBrand(uid)), value: Schema.Array(RoleType) }),
  status: AccessType
});

export type UserAccessT = Schema.Schema.Type<typeof UserAccess>;
export type AccessT = Schema.Schema.Type<typeof Access>;

// const UserAccessFromRoles = (roles: RoleT[]) => {
//   return Schema.Struct({
//     owner: Schema.String.pipe(Schema.fromBrand(uid)),
//     ...roles.reduce((acc, role) => {
//       acc[role] = Schema.optional(Schema.Array(Schema.String.pipe(Schema.fromBrand(uid))));
//       return acc;
//     }, {} as Record<RoleT, Schema.Option<Schema.BrandSchema<string & Brand.Brand<"uid">>>>),
//   });
// }

// const test = UserAccessFromRoles(['admin', 'editor', 'guest']);
//
// test.fields