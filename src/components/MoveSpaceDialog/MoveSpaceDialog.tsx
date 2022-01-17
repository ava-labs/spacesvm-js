import { Twemoji } from 'react-emoji-render'
import { useParams } from 'react-router-dom'
import {
	Box,
	Dialog,
	DialogContent,
	DialogTitle,
	Fade,
	Table,
	TableBody,
	TableCell,
	TableRow,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material'

import { AddressChip } from '../AddressChip/AddressChip'
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

	const [isSigning, setIsSigning] = useState(false)
	const [isDone, setIsDone] = useState(false)

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
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(error)
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
			<Dialog maxWidth="sm" open={open && !isDone} onClose={handleClose}>
				<DialogTitle>
					<Typography
						gutterBottom
						variant="h3"
						component="p"
						fontFamily="DM Serif Display"
						align="center"
						sx={{ position: 'relative' }}
					>
						Move Space
					</Typography>
				</DialogTitle>
				<DialogContent>
					<Table>
						<TableBody>
							<TableRow>
								<TableCell align="right">From:</TableCell>
								<TableCell>
									<AddressChip sx={{ ml: -1 }} address={currentAddress} tooltipPlacement="top" />
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
										error={!!addressInputError}
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
					<Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
						<Tooltip placement="top" title={'test'}>
							<Box>
								<SubmitButton
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
										<span>
											<Twemoji svg text="📦" />
											Move&nbsp;
										</span>
									)}
								</SubmitButton>
							</Box>
						</Tooltip>
					</Box>
				</DialogContent>
			</Dialog>
			<MoveSpaceSuccessDialog open={open && isDone} onClose={handleClose} />
		</>
	)
}
