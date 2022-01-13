import { ThemeOptions } from '@mui/material'

export const commonOverrides: ThemeOptions['components'] = {
	MuiFilledInput: {
		styleOverrides: {
			root: {
				fontFamily: 'DM Serif Display',
			},
			input: {
				paddingTop: 12,
			},
		},
	},
	MuiTooltip: {
		styleOverrides: {
			tooltip: {
				borderRadius: 9999,
			},
		},
	},
	MuiButton: {
		styleOverrides: {
			root: {
				borderRadius: 9999,
				whiteSpace: 'nowrap',
				textTransform: 'unset',
				minWidth: 42,
			},
			outlined: {
				color: 'inherit',
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

export const darkOverrides: ThemeOptions['components'] = {
	MuiTooltip: {
		styleOverrides: {
			tooltip: {
				backgroundColor: '#000000EE',
				border: '1px solid #FFFFFF33',
			},
		},
	},
}
