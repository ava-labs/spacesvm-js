import { Twemoji } from 'react-emoji-render'
import { useParams } from 'react-router-dom'
import {
	Box,
	Dialog,
	DialogContent,
	Fade,
	Table,
	TableBody,
	TableCell,
	TableRow,
	TextField,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material'
import capitalize from 'lodash/capitalize'
import { useSnackbar } from 'notistack'

import { AddressChip } from '../AddressChip/AddressChip'
import { DialogTitle } from '../DialogTitle'
import { MoveSpaceSuccessDialog } from './MoveSpaceSuccessDialog'

import MetaMaskFoxLogo from '@/assets/metamask-fox.svg'
import { SubmitButton } from '@/pages/CustomSignature/SubmitButton'
import { useMetaMask } from '@/providers/MetaMaskProvider'
import { TxType } from '@/types'
import { getSuggestedFee } from '@/utils/spacesVM'
import { isValidWalletAddress } from '@/utils/verifyAddress'

type MoveSpaceDialogProps = {
	open: boolean
	onClose(): void
	refreshSpaceDetails(): void
}

export const MoveSpaceDialog = ({ open, onClose, refreshSpaceDetails }: MoveSpaceDialogProps) => {
	const { spaceId } = useParams()
	const { currentAddress, signWithMetaMask, issueTx } = useMetaMask()
	const [toAddress, setToAddress] = useState<string>('')
	const [addressInputError, setAddressInputError] = useState<string | undefined>()
	const { enqueueSnackbar } = useSnackbar()
	const [isSigning, setIsSigning] = useState<boolean>(false)
	const [isDone, setIsDone] = useState<boolean>(false)
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

	const onSubmit = async () => {
		setIsSigning(true)
		try {
			const { typedData } = await getSuggestedFee({
				type: TxType.Move,
				to: toAddress,
				space: spaceId,
			})
			const signature = await signWithMetaMask(typedData)
			if (!signature) {
				setIsSigning(false)
				return
			}
			const success = await issueTx(typedData, signature)
			setIsSigning(false)
			if (!success) {
				// show some sort of failure dialog
				return
			}
			setIsDone(true)
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error)
			enqueueSnackbar(capitalize(error?.message), {
				variant: 'error',
			})
			setIsSigning(false)
		}
		refreshSpaceDetails()
	}

	useEffect(() => {
		const isValidToAddress = isValidWalletAddress(toAddress)
		setAddressInputError(
			!isValidToAddress && toAddress?.length !== 0 ? 'Please enter a valid public wallet address.' : undefined,
		)
	}, [toAddress])

	const handleClose = () => {
		setToAddress('')
		setAddressInputError(undefined)
		setIsDone(false)
		onClose()
	}

	return (
		<>
			<Dialog fullScreen={isMobile} maxWidth="sm" open={open && !isDone} onClose={handleClose}>
				<DialogTitle onClose={handleClose}>
					<Typography gutterBottom variant="h3" component="p" fontFamily="DM Serif Display" align="center">
						Move space
					</Typography>
					<Typography color="textSecondary" align="center" variant="body2" gutterBottom>
						You can move this space to a different wallet.
					</Typography>
				</DialogTitle>
				<DialogContent>
					<Table>
						<TableBody>
							<TableRow>
								<TableCell align="right" sx={{ width: 0 }}>
									From:
								</TableCell>
								<TableCell>
									<AddressChip address={currentAddress} isObfuscated={false} tooltipPlacement="top" />
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell align="right" sx={{ borderBottomWidth: 0, width: 0 }}>
									To:
								</TableCell>
								<TableCell sx={{ borderBottomWidth: 0 }}>
									<TextField
										color="secondary"
										variant="filled"
										value={toAddress}
										autoFocus
										size="small"
										name="keyText"
										error={!!addressInputError}
										onChange={(e) => setToAddress(e.target.value)}
										placeholder="0x address"
										fullWidth
										InputProps={{
											sx: { fontSize: 18, fontWeight: 600, paddingBottom: '2px' },
										}}
										inputProps={{
											spellCheck: 'false',
											style: { paddingTop: 8 },
										}}
										autoComplete="off"
									/>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
					<Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
						<SubmitButton
							endIcon={<Twemoji svg text="📦" />}
							disabled={!!addressInputError || !toAddress?.length || isSigning || isDone}
							variant="contained"
							type="submit"
							onClick={onSubmit}
						>
							{isSigning ? (
								<Fade in={isSigning}>
									<img src={MetaMaskFoxLogo} alt="metamask-fox" style={{ height: '100%' }} />
								</Fade>
							) : (
								'Move'
							)}
						</SubmitButton>
					</Box>
				</DialogContent>
			</Dialog>
			<MoveSpaceSuccessDialog open={open && isDone} onClose={handleClose} />
		</>
	)
}
