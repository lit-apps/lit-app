import { TemplateResult } from 'lit'

export type MediaYoutube = {
	mediaType: 'youtube'
	videoId: string
	playLabel?: string
	params?: string
}

export type MediaImage = {
	mediaType: 'image'
	alt?: string
	url: string
}

export type Media = MediaImage | MediaYoutube

export type Option = {
	code: string
	label: string
	md?: TemplateResult // label rendered as markdown
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
}

export type OptionMulti = Option & {
	exclusive?: boolean 
}


export type AriaList = 'group' | 'listbox' | 'radiogroup'




