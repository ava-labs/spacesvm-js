import { IoLogoGithub, IoOpenOutline } from 'react-icons/io5'
import { Link as ReactRouterLink } from 'react-router-dom'
import {
	Box,
	Button,
	ButtonGroup,
	Divider,
	Grid,
	Link,
	styled,
	Theme,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material'

import { WhatIsASpace } from '../WhatIsASpace'

import AvalancheLogo from '@/assets/avax-logo-official.svg'
import Logo from '@/assets/spaces-logo.png'
import { APP_NAME, CHAIN_ID_URL, SUBNET_ID_URL } from '@/constants'
import { obfuscateAddress } from '@/utils/obfuscateAddress'
import { getNetworks } from '@/utils/spacesVM'

const StyledImg = styled('img')(({ theme }: { theme: Theme }) => ({
	filter: theme.palette.mode === 'dark' ? 'invert(0)' : 'invert(1)',
}))

export const Footer = memo(() => {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const truncateChainAndSubnet = useMediaQuery(theme.breakpoints.down('lg'))

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
		<Box pb={isMobile ? 12 : 4}>
			<Divider sx={{ my: 4 }} />
			<Grid container spacing={2}>
				<Grid item container direction="column" alignItems={isMobile ? 'center' : 'flex-end'} sm={5} xs={12}>
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
				{!isMobile && (
					<Grid item>
						<Divider orientation="vertical" />
					</Grid>
				)}
				<Grid item sm={5} xs={12}>
					<Grid
						container
						direction="column"
						justifyContent="center"
						alignItems={isMobile ? 'center' : 'inherit'}
						spacing={1}
					>
						<Grid
							item
							container
							alignItems="center"
							justifyContent={isMobile ? 'center' : 'flex-start'}
							sx={{ mt: 0.5 }}
							columnSpacing={2}
						>
							<Grid item>
								<Link
									title="Avalanche"
									href="https://www.avax.network/"
									rel="noopener noreferrer"
									target="_blank"
									color="inherit"
								>
									<StyledImg src={AvalancheLogo} alt="Avalanche logo" width={28} height={28} />
								</Link>
							</Grid>
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
								<WhatIsASpace isFooter />
							</Grid>
						</Grid>
						{quarkNetworks && (
							<>
								<Grid item sx={{ mt: { xs: 1, sm: 0 } }}>
									<ButtonGroup>
										<Button
											variant="outlined"
											color="secondary"
											disabled
											sx={{
												color: (theme) => `${theme.palette.text.primary}!important`,
												background: (theme) => theme.customPalette.customBackground,
												'&:hover': { background: (theme) => theme.customPalette.customBackground },
											}}
										>
											Subnet ID
										</Button>

										<Button
											variant="outlined"
											color="secondary"
											endIcon={<IoOpenOutline size={14} />}
											onClick={() => window.open(`${SUBNET_ID_URL}${quarkNetworks.subnetId}`)}
											sx={{
												background: (theme) => theme.customPalette.customBackground,
												'&:hover': { background: (theme) => theme.customPalette.customBackground },
											}}
										>
											{truncateChainAndSubnet ? obfuscateAddress(quarkNetworks.subnetId) : quarkNetworks.subnetId}
										</Button>
									</ButtonGroup>
								</Grid>
								<Grid item>
									<ButtonGroup>
										<Button
											variant="outlined"
											color="secondary"
											disabled
											sx={{
												color: (theme) => `${theme.palette.text.primary}!important`,
												background: (theme) => theme.customPalette.customBackground,
												'&:hover': { background: (theme) => theme.customPalette.customBackground },
											}}
										>
											Chain ID
										</Button>

										<Button
											variant="outlined"
											color="secondary"
											endIcon={<IoOpenOutline size={14} />}
											onClick={() => window.open(`${CHAIN_ID_URL}${quarkNetworks.chainId}`)}
											sx={{
												background: (theme) => theme.customPalette.customBackground,
												'&:hover': { background: (theme) => theme.customPalette.customBackground },
											}}
										>
											{truncateChainAndSubnet ? obfuscateAddress(quarkNetworks.chainId) : quarkNetworks.chainId}
										</Button>
									</ButtonGroup>
								</Grid>
							</>
						)}
					</Grid>
				</Grid>
			</Grid>
		</Box>
	)
})
{
	/* <Grid item>
					<Typography component="footer" variant="body2" sx={{ width: '100%', opacity: 0.5, py: 1 }} align="center">
						{`© ${new Date().getFullYear()} ${APP_NAME} — `}
						<Link color="inherit" href="https://spacesvm.xyz/" rel="noopener noreferrer" target="_blank">
							Powered by the SpacesVM Avalanche Subnet
						</Link>
						{` — `}
						<Link color="inherit" href="https://dribbble.com/dmitrymoi/" rel="noopener noreferrer" target="_blank">
							Illustrations by Dmitry Moiseenko
						</Link>
					</Typography>
				</Grid> */
}
