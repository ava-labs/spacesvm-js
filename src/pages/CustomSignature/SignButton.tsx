import styled from '@emotion/styled'
import { Button } from '@mui/material'

export const SignButton = styled(Button)(({ progress = 0 }: any) => ({
	backgroundColor: '#e70256',
	backgroundImage: 'linear-gradient(100deg,#aa039f,#ed014d,#f67916)',
	fontWeight: 900,
	fontSize: 24,
	position: 'relative',
	boxShadow: '0 0 40px rgb(231 2 86 / 60%)',
	height: 50,
	'&:hover': {
		backgroundImage: 'linear-gradient(100deg,#aa039f,#ed014d,#f67916)',
		boxShadow: '0 0 40px rgb(231 2 86 / 80%)',
	},
	'&.Mui-disabled': {
		backgroundColor: 'hsla(0,0%,100%,0.1)',
		backgroundImage: 'unset',
	},
	'&:after': {
		content: "''",
		zIndex: 2,
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		borderRadius: 9999,
		clipPath: `inset(0 ${100 - progress}% 0 0)`,
		backgroundColor: '#e70256',
		backgroundImage: 'linear-gradient(100deg,#aa039f,#ed014d,#f67916)',
		transition: 'clip-path 1s ease',
	},
}))
