import { TemplateResult } from "lit"

export type MediaYoutube = {
	mediaType: 'youtube'
	videoId: string
	playLabel?: string
	params?: string
}

export type MediaImage = {
	mediaType: 'image'
	url: string
}
export type MediaIcon = {
	mediaType: 'icon'
	icon: string
}

export type Media = MediaImage | MediaYoutube | MediaIcon

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
