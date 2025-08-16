type ThemeBaseT = {
	label?: string,
	name: string,
	index: number,
	desc: string,
	longDesc: string,
	theme: {
		[key: string]: string | boolean
	}
}

export type ThemeT = ThemeBaseT & {
	lightTheme: string,
	darkTheme?: never
} | ThemeBaseT & {
	lightTheme?: never,
	darkTheme: string
}
export type ThemeMapT = { [key: string]: ThemeT }