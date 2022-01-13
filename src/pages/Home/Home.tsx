import { memo, useEffect, useState } from 'react'
import { IoSearch } from 'react-icons/io5'
import {
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
	InputAdornment,
	TextField,
	Typography,
} from '@mui/material'
import { styled } from '@mui/system'
// @ts-ignore
import FakeProgress from 'fake-progress'
import { useSnackbar } from 'notistack'

import MetaMaskFoxLogo from '@/assets/metamask-fox.svg'
import { Page } from '@/components/Page'
import { PageSubtitle } from '@/components/PageSubtitle'
import { PageTitle } from '@/components/PageTitle'
import { TypewrittingInput } from '@/components/TypewrittingInput'
import { WhileYouWait } from '@/components/WhileYouWait'
import { FIRST_NAMES } from '@/constants/firstNames'
import { onboardToMetamask, signTransaction } from '@/utils/metamask'
import { getClaimPayload } from '@/utils/quarkPayloads'
import { isAlreadyClaimed } from '@/utils/quarkvm'
import { shuffleArray } from '@/utils/shuffleArray'

const VerifyButton = styled(Button)(({ theme }: any) => ({
	backgroundColor: '#523df1',
	padding: theme.spacing(1, 10),
	height: 80,
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

const ClaimButton = styled(Button)(({ theme, progress = 0 }: any) => ({
	backgroundColor: '#e70256',
	backgroundImage: 'linear-gradient(100deg,#aa039f,#ed014d,#f67916)',
	padding: theme.spacing(1, 10),
	height: 80,
	minWidth: 320,
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

const USERNAMES = shuffleArray(FIRST_NAMES)

export const Home = memo(() => {
	const { enqueueSnackbar } = useSnackbar()
	const [showWhileYouWait, setShowWhileYouWait] = useState<boolean>(false)
	const [waitingForMetaMask, setWaitingForMetaMask] = useState<boolean>(false)
	const [username, setUsername] = useState<string>('')
	const [progress, setProgress] = useState<number>(0)
	const [verified, setVerified] = useState<boolean>(false)
	const [available, setAvailable] = useState<boolean>(false)
	const [costEstimate, setCostEstimate] = useState<number>()

	const onVerify = async () => {
		const isClaimed = await isAlreadyClaimed(username)

		setVerified(true)
		setAvailable(!isClaimed)

		// Call `onEnd` here
		// onEnd()
		console.info(`claimed`, isClaimed)
	}

	useEffect(() => {
		// bogus formula for now
		setCostEstimate(username.length * 9000)
	}, [username])

	const onClaim = async () => {
		setWaitingForMetaMask(true)
		onboardToMetamask(enqueueSnackbar)
		const claimPayload = await getClaimPayload(username)
		const signature = await signTransaction(claimPayload)
		setWaitingForMetaMask(false)
		if (!signature) return

		onSigned()
	}

	const onSigned = async () => {
		setShowWhileYouWait(true)

		const p = new FakeProgress({
			timeConstant: 10000,
			autoStart: true,
		})

		const onEachSecond = () => {
			console.log('Progress is ' + (p.progress * 100).toFixed(1) + ' %')
			setProgress(p.progress * 100)
		}

		const onEnd = () => {
			p.end()
			clearInterval(interval)
			console.log('Ended. Progress is ' + (p.progress * 100).toFixed(1) + ' %')
		}

		const interval = setInterval(onEachSecond, 1000)
	}

	const handleSubmit = (e: any) => {
		e.preventDefault()
	}

	return (
		<Page>
			<Dialog open={waitingForMetaMask} maxWidth="xs">
				<DialogTitle>
					<Typography variant="h5" fontFamily="DM Serif Display" align="center" sx={{ position: 'relative' }}>
						Please sign the message in your wallet to continue.{' '}
						<span style={{ position: 'absolute', fontSize: 42, transform: 'translateX(12px) translateY(-11px)' }}>
							👉
						</span>
					</Typography>
				</DialogTitle>
				<DialogContent>
					<Typography align="center" color="textSecondary">
						Verify that you’re the owner of this Ethereum address and any associated Spaces.
					</Typography>
				</DialogContent>
			</Dialog>

			<form onSubmit={handleSubmit} autoComplete="off" style={{ paddingTop: 42 }}>
				<PageTitle align="center">Claim your space</PageTitle>
				<PageSubtitle align="center">Needs to be unique.</PageSubtitle>

				<Grid container spacing={4} flexDirection="column" alignItems="center">
					<Grid item>
						<TypewrittingInput waitBeforeDeleteMs={2000} strings={USERNAMES}>
							{({ currentText }) => (
								<TextField
									disabled={showWhileYouWait || (available && verified)}
									value={username}
									onChange={(e) => {
										setVerified(false)
										setUsername(e.target.value)
									}}
									placeholder={currentText}
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
									}}
									inputProps={{
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
									disabled={username.length === 0 || showWhileYouWait || waitingForMetaMask}
									variant="contained"
									size="large"
									// @ts-ignore
									progress={progress}
								>
									{waitingForMetaMask ? (
										<Fade in={waitingForMetaMask}>
											<img src={MetaMaskFoxLogo} alt="metamask-fox" style={{ height: '100%' }} />
										</Fade>
									) : showWhileYouWait ? (
										<CircularProgress color="inherit" sx={{ zIndex: 3 }} />
									) : (
										'Claim'
									)}
								</ClaimButton>
							) : (
								<VerifyButton
									type="submit"
									onClick={onVerify}
									fullWidth
									disabled={username.length === 0 || showWhileYouWait}
									variant="contained"
									size="large"
									// @ts-ignore
									progress={progress}
								>
									Verify
								</VerifyButton>
							)}
						</Grid>
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
											lineHeight: 1,
											fontSize: costEstimate ? '1.5rem' : 36,
											position: 'relative',
										}}
									>
										{costEstimate ? (
											<>
												{new Intl.NumberFormat('en-US').format(costEstimate)}
												<Typography color="textSecondary" variant="caption" component="p">
													USD{' '}
													{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
														.format(costEstimate || 0)
														.slice(0, -3)}
												</Typography>
											</>
										) : (
											<span style={{ position: 'relative', top: -1 }}>💰</span>
										)}
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
					</Grid>
				</Grid>

				{!showWhileYouWait && (
					<Grow in={verified}>
						<div>
							{available ? (
								<Typography
									align="center"
									sx={{ m: 'auto', mt: 4, mb: 0, maxWidth: 860 }}
									gutterBottom
									color="lemonchiffon"
								>
									This username is available!
								</Typography>
							) : (
								<Typography align="center" sx={{ m: 'auto', mt: 4, mb: 0, maxWidth: 860 }} gutterBottom color="error">
									This username is already taken
								</Typography>
							)}
						</div>
					</Grow>
				)}

				<Grow mountOnEnter in={showWhileYouWait}>
					<div>
						<Typography
							align="center"
							sx={{ m: 'auto', mt: 4, mb: 0, maxWidth: 860 }}
							variant="body2"
							gutterBottom
							color="textSecondary"
						>
							This may take a little while...
						</Typography>
						<Typography
							variant="body2"
							align="center"
							sx={{ m: 'auto', mt: 1, maxWidth: 860 }}
							gutterBottom
							color="textSecondary"
						>
							Instead of requiring you to spend a token to make a claim, we instead require to compute some work.
						</Typography>
						<Typography
							variant="body2"
							align="center"
							sx={{ m: 'auto', mt: 1, maxWidth: 860 }}
							gutterBottom
							color="textSecondary"
						>
							This can take a few minutes and is only required once to claim your domain.
							<br />
							Whenever updating keys in your domain it will take much less time.
						</Typography>
					</div>
				</Grow>
			</form>

			{showWhileYouWait && <WhileYouWait />}
		</Page>
	)
})
