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
	MuiDialog: {
		styleOverrides: {
			paper: {
				backgroundImage: 'unset',
				borderRadius: 18,
				padding: 18,
			},
		},
	},
	MuiDrawer: {
		styleOverrides: {
			paper: {
				backgroundImage: 'unset',
			},
		},
	},
	MuiPaper: {
		styleOverrides: {
			rounded: {
				borderRadius: 16,
			},
		},
	},
	MuiChip: {
		styleOverrides: {
			root: {
				color: '#523df1',
				backgroundColor: 'rgba(82, 61, 241, 0.04)',
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

export const lightOverrides: ThemeOptions['components'] = {
	MuiChip: {
		styleOverrides: {
			root: {
				color: '#523df1',
				backgroundColor: 'rgba(82, 61, 241, 0.04)',
			},
		},
	},
}

export const darkOverrides: ThemeOptions['components'] = {
	MuiTooltip: {
		styleOverrides: {
			tooltip: {
				backgroundColor: '#000000EE',
				border: '1px solid #FFFFFF33',
			},
		},
	},
	MuiChip: {
		styleOverrides: {
			root: {
				color: '#7362f4',
				backgroundColor: 'rgba(115, 98, 244, 0.08)',
			},
		},
	},
}
