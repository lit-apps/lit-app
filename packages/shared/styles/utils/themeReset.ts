import { unsafeCSS } from "lit";
type SuffixT = `--${string}`

const sysColorPrefix = '--md-sys-color'
const colorTokens = [
  'background',
  'error',
  'error-container',
  'inverse-on-surface',
  'inverse-primary',
  'inverse-surface',
  'on-background',
  'on-primary-container',
  'on-primary',
  'on-secondary-container',
  'on-secondary',
  'on-surface-variant',
  'on-surface',
  'on-tertiary-container',
  'on-tertiary',
  'outline-variant',
  'outline',
  'primary-container',
  'primary',
  'scrim',
  'secondary-container',
  'secondary',
  'shadow',
  'surface-bright',
  'surface-container-high',
  'surface-container-highest',
  'surface-container-low',
  'surface-container-lowest',
  'surface-container',
  'surface-dim',
  'surface-tint',
  'surface-variant',
  'surface',
  'tertiary-container',
  'tertiary',
] as const

const typefacePrefix = '--md-sys-typeface';
const typefaceTokens = [
  'brand',
  'plain',
  'weight-bold',
  'weight-medium',
  'weight-regular'
]

const shapePrefix = '--md-sys-shape';
const shapeTokens = [
  'corner-extra-large',
  'corner-extra-small',
  'corner-full',
  'corner-large',
  'corner-medium',
  'corner-none',
  'corner-small',
]

const typescalePrefix = '--md-sys-typescale';
const typescaleTokens = [
  'body-large-font',
  'body-large-line-height',
  'body-large-size',
  'body-large-weight',
  'body-medium-font',
  'body-medium-line-height',
  'body-medium-size',
  'body-medium-weight',
  'body-small-font',
  'body-small-line-height',
  'body-small-size',
  'body-small-weight',
  'display-large-font',
  'display-large-line-height',
  'display-large-size',
  'display-large-weight',
  'display-medium-font',
  'display-medium-line-height',
  'display-medium-size',
  'display-medium-weight',
  'display-small-font',
  'display-small-line-height',
  'display-small-size',
  'display-small-weight',
  'headline-large-font',
  'headline-large-line-height',
  'headline-large-size',
  'headline-large-weight',
  'headline-medium-font',
  'headline-medium-line-height',
  'headline-medium-size',
  'headline-medium-weight',
  'headline-small-font',
  'headline-small-line-height',
  'headline-small-size',
  'headline-small-weight',
  'label-large-font',
  'label-large-line-height',
  'label-large-size',
  'label-large-weight',
  'label-large-weight-prominent',
  'label-medium-font',
  'label-medium-line-height',
  'label-medium-size',
  'label-medium-weight',
  'label-medium-weight-prominent',
  'label-small-font',
  'label-small-line-height',
  'label-small-size',
  'label-small-weight',
  'title-large-font',
  'title-large-line-height',
  'title-large-size',
  'title-large-weight',
  'title-medium-font',
  'title-medium-line-height',
  'title-medium-size',
  'title-medium-weight',
  'title-small-font',
  'title-small-line-height',
  'title-small-size',
  'title-small-weight',
]

function themeReset(suffix: SuffixT, withSuffix: SuffixT, tokens: readonly string[]) {
  return unsafeCSS(
    `:host{
    ${tokens.map(token => `${suffix}-${token}: var(${withSuffix}-${token}, inherit);`).join('\n')}
     }`
  )
}

/**
 * A function to reset the colors of the theme.
 */
export function themeResetColors(withSuffix: SuffixT) {
  return themeReset(sysColorPrefix, withSuffix, colorTokens)
}