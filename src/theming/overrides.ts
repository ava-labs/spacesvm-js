import { ThemeOptions } from '@mui/material'

export const commonOverrides: ThemeOptions['components'] = {
	MuiFilledInput: {
		styleOverrides: {
			root: {
				fontFamily: 'DM Serif Display',
			},
		},
	},
	MuiTooltip: {
		styleOverrides: {
			tooltip: {
				backgroundColor: '#000000EE',
			},
			arrow: {
				color: '#000000EE',
			},
		},
	},
	MuiButton: {
		styleOverrides: {
			root: {
				whiteSpace: 'nowrap',
				textTransform: 'unset',
				minWidth: 42,
			},
			contained: {
				textTransform: 'unset',
			},
		},
	},
	MuiOutlinedInput: {
		styleOverrides: {
			notchedOutline: {
				border: 'none',
			},
		},
	},
}

export const lightOverrides: ThemeOptions['components'] = {}

export const darkOverrides: ThemeOptions['components'] = {}
