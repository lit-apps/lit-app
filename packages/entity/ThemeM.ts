import { Brand, Schema } from 'effect';

type color = string & Brand.Brand<"color">
export const color = Brand.nominal<color>()

const themeVariant = Schema.Literal(...['light', 'dark']);

export const Theme = Schema.Struct({
  '--color-brand': Schema.String.pipe(Schema.fromBrand(color)),
  '--md-sys-color-primary': Schema.String.pipe(Schema.fromBrand(color)),
  '--md-sys-color-on-primary': Schema.String.pipe(Schema.fromBrand(color)),
  '--md-sys-color-primary-container': Schema.String.pipe(Schema.fromBrand(color)),
  '--md-sys-color-on-primary-container': Schema.String.pipe(Schema.fromBrand(color)),
  '--md-sys-color-secondary': Schema.String.pipe(Schema.fromBrand(color)),
  '--md-sys-color-on-secondary': Schema.String.pipe(Schema.fromBrand(color)),
  '--md-sys-color-secondary-container': Schema.String.pipe(Schema.fromBrand(color)),
  '--md-sys-color-on-secondary-container': Schema.String.pipe(Schema.fromBrand(color)),
  '--md-sys-color-tertiary': Schema.String.pipe(Schema.fromBrand(color)),
  '--md-sys-color-on-tertiary': Schema.String.pipe(Schema.fromBrand(color)),
  '--md-sys-color-tertiary-container': Schema.String.pipe(Schema.fromBrand(color)),
  '--md-sys-color-on-tertiary-container': Schema.String.pipe(Schema.fromBrand(color)),
  '--md-sys-color-background': Schema.optional(Schema.String.pipe(Schema.fromBrand(color))),
})

export const ThemeSettings = Schema.Struct({
  name: Schema.String,
  active: Schema.Boolean,
  description: Schema.optional(Schema.String),
  light: Theme,
  dark: Theme,
}).annotations({
  title: 'Theme Settings',
  description: 'Settings describing a theme, with light and dark variants',
});

export type ThemeT = Schema.Schema.Type<typeof Theme>;
export type ThemeSettingsT = Schema.Schema.Type<typeof ThemeSettings>;
export type ThemeVariantT = Schema.Schema.Type<typeof themeVariant>;