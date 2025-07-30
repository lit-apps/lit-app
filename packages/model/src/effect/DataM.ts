


import { Schema } from "effect";
import { MetaDataSchema, RefSchema } from "./MetaData.js";

export const DataM = Schema.Struct({
  name: Schema.String,
  metaData: MetaDataSchema,
  ref: RefSchema,
})

export const ResourceM = Schema.Struct({
  ...DataM.fields,
  language: Schema.optional(Schema.String),
  shortDesc: Schema.optional(Schema.String),
})

/**
 * A factory function that creates a new Schema.Struct by merging a base DataM structure
 * with custom data, metadata, and reference schemas.
 * 
 * @template D - The data schema type that extends Schema.Struct
 * @template M - The metadata schema type that extends Schema.Struct (optional)
 * @template R - The reference schema type that extends Schema.Struct (optional)
 * 
 * @param D - The primary data schema to be merged with the base structure
 * @param M - Optional metadata schema to extend the base metaData fields
 * @param R - Optional reference schema to extend the base ref fields
 * 
 * @returns A new Schema.Struct that combines the base DataM fields with the provided schemas
 * 
 * @example
 * ```typescript
 * const UserSchema = Schema.Struct({ name: Schema.String });
 * const UserMetaSchema = Schema.Struct({ createdBy: Schema.String });
 * const EntitySchema = DataStructFact(UserSchema, UserMetaSchema);
 * ```
 */
export const DataStructFact = <
  D extends Schema.Struct.Fields,
  M extends Schema.Struct.Fields = Schema.Struct.Fields,
  R extends Schema.Struct.Fields = Schema.Struct.Fields
>(D: Schema.Struct<D>, M?: Schema.Struct<M>, R?: Schema.Struct<R>) =>
  Schema.Struct({
    ...DataM.fields,
    ...D.fields,
    metaData: Schema.Struct({
      ...DataM.fields.metaData.fields,
      ...M?.fields,
    }),
    ref: Schema.Struct({
      ...DataM.fields.ref.fields,
      ...R?.fields,
    }),
  })

/**
 * A factory function that creates a new Schema.Struct by merging a base ResourceM structure
 * with custom data, metadata, and reference schemas.
 * 
 * @template D - The data schema type that extends Schema.Struct
 * @template M - The metadata schema type that extends Schema.Struct (optional)
 * @template R - The reference schema type that extends Schema.Struct (optional)
 * 
 * @param D - The primary data schema to be merged with the base structure
 * @param M - Optional metadata schema to extend the base metaData fields
 * @param R - Optional reference schema to extend the base ref fields
 * 
 * @returns A new Schema.Struct that combines the base ResourceM fields with the provided schemas
 * 
 * @example
 * ```typescript
 * const UserSchema = Schema.Struct({ name: Schema.String });
 * const UserMetaSchema = Schema.Struct({ createdBy: Schema.String });
 * const EntitySchema = DataStructFact(UserSchema, UserMetaSchema);
 * ```
 */


export const ResourceStructFact = <
  D extends Schema.Struct.Fields,
  M extends Schema.Struct.Fields = Schema.Struct.Fields,
  R extends Schema.Struct.Fields = Schema.Struct.Fields
>(D: Schema.Struct<D>, M?: Schema.Struct<M>, R?: Schema.Struct<R>) =>
  Schema.Struct({
    ...ResourceM.fields,
    ...D.fields,
    metaData: Schema.Struct({
      ...ResourceM.fields.metaData.fields,
      ...M?.fields,
    }),
    ref: Schema.Struct({
      ...ResourceM.fields.ref.fields,
      ...R?.fields,
    }),
  })


