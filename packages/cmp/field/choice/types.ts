
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
type OptionLabel = OptionBase &  {
	label: string
}
type OptionMd = OptionBase &  {
	md: string
}
export type Option = OptionLabel | OptionMd

export type OptionMulti = Option & {
	exclusive?: boolean 
}


export type AriaList = 'group' | 'listbox' | 'radiogroup'




