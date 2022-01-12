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
		fontWeight: 700,
	},
	h2: {
		fontWeight: 700,
	},
	h3: {
		fontWeight: 700,
	},
	h4: {
		fontWeight: 700,
		fontSize: 28,
	},
	h5: {
		fontWeight: 700,
	},
	h6: {
		fontWeight: 700,
	},
}
