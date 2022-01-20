import { AiOutlineRedo } from 'react-icons/ai'
import { IoSwapVertical } from 'react-icons/io5'
import {
	Button,
	ButtonGroup,
	Grid,
	IconButton,
	keyframes,
	Theme,
	Tooltip,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material'
import { useSnackbar } from 'notistack'

import MetaMaskFoxLogo from '@/assets/metamask-fox.svg'
import { TransferFundsDialog } from '@/components/TransferFundsDialog'
import { useMetaMask } from '@/providers/MetaMaskProvider'
import { numberWithCommas } from '@/utils/numberUtils'
import { obfuscateAddress } from '@/utils/obfuscateAddress'
import { setClipboard } from '@/utils/setClipboard'

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
	const {
		currentAddress,
		connectToMetaMask,
		balance,
		isConnectingToMM,
		metaMaskExists,
		isConnectedToSpaces,
		checkSpacesConnection,
	} = useMetaMask()
	const [transferOpen, setTransferOpen] = useState<boolean>(false)
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

	const handleMetaMaskClick = () => {
		if (!currentAddress) {
			connectToMetaMask()
			return
		}
		onCopy()
	}

	const onCopy = async () => {
		await setClipboard({
			value: currentAddress,
			onSuccess: () => enqueueSnackbar('MetaMask address copied!'),
			onFailure: () => enqueueSnackbar("Can't copy!", { variant: 'error' }),
		})
	}

	const mobileStyles = {
		position: 'fixed',
		bottom: 0,
		paddingTop: 1,
		paddingBottom: 1,
		borderRadius: 0,
		display: metaMaskExists && isConnectedToSpaces ? 'flex' : 'none',
		backgroundColor: (theme: Theme) => theme.customPalette.customBackground,
		borderTop: (theme: Theme) => `1px solid ${theme.palette.divider}`,
	}

	return (
		<>
			<Grid
				container
				// @ts-ignore
				sx={{ ...(isMobile && { ...mobileStyles }) }}
				justifyContent={'center'}
			>
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

						{metaMaskExists && isConnectedToSpaces && (
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
									<IoSwapVertical size="18" color={theme.palette.primary.light} />
								</Button>
							</Tooltip>
						)}
						{!isConnectedToSpaces && (
							<Tooltip title={'Retry connection to Spaces VM'}>
								<Button
									startIcon={<AiOutlineRedo />}
									variant="outlined"
									color="secondary"
									onClick={checkSpacesConnection}
									sx={{
										color: theme.palette.primary.main,
										background: theme.customPalette.customBackground,
										'&:hover': { background: theme.customPalette.customBackground },
									}}
								>
									Connection failed
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
