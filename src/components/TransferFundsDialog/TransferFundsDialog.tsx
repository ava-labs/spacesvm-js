import { Twemoji } from 'react-emoji-render'
import { IoAdd, IoRemove } from 'react-icons/io5'
import {
	Box,
	Button,
	Chip,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	Fade,
	Grid,
	IconButton,
	styled,
	Table,
	TableBody,
	TableCell,
	TableRow,
	TextField,
	Tooltip,
	Typography,
	useTheme,
} from '@mui/material'

import { TransferFundsSuccessDialog } from './TransferFundsSuccessDialog'

import MetaMaskFoxLogo from '@/assets/metamask-fox.svg'
import { useMetaMask } from '@/providers/MetaMaskProvider'
import { rainbowText } from '@/theming/rainbowText'
import { TxType } from '@/types'
import { obfuscateAddress } from '@/utils/obfuscateAddress'
import { getSuggestedFee } from '@/utils/spacesVM'

type TransferFundsDialogProps = {
	open: boolean
	close(): void
}

const SubmitButton = styled(Button)(({ theme }: any) => ({
	backgroundColor: '#523df1',
	padding: theme.spacing(1, 10),
	height: 60,
	minWidth: 320,
	fontWeight: 900,
	fontSize: 24,
	position: 'relative',
	boxShadow: '0 0 40px rgb(82 61 241 / 60%)',
	'&:hover': {
		backgroundColor: '#7a68ff',
		boxShadow: '0 0 40px rgb(82 61 241 / 80%)',
	},
	'&.Mui-disabled': {
		backgroundColor: theme.palette.mode === 'dark' ? 'hsla(0,0%,100%,0.1)' : 'hsla(0,0%,0%,0.1)',
	},
}))

const MAX_TRANSFER_AMOUNT = 100000000

