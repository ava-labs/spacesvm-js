import { IoLogoGithub } from 'react-icons/io5'
import { Box, Divider, Grid, Link, styled, Theme, Typography } from '@mui/material'

import AvalancheLogo from '@/assets/avax-logo-official.svg'
import { APP_NAME, CHAIN_ID_URL, SUBNET_ID_URL } from '@/constants'
import { getNetworks } from '@/utils/spacesVM'

const StyledImg = styled('img')(({ theme }: { theme: Theme }) => ({
	filter: theme.palette.mode === 'dark' ? 'invert(0)' : 'invert(1)',
}))

export const Footer = memo(() => {
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
				{quarkNetworks && (
					<Grid item container spacing={2} alignItems="center" justifyContent="center">
						<Grid item>
							<Link
								sx={{ fontSize: 14 }}
								href={`${SUBNET_ID_URL}${quarkNetworks.subnetId}`}
								rel="noopener noreferrer"
								target="_blank"
							>
								Subnet ID
							</Link>
						</Grid>
						<Grid item>
							<Link
								sx={{ fontSize: 14 }}
								href={`${CHAIN_ID_URL}${quarkNetworks.chainId}`}
								rel="noopener noreferrer"
								target="_blank"
							>
								Chain ID
							</Link>
						</Grid>
					</Grid>
				)}
			</Grid>
		</Box>
	)
})
