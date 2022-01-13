import { memo, useState } from 'react'
import { IoSearch } from 'react-icons/io5'
// @ts-ignore
import faker from '@faker-js/faker/locale/en'
import { Button, CircularProgress, Fade, Grid, Grow, InputAdornment, TextField, Typography } from '@mui/material'
import { styled } from '@mui/system'
// @ts-ignore
import FakeProgress from 'fake-progress'

import MetaMaskFoxLogo from '@/assets/metamask-fox.svg'
import { Page } from '@/components/Page'
import { PageSubtitle } from '@/components/PageSubtitle'
import { PageTitle } from '@/components/PageTitle'
import { TypewrittingInput } from '@/components/TypewrittingInput'
import { WhileYouWait } from '@/components/WhileYouWait'
import { ethSign, mmRequestAccounts } from '@/utils/metamask'
import { isAlreadyClaimed } from '@/utils/quarkvm'

const VerifyButton = styled(Button)(({ theme }: any) => ({
	color: 'white',
	backgroundColor: '#523df1',
	padding: theme.spacing(1, 10),
	borderRadius: 9999,
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
		backgroundColor: 'hsla(0,0%,100%,0.1)',
	},
}))

const ClaimButton = styled(Button)(({ theme, progress }: any) => ({
	color: 'white',
	backgroundColor: '#e70256',
	backgroundImage: 'linear-gradient(100deg,#aa039f,#ed014d,#f67916)',
	padding: theme.spacing(1, 10),
	borderRadius: 9999,
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

const USERNAMES = new Array(50).fill(null).map(() => faker.name.firstName())

export const Home = memo(() => {
	const [showWhileYouWait, setShowWhileYouWait] = useState<boolean>(false)
	const [waitingForMetaMask, setWaitingForMetaMask] = useState<boolean>(false)
	const [username, setUsername] = useState<string>('')
	const [progress, setProgress] = useState<number>(0)
	const [verified, setVerified] = useState<boolean>(false)
	const [available, setAvailable] = useState<boolean>(false)

	const onVerify = async () => {
		const isClaimed = await isAlreadyClaimed(username)

		setVerified(true)
		setAvailable(!isClaimed)

		// Call `onEnd` here
		// onEnd()
		console.info(`claimed`, isClaimed)
	}

	const onClaim = async () => {
		setWaitingForMetaMask(true)
		const signature = await ethSign(username)
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

	return (
		<Page>
			<PageTitle align="center">Claim your username</PageTitle>
			<PageSubtitle align="center">Needs to be unique</PageSubtitle>

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
				<Grid item>
					{verified && available ? (
						<ClaimButton
							onClick={onClaim}
							disabled={username.length === 0 || showWhileYouWait}
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
							onClick={onVerify}
							disabled={username.length === 0 || showWhileYouWait}
							variant="contained"
							size="large"
							// @ts-ignore
							progress={progress}
						>
							{showWhileYouWait ? <CircularProgress color="inherit" sx={{ zIndex: 3 }} /> : 'Verify availability'}
						</VerifyButton>
					)}
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

			{showWhileYouWait && <WhileYouWait />}
		</Page>
	)
})