export const TransferFundsDialog = ({ open, close }: TransferFundsDialogProps) => {
	const { currentAddress, signWithMetaMask, issueTx } = useMetaMask()
	const theme = useTheme()

	const [toAddress, setToAddress] = useState('')
	const [transferAmount, setTransferAmount] = useState(0)
	const [isSigning, setIsSigning] = useState(false)
	const [fee, setFee] = useState(0)
	const [isDone, setIsDone] = useState(false)

	if (!currentAddress) return null

	//0x08380a9cd3a5034036b44c18ab40fce3ad1c13ba
	const onSubmit = async () => {
		setIsSigning(true)
		try {
			const { typedData } = await getSuggestedFee({
				type: TxType.Transfer,
				to: toAddress,
				units: transferAmount,
			})
		} catch (error) {
			console.error(error)
			setIsSigning(false)
		}
		const signature = await signWithMetaMask(typedData)
		setIsSigning(false)
		if (!signature) return
		const success = await issueTx(typedData, signature)
		if (!success) {
			// show some sort of failure dialog
			return
		}
		setIsDone(true)
	}

	const isValidToAddress = toAddress?.length > 0

	const handleClose = () => {
		setToAddress('')
		setTransferAmount(0)
		setIsDone(false)
		close()
	}

	return (
		<>
			<Dialog maxWidth="sm" open={open && !isDone} onClose={handleClose}>
				<DialogTitle>
					<Typography
						gutterBottom
						variant="h5"
						component="p"
						fontFamily="DM Serif Display"
						align="center"
						sx={{ position: 'relative' }}
					>
						Share the love!
					</Typography>
					<Typography
						gutterBottom
						variant="h5"
						component="p"
						fontFamily="DM Serif Display"
						align="center"
						sx={{ position: 'relative' }}
					>
						Send SPC to a friend&nbsp;
						<span style={{ fontSize: 36 }}>
							<Twemoji svg text="🙂" />
						</span>
					</Typography>
				</DialogTitle>
				<DialogContent>
					<Table sx={{ mt: 2 }}>
						<TableBody>
							<TableRow>
								<TableCell align="right">From:</TableCell>
								<TableCell>
									<Tooltip placement="top" title={currentAddress}>
										<Chip sx={{ ml: -1, cursor: 'help' }} label={obfuscateAddress(currentAddress)} />
									</Tooltip>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell align="right" sx={{ borderBottomWidth: 0 }}>
									To:
								</TableCell>
								<TableCell sx={{ borderBottomWidth: 0 }}>
									<TextField
										color="secondary"
										variant="filled"
										value={toAddress}
										name="keyText"
										onChange={(e) => setToAddress(e.target.value)}
										placeholder="Address"
										fullWidth
										InputProps={{
											sx: { fontSize: 18, fontWeight: 600 },
										}}
										inputProps={{
											spellCheck: 'false',
										}}
										autoComplete="new-password"
									/>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>

					<Typography variant="body2" align="center" color="textSecondary" sx={{ mt: 2, mb: 1 }}>
						How much do you to send?
					</Typography>

					<Box display="flex" alignItems="center" justifyContent="center">
						<TextField
							color="secondary"
							value={transferAmount}
							name="keyText"
							onChange={(e) => {
								const val = parseInt(e.target.value, 10)
								setTransferAmount(Math.min(!isNaN(val) ? val : 0, MAX_TRANSFER_AMOUNT))
							}}
							placeholder="Address"
							InputProps={{
								sx: { ...theme.typography.h2, ...rainbowText },
							}}
							inputProps={{
								spellCheck: 'false',
								style: {
									textAlign: 'right',
								},
							}}
						/>

						<Divider flexItem orientation="vertical" sx={{ mr: 2 }} />

						<Typography variant="h4" component="span" color="textSecondary" sx={{ width: 100 }}>
							SPC
						</Typography>
					</Box>

					<Grid container wrap="nowrap" justifyContent={'center'} alignItems="center" sx={{ my: 2 }} columnSpacing={3}>
						<Grid item>
							<Button
								color="secondary"
								size="small"
								variant="outlined"
								startIcon={<IoRemove />}
								disabled={transferAmount <= 0}
								onClick={() => setTransferAmount(Math.max(transferAmount - 1000, 0))}
							>
								1000
							</Button>
						</Grid>
						<Grid item>
							<Button
								color="secondary"
								size="small"
								variant="outlined"
								startIcon={<IoRemove />}
								disabled={transferAmount <= 0}
								onClick={() => setTransferAmount(Math.max(transferAmount - 100, 0))}
							>
								100
							</Button>
						</Grid>
						<Grid item>
							<IconButton
								sx={{
									border: `1px solid rgba(82, 61, 241, 0.5)`,
									'&:hover': {
										border: (theme) => `1px solid ${theme.palette.secondary.main}`,
									},
									'&.Mui-disabled': {
										border: (theme) => `1px solid ${theme.palette.action.disabled}`,
									},
								}}
								color="inherit"
								size="large"
								disabled={transferAmount <= 0}
								onClick={() => setTransferAmount(Math.max(transferAmount - 1, 0))}
							>
								<IoRemove />
							</IconButton>
						</Grid>
						<Grid item>
							<IconButton
								sx={{
									border: `1px solid rgba(82, 61, 241, 0.5)`,
									'&:hover': {
										border: (theme) => `1px solid ${theme.palette.secondary.main}`,
									},
									'&.Mui-disabled': {
										border: (theme) => `1px solid ${theme.palette.action.disabled}`,
									},
								}}
								size="large"
								color="inherit"
								disabled={transferAmount >= MAX_TRANSFER_AMOUNT}
								onClick={() => setTransferAmount(Math.min(transferAmount + 1, MAX_TRANSFER_AMOUNT))}
							>
								<IoAdd />
							</IconButton>
						</Grid>
						<Grid item>
							<Button
								variant="outlined"
								size="small"
								startIcon={<IoAdd />}
								color="secondary"
								disabled={transferAmount >= MAX_TRANSFER_AMOUNT}
								onClick={() => setTransferAmount(Math.min(transferAmount + 100, MAX_TRANSFER_AMOUNT))}
							>
								100
							</Button>
						</Grid>
						<Grid item>
							<Button
								variant="outlined"
								size="small"
								startIcon={<IoAdd />}
								color="secondary"
								disabled={transferAmount >= MAX_TRANSFER_AMOUNT}
								onClick={() => setTransferAmount(Math.min(transferAmount + 1000, MAX_TRANSFER_AMOUNT))}
							>
								1000
							</Button>
						</Grid>
					</Grid>
					<Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
						<Tooltip
							placement="top"
							title={!isValidToAddress ? 'Enter a valid address!' : transferAmount <= 0 ? 'Add some SPC to send!' : ''}
						>
							<Box sx={{ cursor: !isValidToAddress || transferAmount <= 0 ? 'help' : 'inherit' }}>
								<SubmitButton
									disabled={!isValidToAddress || transferAmount <= 0 || isSigning || isDone}
									variant="contained"
									type="submit"
									onClick={onSubmit}
								>
									{isSigning ? (
										<Fade in={isSigning}>
											<img src={MetaMaskFoxLogo} alt="metamask-fox" style={{ height: '100%' }} />
										</Fade>
									) : (
										<span>
											Send&nbsp;
											<Twemoji svg text="✈️" />
										</span>
									)}
								</SubmitButton>
							</Box>
						</Tooltip>
					</Box>
					<Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
						<Typography variant="caption">Cost: {fee} SPC</Typography>
					</Box>
				</DialogContent>
			</Dialog>
			<TransferFundsSuccessDialog open={open && isDone} onClose={handleClose} />
		</>
	)
}
