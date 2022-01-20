import { IoLogoGithub } from 'react-icons/io5'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Box, Divider, Grid, Link, styled, Theme, Typography, useMediaQuery, useTheme } from '@mui/material'

import { WhatIsASpace } from '../WhatIsASpace'

import AvalancheLogo from '@/assets/avax-logo-official.svg'
import Logo from '@/assets/spaces-logo.png'
import { APP_NAME, CHAIN_ID_URL, SUBNET_ID_URL } from '@/constants'
import { getNetworks } from '@/utils/spacesVM'

const StyledImg = styled('img')(({ theme }: { theme: Theme }) => ({
	filter: theme.palette.mode === 'dark' ? 'invert(0)' : 'invert(1)',
}))

export const Footer = memo(() => {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

	const [quarkNetworks, setQuarkNetworks] = useState<{
		chainId: string
		subnetId: string
		networkId: string
	}>()

	useEffect(() => {
		const fetchNetworks = async () => {
			const networks = await getNetworks()
			setQuarkNetworks(networks)
		}

		fetchNetworks()
	}, [])

	return (
		<Box pb={isMobile ? 6 : 4}>
			<Divider sx={{ my: 4 }} />
			<Grid container spacing={2}>
				<Grid item container direction="column" alignItems="flex-end" xs={6}>
					<Grid item>
						<ReactRouterLink
							to="/"
							style={{
								textDecoration: 'none',
								display: 'flex',
								alignItems: 'center',
							}}
						>
							<img src={Logo} width={isMobile ? 24 : 32} height={isMobile ? 24 : 32} alt={`${APP_NAME} Logo`} />
							<Typography
								variant="h4"
								component="div"
								color="textPrimary"
								sx={{ fontFamily: 'DM Serif Display', ml: 2, letterSpacing: 6 }}
							>
								{APP_NAME}
							</Typography>
						</ReactRouterLink>
					</Grid>
					<Grid item>
						<Typography component="footer" variant="body2" sx={{ width: '100%', opacity: 0.5, py: 1 }} align="right">
							{`© ${new Date().getFullYear()} ${APP_NAME}`}
						</Typography>
					</Grid>
					<Grid item>
						<Typography component="footer" variant="body2" sx={{ width: '100%', opacity: 0.5, py: 1 }} align="right">
							<Link color="inherit" href="https://spacesvm.xyz/" rel="noopener noreferrer" target="_blank">
								Powered by the SpacesVM Avalanche Subnet
							</Link>
						</Typography>
					</Grid>
					<Grid item>
						<Typography component="footer" variant="body2" sx={{ width: '100%', opacity: 0.5, py: 1 }} align="right">
							<Link color="inherit" href="https://dribbble.com/dmitrymoi/" rel="noopener noreferrer" target="_blank">
								Illustrations by Dmitry Moiseenko
							</Link>
						</Typography>
					</Grid>
				</Grid>
				<Grid item>
					<Divider orientation="vertical" />
				</Grid>
				<Grid item>
					<Grid container direction="column" justifyContent="center" spacing={1}>
						<Grid item>
							<Typography component="footer" variant="body2" color="textSecondary">
								<WhatIsASpace isFooter />
							</Typography>
						</Grid>
						{quarkNetworks && (
							<>
								<Grid item>
									<Typography component="footer" variant="body2" color="textSecondary">
										See us on Avascan! Our <Link href={`${CHAIN_ID_URL}${quarkNetworks.chainId}`}>chain</Link> and our{' '}
										<Link href={`${SUBNET_ID_URL}${quarkNetworks.subnetId}`}>subnet</Link>.
									</Typography>
								</Grid>
								<Grid item>
									<Typography component="footer" variant="body2" color="textSecondary">
										Contribute to <Link href={`${CHAIN_ID_URL}${quarkNetworks.chainId}`}>SpacesVM</Link> or{' '}
										<Link href={`${SUBNET_ID_URL}${quarkNetworks.subnetId}`}>SpacesVM-JS</Link>
									</Typography>
								</Grid>
							</>
						)}
						<Grid item container alignItems="center" sx={{ mt: 0.5 }}>
							<Link
								title="Avalanche"
								href="https://www.avax.network/"
								rel="noopener noreferrer"
								target="_blank"
								color="inherit"
							>
								<StyledImg src={AvalancheLogo} alt="Avalanche logo" width={28} height={28} />
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
					</Grid>
				</Grid>
			</Grid>
		</Box>
	)
})
