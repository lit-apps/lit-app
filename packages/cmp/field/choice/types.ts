import { Schema } from "effect"
import { TemplateResult } from "lit"

const MediaYoutube = Schema.TaggedStruct('youtube', {
	videoId: Schema.String,
	// mediaType: Schema.Literal('youtube'),
	playLabel: Schema.optional(Schema.String),
	params: Schema.optional(Schema.String),
})
const MediaImage = Schema.TaggedStruct('image', {
	url: Schema.String,
	// mediaType: Schema.Literal('image'),
})
const MediaIcon = Schema.TaggedStruct('icon', {
	icon: Schema.String,
	// mediaType: Schema.Literal('icon'),
})
export const Media = Schema.Union(
	MediaYoutube,
	MediaImage,
	MediaIcon)
export type Media = typeof Media.Type
export type MediaYoutube = typeof MediaYoutube.Type
export type MediaImage = typeof MediaImage.Type
export type MediaIcon = typeof MediaIcon.Type

type OptionBase = {
	code: string
	name?: string
	category?: string
	description?: string // internal use only
	supportingText?: string // supporting text presented to the end user
	disabled?: boolean
	specify?: boolean
	specifyLabel?: string
	exclusive?: boolean
	index?: number
	media?: Media
	alt?: string
	/**
	 * The label as text (label can contain markdown)
	 */
	innerTextLabel?: string
}
export type OptionLabelT = OptionBase & {
	md?: never
	label: string | TemplateResult
}
export type OptionMdT = OptionBase & {
	label?: never
	md: string
}
export type Option = OptionLabelT | OptionMdT

export type OptionMulti = Option & {
	exclusive?: boolean
}

export function isOptionMdT(option: Option): option is OptionMdT {
	return (option as OptionMdT).md !== undefined
}

export function isOptionLabelT(option: Option): option is OptionLabelT {
	return (option as OptionLabelT).label !== undefined
}

export type AriaList = 'group' | 'listbox' | 'radiogroup'


// const option: Option[] = [
// 	{ code: '1', label: 'Option 1' },
// 	{ code: '2', label: 'Option 2' },
// ]
// const option2: Option[] = [
// 	{ code: '1', label: html`Option 1` },
// 	{ code: '2', label: 'Option 2' },
// ]
