import { Twemoji } from 'react-emoji-render'
import { Link } from 'react-router-dom'
import { Box, Link as MuiLink, Typography } from '@mui/material'

import { Page } from '@/components/Page'
import { rainbowText } from '@/theming/rainbowText'

export const Page404 = memo(() => (
	<Page>
		<Box
			sx={{
				display: 'flex-column',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Typography
				color="textSecondary"
				sx={{
					fontSize: '12rem',
					fontWeight: 900,
					letterSpacing: 32,
					textAlign: 'center',
					fontFamily: 'DM Serif Display',
				}}
			>
				404
			</Typography>
			<Typography variant="h3" sx={{ textAlign: 'center' }}>
				There's NOTHING here...
				<br /> just empty{' '}
				<Typography
					variant="h3"
					component="span"
					sx={{
						...rainbowText,
					}}
				>
					space!
				</Typography>
				<Twemoji svg text="🛸" />
			</Typography>

			<Typography gutterBottom variant="caption" component="div" sx={{ textAlign: 'center', mt: 4 }}>
				Looks like something went wrong...
			</Typography>
			<Typography variant="body1" component="div" sx={{ textAlign: 'center' }} color="inherit">
				<MuiLink // @ts-ignore
					component={Link}
					to="/"
				>
					Head on back to safe territory!
				</MuiLink>
			</Typography>
		</Box>
	</Page>
))
