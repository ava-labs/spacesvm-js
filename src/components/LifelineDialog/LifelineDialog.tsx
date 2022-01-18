import { Twemoji } from 'react-emoji-render'
import { IoAdd, IoRemove } from 'react-icons/io5'
import { useParams } from 'react-router-dom'
import {
	Box,
	Button,
	Dialog,
	DialogContent,
	Divider,
	Fade,
	Grid,
	IconButton,
	styled,
	TextField,
	Tooltip,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material'
import { debounce } from 'lodash'

import { DialogTitle } from '../DialogTitle'
import { LifelineDoneDialog } from './LifelineDoneDialog'

import MetaMaskFoxLogo from '@/assets/metamask-fox.svg'
import { useMetaMask } from '@/providers/MetaMaskProvider'
import { rainbowText } from '@/theming/rainbowText'
import { TxType } from '@/types'
import { getSuggestedFee } from '@/utils/spacesVM'

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

type LifelineDialogProps = {
	open: boolean
	close(): void
	existingExpiry: number
	spaceUnits: number
	refreshSpaceDetails(): void
}

const checkFee = debounce(async (space, units) => getSuggestedFee({ type: TxType.Lifeline, space, units }), 2000, {
	leading: true,
	trailing: true,
})

const MAX_HOURS_EXTEND = 99999

export const LifelineDialog = ({
	open,
	close,
	existingExpiry,
	spaceUnits,
	refreshSpaceDetails,
}: LifelineDialogProps) => {
	const { spaceId } = useParams()
	const theme = useTheme()
	const { issueTx, signWithMetaMask } = useMetaMask()
	const [extendHours, setExtendHours] = useState<number>(0)
	const [fee, setFee] = useState<number>(0)
	const [isSigning, setIsSigning] = useState<boolean>(false)
	const [isDone, setIsDone] = useState<boolean>(false)
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

	// Spaces with more keys and more storage cost more units to extend per hour
	const unitsNeededToExtend = extendHours * spaceUnits

	const onSubmit = async () => {
		setIsSigning(true)
		const { typedData } = await getSuggestedFee({
			type: TxType.Lifeline,
			space: spaceId,
			units: unitsNeededToExtend,
		})
		const signature = await signWithMetaMask(typedData)
		setIsSigning(false)
		if (!signature) return
		const success = await issueTx(typedData, signature)
		if (!success) {
			// show some sort of failure dialog
			return
		}
		setIsDone(true)
		refreshSpaceDetails()
	}

	const extendToDateDisplay = useMemo(() => {
		const now = new Date(existingExpiry * 1000)
		now.setHours(now.getHours() + extendHours)
		return now.toLocaleString()
	}, [extendHours, existingExpiry])

	useEffect(() => {
		const _checkFee = async () => {
			const { totalCost } = await checkFee(spaceId, unitsNeededToExtend)
			setFee(totalCost)
		}
		_checkFee()
	}, [unitsNeededToExtend, spaceId, open])

	const handleClose = () => {
		setIsDone(false)
		setExtendHours(0)
		close()
	}

	return (
		<>
			<Dialog fullScreen={isMobile} open={open && !isDone} onClose={handleClose} maxWidth="sm">
				<DialogTitle onClose={handleClose}>
					<Typography variant="h4" component="p" fontFamily="DM Serif Display" align="center">
						Extend some life to{' '}
						<Typography
							variant="h4"
							fontFamily="DM Serif Display"
							component="span"
							sx={{
								...rainbowText,
							}}
						>
							{spaceId}
						</Typography>{' '}
						before it expires!&nbsp;
						<Twemoji svg text="⌛️" />
					</Typography>
				</DialogTitle>
				<DialogContent sx={{ overflowY: 'hidden', px: 0 }}>
					<Typography variant="body2" align="center" color="textSecondary" sx={{ mt: 2, mb: 1 }}>
						Extend by
					</Typography>

					<Tooltip sx={{ cursor: 'help' }} placement="top" title={`Extend to ${extendToDateDisplay}`}>
						<Box display="flex" alignItems="center" justifyContent="center">
							<TextField
								color="secondary"
								value={extendHours}
								name="keyText"
								onChange={(e) => {
									const val = parseInt(e.target.value, 10)
									setExtendHours(Math.min(!isNaN(val) ? val : 0, MAX_HOURS_EXTEND))
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
								sx={{
									width: 300,
								}}
								autoComplete="off"
							/>

							<Divider flexItem orientation="vertical" sx={{ mr: 2 }} />

							<Typography variant="h4" component="span" color="textSecondary" sx={{ width: 300 }}>
								hours
							</Typography>
						</Box>
					</Tooltip>

					<Grid container wrap="nowrap" justifyContent={'center'} alignItems="center" sx={{ my: 2 }} columnSpacing={3}>
						<Grid item>
							<Button
								color="secondary"
								size="small"
								variant="outlined"
								startIcon={<IoRemove />}
								disabled={isDone || extendHours <= 0}
								onClick={() => setExtendHours(Math.max(extendHours - 24, 0))}
							>
								24 hours
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
								disabled={isDone || extendHours <= 0}
								onClick={() => setExtendHours(Math.max(extendHours - 1, 0))}
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
								disabled={isDone || extendHours >= MAX_HOURS_EXTEND}
								onClick={() => setExtendHours(Math.min(extendHours + 1, MAX_HOURS_EXTEND))}
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
								disabled={isDone || extendHours >= MAX_HOURS_EXTEND}
								onClick={() => setExtendHours(Math.min(extendHours + 24, MAX_HOURS_EXTEND))}
							>
								24 hours
							</Button>
						</Grid>
					</Grid>
					<Fade in={!isDone}>
						<div>
							<Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
								<Tooltip placement="top" title={extendHours <= 0 ? 'Add hours to extend!' : ''}>
									<Box sx={{ cursor: extendHours <= 0 ? 'help' : 'inherit' }}>
										<SubmitButton disabled={extendHours <= 0} variant="contained" type="submit" onClick={onSubmit}>
											{isSigning ? (
												<Fade in={isSigning}>
													<img src={MetaMaskFoxLogo} alt="metamask-fox" style={{ height: '100%' }} />
												</Fade>
											) : (
												'Extend life'
											)}
										</SubmitButton>
									</Box>
								</Tooltip>
							</Box>
							<Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
								<Typography variant="caption">Cost: {fee} SPC</Typography>
							</Box>
						</div>
					</Fade>
				</DialogContent>
			</Dialog>
			<LifelineDoneDialog open={open && isDone} onClose={handleClose} />
		</>
	)
}
