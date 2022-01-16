import { Twemoji } from 'react-emoji-render'
import { IoAdd, IoRemove } from 'react-icons/io5'
import { useParams } from 'react-router-dom'
import {
	Box,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	Fade,
	Grid,
	IconButton,
	Link,
	Slide,
	styled,
	Tooltip,
	Typography,
} from '@mui/material'
import { throttle } from 'lodash'

import MetaMaskFoxLogo from '@/assets/metamask-fox.svg'
import { rainbowText } from '@/theming/rainbowText'
import { TxType } from '@/types'
import { signWithMetaMaskV4 } from '@/utils/metamask'
import { getSuggestedFee, issueTransaction } from '@/utils/spacesVM'

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
	refreshSpaceDetails(): void
}

const checkFee = throttle(async (space, units) => getSuggestedFee({ type: TxType.Lifeline, space, units }), 2000)

export const LifelineDialog = ({ open, close, existingExpiry, refreshSpaceDetails }: LifelineDialogProps) => {
	const { spaceId } = useParams()
	const [extendUnits, setExtendUnits] = useState(0)
	const [typedData, setTypedData] = useState<any>()
	const [fee, setFee] = useState(0)
	const [isSigning, setIsSigning] = useState(false)
	const [isDone, setIsDone] = useState(false)

	const onSubmit = async () => {
		setIsSigning(true)
		const { typedData: latestTypedData } = await getSuggestedFee({
			type: TxType.Lifeline,
			space: spaceId,
			units: extendUnits,
		})
		const signature = await signWithMetaMaskV4(latestTypedData)
		setIsSigning(false)
		if (!signature) return
		const result = await issueTransaction(typedData, signature)
		if (result) setIsDone(true)
		refreshSpaceDetails()
	}

	const extendToDateDisplay = useMemo(() => {
		const now = new Date(existingExpiry * 1000)
		now.setHours(now.getHours() + extendUnits)
		return now.toLocaleString()
	}, [extendUnits, existingExpiry])

	useEffect(() => {
		const _checkFee = async () => {
			const { typedData, totalCost } = await checkFee(spaceId, extendUnits)
			setTypedData(typedData)
			setFee(totalCost)
		}
		_checkFee()
	}, [extendUnits, spaceId, open])

	const handleClose = () => {
		setIsDone(false)
		setExtendUnits(0)
		close()
	}

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="xs">
			<DialogTitle>
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
			<DialogContent sx={{ mt: 2, overflowY: 'hidden' }}>
				<Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 1 }}>
					Extend by
				</Typography>

				<Tooltip sx={{ cursor: 'help' }} placement="top" title={`Extend to ${extendToDateDisplay}`}>
					<Box display="flex" alignItems="center" justifyContent="center">
						<Typography sx={{ color: (theme) => theme.palette.secondary.light }} variant="h3">
							{extendUnits}
						</Typography>

						<Divider flexItem orientation="vertical" sx={{ mx: 2 }} />

						<Typography variant="h4" component="span" color="textSecondary">
							hours
						</Typography>
					</Box>
				</Tooltip>

				<Grid container spacing={1} wrap="nowrap" justifyContent={'space-between'} alignItems="center" sx={{ mt: 1 }}>
					<Grid item>
						<Button
							color="secondary"
							size="small"
							variant="outlined"
							startIcon={<IoRemove />}
							disabled={isDone || extendUnits <= 0}
							onClick={() => setExtendUnits(Math.max(extendUnits - 24, 0))}
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
							disabled={isDone || extendUnits <= 0}
							onClick={() => setExtendUnits(extendUnits - 1)}
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
							disabled={isDone}
							onClick={() => setExtendUnits(extendUnits + 1)}
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
							disabled={isDone}
							onClick={() => setExtendUnits(extendUnits + 24)}
						>
							24 hours
						</Button>
					</Grid>
				</Grid>

				{isDone ? (
					<Slide direction="up" in={isDone}>
						<div style={{ height: 78 }}>
							<Box sx={{ mt: 4, pt: 1, display: 'flex', justifyContent: 'center' }}>
								<Typography
									variant="h5"
									align="right"
									lineHeight={1}
									sx={{
										...rainbowText,
									}}
								>
									Lifeline extended!
									<Twemoji svg text=":tada:" />
								</Typography>
							</Box>
							<Typography variant="body1" component="div" align="center" sx={{ mt: 2, cursor: 'pointer' }}>
								<Link onClick={handleClose}>Close</Link>
							</Typography>
						</div>
					</Slide>
				) : (
					<Fade in={!isDone}>
						<div>
							<Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
								<Tooltip placement="top" title={extendUnits <= 0 ? 'Add hours to extend!' : ''}>
									<Box sx={{ cursor: extendUnits <= 0 ? 'help' : 'inherit' }}>
										<SubmitButton disabled={extendUnits <= 0} variant="contained" type="submit" onClick={onSubmit}>
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
				)}
			</DialogContent>
		</Dialog>
	)
}
