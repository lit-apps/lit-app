/**
 * Defines the schema for metadata associated with a document or data entry.
 * This metadata includes timestamps, access control information, and versioning.
 *
 * @property timestamp - The creation or last modification timestamp of the data.
 * @property timestampPublished - An optional timestamp indicating when the data was published.
 * @property access - The access control schema defining who can read/write the data.
 * @property deleted - A boolean flag for soft-deleting the data.
 * @property version - An optional version string for the data.
 * @property type - A string identifier for the type of the document.
 */



import { Schema } from 'effect';
import { Access, app, uid } from './Access.js';


export const MetaDataSchema = Schema.Struct({
  timestamp: Schema.Date,
  timestampPublished: Schema.optional(Schema.Date),
  access: Access,
  deleted: Schema.Boolean,
  version: Schema.optional(Schema.String),
  type: Schema.String
})

/**
 * Defines a reference schema, uniquely identifying a user within a specific application.
 *
 * @property user - The unique identifier for the user, branded as `uid`.
 * @property app - The identifier for the application, branded as `app`.
 */
export const RefSchema = Schema.Struct({
  user: Schema.String.pipe(Schema.fromBrand(uid)),
  app: Schema.String.pipe(Schema.fromBrand(app)),
})


/**
 * A factory function that creates a new metadata schema with a specialized `access` field.
 * It takes an `access` schema and merges it into the base `MetaData` schema,
 * overriding the default `access` field.
 *
 * @template A - A schema type that extends `Schema.Struct.Field`.
 * @param A - The schema to be used for the `access` field.
 * @returns A new `Schema.Struct` that extends `MetaData` with the provided `access` schema.
 */
export const MetaDataFact = <A extends Schema.Struct<any>>(A: A) => Schema.Struct({
  ...MetaDataSchema.fields,
  access: A,
})
