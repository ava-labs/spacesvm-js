import { memo, useState } from 'react'
import { IoSearch } from 'react-icons/io5'
import { Button, Grid, InputAdornment, TextField, Typography } from '@mui/material'
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

export const WhileYouWait = memo(() => {
	const [domain, setDomain] = useState<string>('')

	return (
		<>
			<Typography variant="h6">While you wait...</Typography>
			<Typography color="textSecondary" variant="body2">
				Might aswell fill these out
			</Typography>

			<Grid container spacing={6} flexDirection="column" alignItems="center">
				<Grid item>
					<TextField
						value={domain}
						onChange={(e) => setDomain(e.target.value)}
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
					<ClaimButton disabled={domain.length === 0} variant="contained" size="large">
						Claim
					</ClaimButton>
				</Grid>
			</Grid>
		</>
	)
})
