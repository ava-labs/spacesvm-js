import { Twemoji } from 'react-emoji-render'
import { IoCheckmarkCircle, IoClose, IoSearch } from 'react-icons/io5'
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	Fade,
	Grid,
	Grow,
	IconButton,
	InputAdornment,
	TextField,
	Tooltip,
	Typography,
	useTheme,
} from '@mui/material'
import { styled } from '@mui/system'
import { useSnackbar } from 'notistack'

//import Bg from '@/assets/activity.jpeg'
import MetaMaskFoxLogo from '@/assets/metamask-fox.svg'
import { ClaimedDialog } from '@/components/ClaimedDialog'
import { Page } from '@/components/Page'
import { PageSubtitle } from '@/components/PageSubtitle'
import { PageTitle } from '@/components/PageTitle'
import { TypewrittingInput } from '@/components/TypewrittingInput'
import { USERNAME_REGEX, USERNAME_REGEX_QUERY, USERNAMES } from '@/constants'
import { useMetaMask } from '@/providers/MetaMaskProvider'
import { TxType } from '@/types'
import { calculateClaimCost } from '@/utils/calculateCost'
import { getSuggestedFee, isAlreadyClaimed } from '@/utils/spacesVM'

const VerifyButton = styled(Button)(({ theme }: any) => ({
	backgroundColor: '#523df1',
	padding: theme.spacing(1, 10),
	height: 80,
	minWidth: 280,
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

export const ClaimButton = styled(Button)(({ theme, progress = 0 }: any) => ({
	backgroundColor: '#e70256',
	backgroundImage: 'linear-gradient(100deg,#aa039f,#ed014d,#f67916)',
	padding: theme.spacing(1, 10),
	height: 80,
	minWidth: 280,
	fontWeight: 900,
	fontSize: 24,
	position: 'relative',
	boxShadow: '0 0 40px rgb(231 2 86 / 60%)',
	'&:hover': {
		backgroundImage: 'linear-gradient(100deg,#aa039f,#ed014d,#f67916)',
		boxShadow: '0 0 40px rgb(231 2 86 / 80%)',
	},
	'&.Mui-disabled': {
		backgroundColor: 'hsla(0,0%,100%,0.1)',
		backgroundImage: 'unset',
	},
	'&:after': {
		content: "''",
		zIndex: 2,
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		borderRadius: 9999,
		clipPath: `inset(0 ${100 - progress}% 0 0)`,
		backgroundColor: '#e70256',
		backgroundImage: 'linear-gradient(100deg,#aa039f,#ed014d,#f67916)',
		transition: 'clip-path 1s ease',
	},
}))

export const Home = memo(() => {
	const [searchParams] = useSearchParams()
	const { enqueueSnackbar } = useSnackbar()
	const [claiming, setClaiming] = useState<boolean>(false)
	const { issueTx, signWithMetaMask, balance } = useMetaMask()
	const navigate = useNavigate()
	const [showClaimedDialog, setShowClaimedDialog] = useState<boolean>(false)
	const [waitingForMetaMask, setWaitingForMetaMask] = useState<boolean>(false)
	const [username, setUsername] = useState<string>(
		searchParams.get('ref')?.toLowerCase().replace(USERNAME_REGEX_QUERY, '') || '',
	) // pre-fill if ?ref=something in URL
	const theme = useTheme()
	const [verified, setVerified] = useState<boolean>(false)
	const [available, setAvailable] = useState<boolean>(false)
	const [costEstimate, setCostEstimate] = useState<number>()

	const onVerify = async () => {
		// setting `?ref=USERNAME` in URL to persist refresh
		navigate({
			pathname: '',
			search: `?${createSearchParams({
				ref: username,
			})}`,
		})
		const isClaimed = await isAlreadyClaimed(username)
		setVerified(true)
		setAvailable(!isClaimed)
	}

	useEffect(() => {
		if (username.length === 0) {
			setCostEstimate(undefined)
			return
		}
		setCostEstimate(calculateClaimCost(username))
	}, [username])

	const onClaim = async () => {
		if (balance < calculateClaimCost(username)) {
			enqueueSnackbar("You don't have enough SPC to claim this space!  Tip: Longer names are cheaper. 😉", {
				variant: 'error',
			})
			return
		}

		setWaitingForMetaMask(true)
		const { typedData } = await getSuggestedFee({ type: TxType.Claim, space: username })
		const signature = await signWithMetaMask(typedData)
		setWaitingForMetaMask(false)
		if (!signature) return
		setClaiming(true)
		const claimSuccess = await issueTx(typedData, signature)
		if (!claimSuccess) {
			// Show something in the UI to display the claim failed
			return
		}
		onClaimSuccess()
	}

	const onClaimSuccess = async () => {
		setClaiming(false)
		setAvailable(false)
		setVerified(false)
		setShowClaimedDialog(true)
	}

	const handleSubmit = (e: any) => {
		e.preventDefault()
	}

	return (
		<Page>
			<ClaimedDialog spaceId={username} open={showClaimedDialog} onClose={() => setShowClaimedDialog(false)} />

			<Dialog open={waitingForMetaMask} maxWidth="xs">
				<DialogTitle>
					<Typography
						variant="h5"
						component="p"
						fontFamily="DM Serif Display"
						align="center"
						sx={{ position: 'relative' }}
					>
						Please sign the message in your wallet to continue.{' '}
						<span style={{ position: 'absolute', fontSize: 36, transform: 'translateX(8px) translateY(-3px)' }}>
							<Twemoji svg text="👉" />
						</span>
					</Typography>
				</DialogTitle>
				<DialogContent>
					<Typography align="center" color="textSecondary">
						Verify that you're the owner of this Ethereum address and any associated Spaces.
					</Typography>
					<Box sx={{ mt: 4 }} display="flex" justifyContent="center">
						<CircularProgress color="secondary" disableShrink />
					</Box>
				</DialogContent>
			</Dialog>

			<form onSubmit={handleSubmit} autoComplete="off">
				<PageTitle align="center" lineHeight={1} mt={2}>
					Claim your space
				</PageTitle>
				<PageSubtitle align="center">Needs to be unique and lowercase.</PageSubtitle>

				<Grid container spacing={4} flexDirection="column" alignItems="center">
					<Grid item>
						<TypewrittingInput waitBeforeDeleteMs={2000} strings={USERNAMES}>
							{({ currentText }) => (
								<TextField
									disabled={available && verified}
									value={username}
									onChange={(e) => {
										if (e.target.value === '' || USERNAME_REGEX.test(e.target.value)) {
											setVerified(false)
											setUsername(e.target.value.toLowerCase())
										}
									}}
									placeholder={currentText.toLowerCase()}
									fullWidth
									autoFocus
									InputProps={{
										sx: {
											fontSize: {
												xs: 24,
												sm: 42,
												md: 80,
											},
											fontWeight: 900,
											fontFamily: 'DM Serif Display',
										},
										startAdornment: (
											<InputAdornment sx={{ marginRight: 4 }} position="start">
												<IoSearch color="grey" />
											</InputAdornment>
										),
										endAdornment: (
											<InputAdornment position="end" sx={{ width: 80, height: 80 }}>
												{verified && available && (
													<Fade in>
														<Tooltip placement="top" title="Clear">
															<IconButton
																size="large"
																onClick={() => {
																	setVerified(false)
																	setUsername('')
																}}
															>
																<IoClose size={48} color="grey" />
															</IconButton>
														</Tooltip>
													</Fade>
												)}
											</InputAdornment>
										),
									}}
									inputProps={{
										maxLength: 255,
										spellCheck: 'false',
									}}
								/>
							)}
						</TypewrittingInput>
					</Grid>
					<Grid
						item
						container
						justifyContent="center"
						alignItems="center"
						spacing={4}
						sx={{
							flexWrap: {
								xs: 'wrap',
								md: 'nowrap',
							},
						}}
					>
						<Grid item>
							{verified && available ? (
								<ClaimButton
									onClick={onClaim}
									fullWidth
									disabled={claiming || username.length === 0 || waitingForMetaMask}
									variant="contained"
									size="large"
								>
									{claiming && <CircularProgress color="inherit" size={32} sx={{ mr: 2 }} />}
									{waitingForMetaMask ? (
										<Fade in={waitingForMetaMask}>
											<img src={MetaMaskFoxLogo} alt="metamask-fox" style={{ height: '100%' }} />
										</Fade>
									) : claiming ? (
										'Claiming...'
									) : (
										'Claim'
									)}
								</ClaimButton>
							) : (
								<VerifyButton
									type="submit"
									onClick={() => (verified ? navigate(`/spaces/${username}/`) : onVerify())}
									fullWidth
									disabled={username.length === 0}
									variant="contained"
									size="large"
									sx={{
										fontSize: {
											xs: 18,
											sm: 24,
										},
									}}
								>
									{verified ? 'View space' : 'Check availability'}
								</VerifyButton>
							)}
						</Grid>

						{verified && costEstimate && available && (
							<>
								<Grid
									item
									sx={{
										height: '100%',
										display: {
											xs: 'none',
											md: 'flex',
										},
									}}
								>
									<Divider
										flexItem
										orientation="vertical"
										sx={{
											height: 60,
										}}
									/>
								</Grid>
								<Grid item container wrap="nowrap" spacing={4} alignItems="center" flexBasis="content">
									<Grid item>
										<Box
											position="relative"
											width={144}
											height={72}
											display="flex"
											alignItems="center"
											justifyContent="center"
											sx={{
												ml: 2,
												'&:before': {
													position: 'absolute',
													content: "''",
													background: 'linear-gradient(100deg,#aa039f,#ed014d,#f67916)',
													top: '50%',
													left: '50%',
													width: costEstimate ? '115%' : '100%',
													height: costEstimate ? '125%' : '100%',
													transform: 'translate3d(-50%,-50%,0)',
													filter: `blur(8px) ${!costEstimate ? 'grayscale(0.92) opacity(0.5)' : ''}`,
													transitionProperty: 'width, height, filter',
													transitionDuration: '0.2s',
													transitionTimingFunction: 'ease',
													borderRadius: 3,
													zIndex: 1,
												},
												'&:after': {
													content: "''",
													top: 0,
													right: 0,
													bottom: 0,
													left: 0,
													zIndex: 2,
													position: 'absolute',
													borderRadius: 3,
													backgroundColor: (theme) => theme.customPalette.customBackground,
												},
											}}
										>
											<Typography
												noWrap
												variant="h6"
												align="center"
												style={{
													zIndex: 3,
													marginTop: 4,
													fontSize: costEstimate ? '1.5rem' : 36,
													position: 'relative',
												}}
											>
												{new Intl.NumberFormat('en-US').format(costEstimate)}
											</Typography>
										</Box>
									</Grid>
									<Grid item>
										<Typography variant="h6" gutterBottom>
											Cost{' '}
											<Typography component="span" color="textSecondary">
												(SPC)
											</Typography>
										</Typography>
										<Typography variant="body2" color="textSecondary">
											The{' '}
											<Typography component="b" fontWeight={900} variant="body2" color="textPrimary">
												shorter
											</Typography>{' '}
											the username,
											<br />
											the{' '}
											<Typography component="b" fontWeight={900} variant="body2" color="textPrimary">
												more
											</Typography>{' '}
											it will cost to claim.
										</Typography>
									</Grid>
								</Grid>
							</>
						)}
					</Grid>
				</Grid>

				<Grow in={verified}>
					<div>
						{available ? (
							<Alert
								icon={
									<IoCheckmarkCircle style={{ position: 'relative', top: 2, color: theme.palette.success.light }} />
								}
								severity="success"
								sx={{ m: 'auto', mt: 4, mb: 0, maxWidth: 480, justifyContent: 'center' }}
							>
								<Typography>This space is available!</Typography>
							</Alert>
						) : (
							<Typography
								align="center"
								sx={{ m: 'auto', mt: 4, mb: 0, maxWidth: 860, display: 'block' }}
								gutterBottom
								color="error"
							>
								This space is already taken
							</Typography>
						)}
					</div>
				</Grow>
			</form>

			{/* 
			// recent activity
			<Divider sx={{ my: 8 }} />
			<Grid container spacing={2} sx={{ minHeight: '60vh', mt: 4 }}>
				<Grid item xs={8}>
					<Typography variant="h4" align="center" component="p" fontFamily="DM Serif Display">
						Recent activity
					</Typography>
				</Grid>
				<Grid
					item
					xs={4}
					sx={{
						borderRadius: 4,
						backgroundImage: `url(${Bg})`,
						backgroundSize: 'cover',
						backgroundRepeat: 'no-repeat',
						backgroundPosition: 'center',
					}}
				></Grid>
				</Grid>*/}
		</Page>
	)
})
