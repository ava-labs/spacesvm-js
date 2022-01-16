import { Theme } from '@mui/material'

export const rainbowText: any = {
	lineHeight: 1,
	backgroundSize: '400% 100%',
	backgroundClip: 'text',
	wordBreak: 'break-word',
	textFillColor: 'transparent',
	backgroundColor: (theme: Theme) => (theme.palette.mode === 'dark' ? '#fff' : 'unset'),
	animation: 'hue 5s infinite alternate',
	caretColor: '#523df1',
	backgroundImage:
		'linear-gradient(60deg,rgba(239,0,143,.5),rgba(110,195,244,.5),rgba(112,56,255,.5),rgba(255,186,39,.5))',
}
