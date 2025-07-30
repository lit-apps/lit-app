import { Schema } from "effect";

/**
 * Base class for locale UI
 */
export class LocaleUI extends Schema.Class<LocaleUI>("LocaleUI")({
  heading: Schema.optional(Schema.String).annotations({
    title: 'Heading',
    description: 'The heading of the object '
  }),
}) { }

/**
 * Type derived from the extended schema
 */
export interface LocaleI extends LocaleUI { }

