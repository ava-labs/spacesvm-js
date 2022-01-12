import { memo } from 'react'
import { IoLogoGithub } from 'react-icons/io5'
import { Divider, Grid, Link, Typography } from '@mui/material'

import { APP_NAME } from '@/constants'

export const Footer = memo(() => (
	<>
		<Divider sx={{ my: 4 }} />
		<Grid container spacing={1} flexDirection="column" alignItems="center">
			<Grid item>
				<Link title="Github" href="https://github.com/ava-labs/quarkvm-js" target="_blank" color="inherit">
					<IoLogoGithub size={32} />
				</Link>
			</Grid>
			<Grid item>
				<Typography component="footer" variant="body2" sx={{ width: '100%', opacity: 0.5, py: 1 }} align="center">
					{`© ${new Date().getFullYear()} — ${APP_NAME}`}
				</Typography>
			</Grid>
		</Grid>{' '}
	</>
))
