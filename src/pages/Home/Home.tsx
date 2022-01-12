import { memo, useState } from 'react'
import { IoSearch } from 'react-icons/io5'
import { Button, CircularProgress, Grid, Grow, InputAdornment, TextField, Typography } from '@mui/material'
import { styled } from '@mui/system'

import { Page } from '@/components/Page'
import { PageSubtitle } from '@/components/PageSubtitle'
import { PageTitle } from '@/components/PageTitle'
import { WhileYouWait } from '@/components/WhileYouWait'

const ClaimButton = styled(Button)(({ theme }) => ({
	color: 'white',
	backgroundColor: '#523df1',
	padding: theme.spacing(1, 10),
	borderRadius: 9999,
	height: 80,
	minWidth: 320,
	fontWeight: 900,
	fontSize: 24,
	boxShadow: '0 0 40px rgb(82 61 241 / 60%)',
	'&:hover': {
		backgroundColor: '#7a68ff',
		boxShadow: '0 0 40px rgb(82 61 241 / 80%)',
	},
	'&.Mui-disabled': {
		backgroundColor: 'hsla(0,0%,100%,.1)',
	},
}))

export const Home = memo(() => {
	const [showWhileYouWait, setShowWhileYouWait] = useState<boolean>(false)
	const [domain, setDomain] = useState<string>('')

	const onFormSubmit = (e: any) => {
		e.preventDefault()

		setShowWhileYouWait(true)
	}

	return (
		<Page>
			<form onSubmit={onFormSubmit} autoComplete="new-password">
				<PageTitle align="center">Claim your username</PageTitle>
				<PageSubtitle align="center">Needs to be unique</PageSubtitle>

				<Grid container spacing={4} flexDirection="column" alignItems="center">
					<Grid item>
						<TextField
							disabled={showWhileYouWait}
							value={domain}
							onChange={(e) => setDomain(e.target.value)}
							placeholder="Username"
							name="something"
							fullWidth
							autoFocus
							InputProps={{
								sx: { fontSize: 80, fontWeight: 900 },
								startAdornment: (
									<InputAdornment sx={{ marginRight: 4 }} position="start">
										<IoSearch color="grey" />
									</InputAdornment>
								),
							}}
							inputProps={{
								autoComplete: 'new-password',
								'data-lpignore': true,
								'allow-1password': 'no',
							}}
						/>
					</Grid>
					<Grid item>
						<ClaimButton
							type="submit"
							disabled={domain.length === 0 || showWhileYouWait}
							variant="contained"
							size="large"
						>
							{showWhileYouWait ? <CircularProgress /> : 'Claim'}
						</ClaimButton>
					</Grid>
				</Grid>
			</form>

			<Grow in={showWhileYouWait}>
				<div>
					<Typography align="center" sx={{ m: 'auto', mt: 4, mb: 0, maxWidth: 860 }} gutterBottom color="textSecondary">
						This may take a little while.
					</Typography>
					<Typography align="center" sx={{ m: 'auto', mt: 1, maxWidth: 860 }} gutterBottom color="textSecondary">
						Instead of requiring you to spend a token to make a claim, we instead require to compute some work.
					</Typography>
					<Typography align="center" sx={{ m: 'auto', mt: 1, maxWidth: 860 }} gutterBottom color="textSecondary">
						This can take a few minutes and is only required once to claim your domain.
						<br />
						Whenever updating keys in your domain it will take much less time.
					</Typography>
				</div>
			</Grow>

			<WhileYouWait show={showWhileYouWait} />
		</Page>
	)
})
