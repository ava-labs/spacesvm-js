import { createTheme, responsiveFontSizes, Theme } from '@mui/material'
import merge from 'lodash/merge'

import { CustomPalette, darkCustomPalette, lightCustomPalette } from './customPalette'
import { commonOverrides, darkOverrides, lightOverrides } from './overrides'
import { darkPalette, lightPalette } from './palette'
import { typography } from './typography'

declare module '@mui/material/styles' {
	interface Theme {
		customPalette: CustomPalette
	}
	interface ThemeOptions {
		customPalette?: CustomPalette
	}
}

export const darkTheme: Theme = responsiveFontSizes(
	createTheme({
		palette: { ...darkPalette },
		customPalette: { ...darkCustomPalette },
		typography: { ...typography },
		components: merge({}, { ...commonOverrides }, { ...darkOverrides }),
	}),
)

export const lightTheme: Theme = responsiveFontSizes(
	createTheme({
		palette: { ...lightPalette },
		customPalette: { ...lightCustomPalette },
		typography: { ...typography },
		components: merge({}, { ...commonOverrides }, { ...lightOverrides }),
	}),
)
