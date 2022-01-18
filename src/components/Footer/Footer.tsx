import { IoLogoGithub } from 'react-icons/io5'
import { Box, Divider, Grid, Link, styled, Theme, Typography } from '@mui/material'

import AvalancheLogo from '@/assets/AVAXLogoOfficial.svg'
import { APP_NAME } from '@/constants'

const StyledImg = styled('img')(({ theme }: { theme: Theme }) => ({
	filter: theme.palette.mode === 'dark' ? 'invert(0)' : 'invert(1)',
}))

export const Footer = memo(() => (
	<Box mb={2}>
		<Divider sx={{ my: 4 }} />
		<Grid container spacing={1} flexDirection="column" alignItems="center">
			<Grid item container alignItems="center" justifyContent="center">
				<Link
					title="Avalanche"
					href="https://www.avax.network/"
					rel="noopener noreferrer"
					target="_blank"
					color="inherit"
				>
					<StyledImg src={AvalancheLogo} alt="avalanche-logo" width={28} />
				</Link>
				<Link
					title="Github"
					href="https://github.com/ava-labs/spacesvm-js"
					rel="noopener noreferrer"
					target="_blank"
					color="inherit"
					sx={{ ml: 3 }}
				>
					<IoLogoGithub size={32} />
				</Link>
			</Grid>
			<Grid item>
				<Typography component="footer" variant="body2" sx={{ width: '100%', opacity: 0.5, py: 1 }} align="center">
					{`© ${new Date().getFullYear()} ${APP_NAME} — `}
					<Link color="inherit" href="https://spacesvm.xyz/" rel="noopener noreferrer" target="_blank">
						Powered by the SpacesVM Avalanche Subnet
					</Link>
				</Typography>
			</Grid>
		</Grid>
	</Box>
))
