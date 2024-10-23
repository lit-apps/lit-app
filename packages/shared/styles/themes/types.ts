export type ThemeT = {
	label?: string,
	name: string, 
	index: number, 
	desc: string, 
	longDesc: string,
	lightTheme?: string, 
	darkTheme?: string, 
	theme: {
		[key: string]: string | boolean
	}
}

export type ThemeMapT = {[key: string]: ThemeT}