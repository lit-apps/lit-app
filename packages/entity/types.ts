type AppPreferenceI = {
	version?: 'stable' | 'next'
}

export interface UserPreferenceI {
	theme?: string
	language?: string
	shortcut?: {
		team: string[]
	}
	appPreference?: {
		appSurvey?: AppPreferenceI
	}
}