import { memo } from 'react'
import { IoSearch } from 'react-icons/io5'
import { Button, Grid, InputAdornment, TextField } from '@mui/material'
import { styled } from '@mui/system'

import { Page } from '@/components/Page'
import { PageSubtitle } from '@/components/PageSubtitle'
import { PageTitle } from '@/components/PageTitle'

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
}))

export const Home = memo(() => (
	<Page>
		<PageTitle align="center">Claim your domain</PageTitle>
		<PageSubtitle align="center">Needs to be unique</PageSubtitle>

		<Grid container spacing={6} flexDirection="column" alignItems="center">
			<Grid item>
				<TextField
					placeholder="Domain"
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
				/>
			</Grid>
			<Grid item>
				<ClaimButton variant="contained" size="large">
					Claim
				</ClaimButton>
			</Grid>
		</Grid>
	</Page>
))
