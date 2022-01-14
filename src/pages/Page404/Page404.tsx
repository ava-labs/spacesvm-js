import { Link } from 'react-router-dom'
import { Link as MuiLink, Typography, useTheme } from '@mui/material'
import { Box } from '@mui/system'

import { Page } from '@/components/Page'

export const Page404 = () => {
	const theme = useTheme()
	return (
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
							backgroundSize: '400% 100%',
							backgroundClip: 'text',
							textFillColor: 'transparent',
							backgroundColor: theme.palette.mode === 'dark' ? 'white' : 'unset',
							animation: 'hue 5s infinite alternate',
							caretColor: '#523df1',
							backgroundImage:
								'linear-gradient(60deg,rgba(239,0,143,.5),rgba(110,195,244,.5),rgba(112,56,255,.5),rgba(255,186,39,.5))',
						}}
					>
						space!
					</Typography>
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
	)
}
