import { Button, Fade, Grid, Tooltip, Typography, useTheme } from '@mui/material'
import { useSnackbar } from 'notistack'

import MetaMaskFoxLogo from '@/assets/metamask-fox.svg'
import { useMetaMask } from '@/providers/MetaMaskProvider'

const obfuscateAddress = (str: string): string => {
	const firstChars = str.substr(0, 5)
	const lastChars = str.substr(-4)
	return `${firstChars}...${lastChars}`
}

export const MetaMaskSelect = () => {
	const { enqueueSnackbar } = useSnackbar()
	const theme = useTheme()

	const { currentAddress, connectToMetaMask, balance } = useMetaMask()

	const handleMetaMaskClick = () => {
		if (!currentAddress) {
			connectToMetaMask()
			return
		}
		setClipboard()
	}

	const setClipboard = async () => {
		const type = 'text/plain'
		const blob = new Blob([currentAddress], { type })
		const data = [new ClipboardItem({ [type]: blob })]

		navigator.clipboard.write(data).then(
			() => {
				enqueueSnackbar('MetaMask address copied!')
			},
			() => {
				enqueueSnackbar("Can't copy!", { variant: 'error' })
			},
		)
	}

	return (
		<Grid
			container
			sx={{
				backgroundColor: 'hsla(0,0%,100%,0.05)',
				borderRadius: 99999,
			}}
		>
			<Grid item>
				<Tooltip title={currentAddress ? 'Copy address' : 'Connect to MetaMask'}>
					<Button
						startIcon={<img src={MetaMaskFoxLogo} height={24} width={24} alt="Metamask Logo" />}
						variant="outlined"
						color="secondary"
						onClick={handleMetaMaskClick}
						sx={{
							background: theme.customPalette.customBackground,
							'&:hover': { background: theme.customPalette.customBackground },
						}}
					>
						{currentAddress ? obfuscateAddress(currentAddress) : 'Connect'}
					</Button>
				</Tooltip>
			</Grid>
			<Grid
				item
				sx={{
					transitionProperty: 'width, padding',
					transitionDuration: '0.2s',
					mx: balance ? 2 : 0,
					width: balance ? 120 : 0,
				}}
			>
				<Fade in={!!balance}>
					<Typography
						noWrap
						variant="h6"
						align="center"
						style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
					>
						{balance?.toFixed(2)}
						<Typography component="span" color="textSecondary" sx={{ ml: 1 }}>
							SPC
						</Typography>
					</Typography>
				</Fade>
			</Grid>
		</Grid>
	)
}
