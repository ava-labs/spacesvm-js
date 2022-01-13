import { memo, useEffect, useState } from 'react'
import { IoSearch } from 'react-icons/io5'
// @ts-ignore
import faker from '@faker-js/faker/locale/en'
import {
	Box,
	Button,
	CircularProgress,
	Divider,
	Grid,
	Grow,
	InputAdornment,
	TextField,
	Typography,
} from '@mui/material'
import { styled } from '@mui/system'
// @ts-ignore
import FakeProgress from 'fake-progress'

import { Page } from '@/components/Page'
import { PageSubtitle } from '@/components/PageSubtitle'
import { PageTitle } from '@/components/PageTitle'
import { TypewrittingInput } from '@/components/TypewrittingInput'
import { WhileYouWait } from '@/components/WhileYouWait'
import { msToTime } from '@/utils/msToTime'
import { isAlreadyClaimed } from '@/utils/quarkvm'

const VerifyButton = styled(Button)(({ theme }: any) => ({
	color: '#fff',
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
		backgroundColor: 'hsla(0,0%,100%,0.1)',
	},
}))

const ClaimButton = styled(Button)(({ theme, progress = 0 }: any) => ({
	color: '#fff',
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

const USERNAMES = new Array(50).fill(null).map(() => faker.name.firstName())

export const Home = memo(() => {
	const [showWhileYouWait, setShowWhileYouWait] = useState<boolean>(false)
	const [username, setUsername] = useState<string>('')
	const [progress, setProgress] = useState<number>(0)
	const [verified, setVerified] = useState<boolean>(false)
	const [available, setAvailable] = useState<boolean>(false)
	const [timeEstimate, setTimeEstimate] = useState<number>()

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
		setTimeEstimate(username.length * 9000)
	}, [username])

	const onClaim = async () => {
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
			<form onSubmit={handleSubmit} autoComplete="off" style={{ paddingTop: 42 }}>
				<PageTitle align="center">Claim your username</PageTitle>
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
					<Grid item container justifyContent="center" alignItems="center" spacing={4} wrap="nowrap">
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
									{showWhileYouWait ? <CircularProgress color="inherit" sx={{ zIndex: 3 }} /> : 'Claim'}
								</ClaimButton>
							) : (
								<VerifyButton
									type="submit"
									onClick={onVerify}
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
						<Grid item sx={{ height: '100%', display: 'flex' }}>
							<Divider flexItem orientation="vertical" sx={{ height: 60, mr: 1 }} />
						</Grid>
						<Grid item container wrap="nowrap" spacing={4} alignItems="center" flexBasis="content">
							<Grid item>
								<Box
									position="relative"
									width={72}
									height={72}
									display="flex"
									alignItems="center"
									justifyContent="center"
									sx={{
										'&:before': {
											position: 'absolute',
											content: "''",
											background: timeEstimate
												? 'linear-gradient(100deg,#aa039f,#ed014d,#f67916)'
												: 'linear-gradient(100deg,#565656,#777777,#868686)',
											top: '50%',
											left: '50%',
											width: '128%',
											height: '128%',
											transform: 'translate3d(-50%,-50%,0)',
											filter: 'blur(8px)',
											borderRadius: 9999,
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
											borderRadius: 9999,
											backgroundColor: (theme) => theme.customPalette.customBackground,
										},
									}}
								>
									<Typography
										noWrap
										variant="h6"
										align="center"
										style={{ zIndex: 3, lineHeight: 1, fontSize: timeEstimate ? '1.25rem' : 36, position: 'relative' }}
									>
										{timeEstimate ? (
											<div dangerouslySetInnerHTML={{ __html: msToTime(timeEstimate, { showMs: false }) }} />
										) : (
											<span style={{ position: 'relative', top: -1 }}>⏱</span>
										)}
									</Typography>
								</Box>
							</Grid>
							<Grid item>
								<Typography variant="h6" gutterBottom>
									Time estimate
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
										longer
									</Typography>{' '}
									it will take to claim.
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
