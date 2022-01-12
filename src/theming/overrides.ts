import { ThemeOptions } from '@mui/material'

export const commonOverrides: ThemeOptions['components'] = {
	MuiListItemIcon: {
		styleOverrides: {
			root: {
				minWidth: 28,
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
	MuiLink: {
		styleOverrides: {
			root: {
				fontWeight: 500,
			},
		},
	},
	MuiDialog: {
		styleOverrides: {
			root: {
				backdropFilter: 'blur(4px)',
			},
			paper: {
				borderRadius: 16,
			},
		},
	},
	MuiButton: {
		styleOverrides: {
			root: {
				textTransform: 'unset',
				minWidth: 42,
			},
			contained: {
				textTransform: 'unset',
			},
		},
	},
	MuiCard: {
		styleOverrides: {
			root: {
				borderRadius: 16,
			},
		},
	},
	MuiListItem: {
		styleOverrides: {
			root: {
				padding: '6px 8px',
			},
		},
	},
	MuiListItemButton: {
		styleOverrides: {
			root: {
				padding: '6px 8px',
			},
		},
	},
	MuiListItemText: {
		styleOverrides: {
			root: {
				margin: 0,
			},
		},
	},
	MuiLinearProgress: {
		styleOverrides: {
			root: {
				height: 8,
				borderRadius: 4,
			},
			bar: {
				borderRadius: 4,
				transition: 'transform 600s linear',
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
	MuiPopover: {
		styleOverrides: {
			paper: {
				borderRadius: 8,
			},
		},
	},
}

export const lightOverrides: ThemeOptions['components'] = {
	MuiButton: {
		styleOverrides: {
			contained: {
				backgroundColor: '#FFFFFF80',
				'&:hover': {
					backgroundColor: '#FFFFFFCC',
				},
				'&.Mui-disabled': {
					backgroundColor: '#FFFFFF40',
					color: '#00000085',
				},
			},
		},
	},

	MuiCheckbox: {
		styleOverrides: {
			root: {
				color: '#00c6b6',
			},
		},
	},
	MuiLinearProgress: {
		styleOverrides: {
			root: {
				backgroundColor: '#00000010',
			},
		},
	},
	MuiAppBar: {
		styleOverrides: {
			root: {
				backgroundColor: '#fff',
			},
		},
	},
	MuiPopover: {
		styleOverrides: {
			paper: {
				background: '#ECF3FF',
			},
		},
	},
}

export const darkOverrides: ThemeOptions['components'] = {
	MuiButton: {
		styleOverrides: {
			contained: {
				backgroundColor: '#00000026',
				'&:hover': {
					backgroundColor: '#00000036',
				},
				'&.Mui-disabled': {
					backgroundColor: '#00000010',
					color: '#FFFFFF95',
				},
			},
		},
	},
	MuiCheckbox: {
		styleOverrides: {
			root: {
				color: '#00DDCB',
			},
		},
	},
	MuiLinearProgress: {
		styleOverrides: {
			root: {
				backgroundColor: '#FFFFFF26',
			},
		},
	},
	MuiAppBar: {
		styleOverrides: {
			root: {
				backgroundColor: '#05100D',
			},
		},
	},
	MuiPopover: {
		styleOverrides: {
			paper: {
				background: '#0D2130',
			},
		},
	},
}
