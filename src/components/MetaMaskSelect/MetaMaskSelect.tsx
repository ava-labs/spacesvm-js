import { IoSwapVertical } from 'react-icons/io5'
import { Button, ButtonGroup, Grid, keyframes, Tooltip, Typography, useTheme } from '@mui/material'
import { useSnackbar } from 'notistack'

import { TransferFundsDialog } from '../TransferFundsDialog'

import MetaMaskFoxLogo from '@/assets/metamask-fox.svg'
import { useMetaMask } from '@/providers/MetaMaskProvider'
import { numberWithCommas } from '@/utils/numberUtils'
import { obfuscateAddress } from '@/utils/obfuscateAddress'

const growWidth = keyframes`
	0% {
		max-width: 0;
	}
	100% {
		max-width: 300px;
	}
`

export const MetaMaskSelect = () => {
	const { enqueueSnackbar } = useSnackbar()
	const theme = useTheme()
	const { currentAddress, connectToMetaMask, balance, isConnectingToMM, metaMaskExists } = useMetaMask()
	const [transferOpen, setTransferOpen] = useState(false)

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
		<>
			<Grid container sx={{ borderRadius: 99999 }}>
				<Grid item>
					<ButtonGroup>
						<Tooltip title={currentAddress ? 'Copy address' : 'Connect to MetaMask'}>
							<Button
								startIcon={<img src={MetaMaskFoxLogo} height={24} width={24} alt="Metamask Logo" />}
								variant="outlined"
								color="secondary"
								onClick={handleMetaMaskClick}
								disabled={isConnectingToMM}
								sx={{
									background: theme.customPalette.customBackground,
									'&:hover': { background: theme.customPalette.customBackground },
								}}
							>
								{currentAddress ? obfuscateAddress(currentAddress) : 'Connect'}
							</Button>
						</Tooltip>
						{metaMaskExists && (
							<Tooltip title={'Transfer SPC'}>
								<Button
									variant="outlined"
									color="secondary"
									onClick={() => setTransferOpen(true)}
									sx={{
										background: theme.customPalette.customBackground,
										'&:hover': { background: theme.customPalette.customBackground },
										animation: `800ms ${growWidth} ease`,
										animationDirection: 'forwards',
									}}
								>
									<Typography
										noWrap
										variant="h6"
										display="flex"
										lineHeight={1}
										sx={{
											mr: 1,
										}}
										style={{ fontSize: '1.1rem' }}
									>
										{balance !== null ? numberWithCommas(balance) : 0}{' '}
										<Typography
											variant="h6"
											component="span"
											lineHeight={1}
											color="textSecondary"
											sx={{ ml: 0.5 }}
											style={{ fontSize: '1.1rem' }}
										>
											SPC
										</Typography>
									</Typography>
									<IoSwapVertical size="18" color={theme.palette.primary.dark} />
								</Button>
							</Tooltip>
						)}
					</ButtonGroup>
				</Grid>
			</Grid>
			<TransferFundsDialog open={transferOpen} close={() => setTransferOpen(false)} />
		</>
	)
}
