import { memo } from 'react'
import { Link } from 'react-router-dom'
import { AppBar as MuiAppBar, Box, Button, Container, Grid, Toolbar, Tooltip, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'

import Logo from '@/assets/favicon.png'
import MetaMaskFoxLogo from '@/assets/metamask-fox.svg'
import { APP_NAME } from '@/constants'

type AppBarProps = {
	walletAddress?: string
}

const obfuscateAddress = (str: string): string => {
	const firstChars = str.substr(0, 5)
	const lastChars = str.substr(-4)
	return `${firstChars}...${lastChars}`
}

export const AppBar = memo(({ walletAddress }: AppBarProps) => {
	const { enqueueSnackbar } = useSnackbar()

	const setClipboard = async (text: string) => {
		const type = 'text/plain'
		const blob = new Blob([text], { type })
		const data = [new ClipboardItem({ [type]: blob })]

		navigator.clipboard.write(data).then(
			() => {
				enqueueSnackbar('Address copied!')
			},
			() => {
				enqueueSnackbar("Can't copy!", { variant: 'error' })
			},
		)
	}

	return (
		<Box sx={{ flexGrow: 1 }}>
			<MuiAppBar
				position="fixed"
				elevation={0}
				color="transparent"
				sx={{
					backdropFilter: 'blur(5px)',
					// for scrollbar not to be blurry
					mx: '10px',
					width: 'calc(100% - 20px)',
				}}
			>
				<Toolbar>
					<Container maxWidth="xl" disableGutters>
						<Grid container alignItems="center" justifyContent="space-between">
							<Grid item>
								<Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
									<img src={Logo} width={32} height={32} alt={`${APP_NAME} Logo`} />
									<Typography
										variant="h4"
										component="div"
										color="textPrimary"
										sx={{ fontFamily: 'DM Serif Display', ml: 1 }}
									>
										{APP_NAME}
									</Typography>
								</Link>
							</Grid>
							{walletAddress && (
								<Grid item>
									<Tooltip title="Copy address">
										<Button
											startIcon={<img src={MetaMaskFoxLogo} height={24} width={24} alt="Metamask Logo" />}
											variant="outlined"
											color="secondary"
											onClick={async () => {
												await setClipboard(walletAddress)
											}}
										>
											{obfuscateAddress(walletAddress)}
										</Button>
									</Tooltip>
								</Grid>
							)}
						</Grid>
					</Container>
				</Toolbar>
			</MuiAppBar>
		</Box>
	)
})
