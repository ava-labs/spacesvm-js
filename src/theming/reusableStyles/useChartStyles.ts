import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'

export const useChartStyles = makeStyles((theme: Theme) => ({
	withLegend: {
		'& .recharts-text': {
			fill: theme.palette.text.secondary,
		},
		'& .recharts-legend-item': {
			cursor: 'pointer',
			'&:hover': {
				opacity: '0.8',
			},
		},
		'& .inactive': {
			'& span': {
				textDecoration: 'line-through',
			},
		},
	},
}))
