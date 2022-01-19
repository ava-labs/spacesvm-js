import { IoLogoGithub, IoOpenOutline } from 'react-icons/io5'
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

import AvalancheLogo from '@/assets/avax-logo-official.svg'
import { APP_NAME, CHAIN_ID_URL, SUBNET_ID_URL } from '@/constants'
import { obfuscateAddress } from '@/utils/obfuscateAddress'
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
		<Box pb={2}>
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
				{quarkNetworks && (
					<>
						<Grid item container sx={{ borderRadius: 99999 }} alignItems="center" justifyContent="center">
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
										{isMobile ? obfuscateAddress(quarkNetworks.subnetId) : quarkNetworks.subnetId}
									</Button>
								</ButtonGroup>
							</Grid>
						</Grid>
						<Grid item container sx={{ borderRadius: 99999 }} alignItems="center" justifyContent="center">
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
										{isMobile ? obfuscateAddress(quarkNetworks.chainId) : quarkNetworks.chainId}
									</Button>
								</ButtonGroup>
							</Grid>
						</Grid>
					</>
				)}
				<Grid item>
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
				</Grid>
			</Grid>
		</Box>
	)
})
