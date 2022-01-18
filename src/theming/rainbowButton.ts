import { Theme } from '@mui/material'

export const rainbowButton: any = {
	backgroundColor: '#e70256',
	backgroundImage: 'linear-gradient(100deg,#aa039f,#ed014d,#f67916)',
	padding: (theme: Theme) => theme.spacing(1, 10),
	height: 80,
	minWidth: 280,
	fontWeight: 900,
	fontSize: 24,
	position: 'relative',
	boxShadow: '0 0 40px rgb(231 2 86 / 60%)',
	'&.Mui-disabled': {
		backgroundColor: 'hsla(0,0%,100%,0.1)',
		backgroundImage: 'unset',
	},
	'&:after': {
		content: "''",
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		zIndex: 0,
		display: 'block',
		borderRadius: 'inherit',
		backgroundColor: 'hsla(0,0%,100%,.6)',
		mixBlendMode: 'overlay',
		pointerEvents: 'none',
		transition: 'opacity .25s ease',
		opacity: 0,
	},
	'&:hover': {
		backgroundImage: 'linear-gradient(100deg,#aa039f,#ed014d,#f67916)',
		boxShadow: '0 0 40px rgb(231 2 86 / 80%)',
		'&:after': {
			opacity: 1,
		},
	},
}
