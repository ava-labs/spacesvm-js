import { ThemeOptions } from '@mui/material'

export const typography: ThemeOptions['typography'] = {
	fontFamily: [
		'Inter', // Main fontFamily
		'-apple-system', // fallback fonts
		'BlinkMacSystemFont',
		'"Segoe UI"',
		'Roboto',
		'"Helvetica Neue"',
		'Arial',
		'sans-serif',
		'"Apple Color Emoji"',
		'"Segoe UI Emoji"',
		'"Segoe UI Symbol"',
	].join(','),
	h1: {
		fontWeight: 900,
	},
	h2: {
		fontWeight: 900,
	},
	h3: {
		fontWeight: 900,
	},
	h4: {
		fontWeight: 900,
	},
	h5: {
		fontWeight: 900,
	},
	h6: {
		fontWeight: 900,
	},
}
