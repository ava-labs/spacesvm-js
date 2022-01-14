import { IoLogoGithub } from 'react-icons/io5'
import { Box, Divider, Grid, Link, Typography } from '@mui/material'

import { APP_NAME } from '@/constants'

export const Footer = memo(() => (
	<Box mb={2}>
		<Divider sx={{ my: 4 }} />
		<Grid container spacing={1} flexDirection="column" alignItems="center">
			<Grid item>
				<Link
					title="Github"
					href="https://github.com/ava-labs/spacesvm-js"
					rel="noopener noreferrer"
					target="_blank"
					color="inherit"
				>
					<IoLogoGithub size={32} />
				</Link>
			</Grid>
			<Grid item>
				<Typography component="footer" variant="body2" sx={{ width: '100%', opacity: 0.5, py: 1 }} align="center">
					{`© ${new Date().getFullYear()} ${APP_NAME} — `}
					<Link color="inherit" href="https://www.avax.network/" rel="noopener noreferrer" target="_blank">
						Built with Avalanche
					</Link>
				</Typography>
			</Grid>
		</Grid>
	</Box>
))
