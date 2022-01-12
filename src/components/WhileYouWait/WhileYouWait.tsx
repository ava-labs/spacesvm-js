import { memo, useEffect, useState } from 'react'
import { IoAdd } from 'react-icons/io5'
import { Button, Divider, Grid, Slide, TextField, Typography } from '@mui/material'
import { styled } from '@mui/system'

const SetButton = styled(Button)(({ theme }) => ({
	color: 'white',
	backgroundColor: '#523df1',
	padding: theme.spacing(1, 10),
	borderRadius: 9999,
	height: 80,
	fontWeight: 900,
	fontSize: 24,
	boxShadow: '0 0 40px rgb(82 61 241 / 60%)',
	'&:hover': {
		backgroundColor: '#7a68ff',
		boxShadow: '0 0 40px rgb(82 61 241 / 80%)',
	},
}))

export const WhileYouWait = memo(() => {
	const [showAfterDelay, setShowAfterDelay] = useState<boolean>(false)
	const [delay] = useState<number>(2500)
	const [keyText, setKeyText] = useState<string>('')
	const [propertyText, setPropertyText] = useState<string>('')

	useEffect(() => {
		setTimeout(() => {
			setShowAfterDelay(true)
		}, delay)
	}, [delay])

	return (
		<Slide direction="up" mountOnEnter in={showAfterDelay}>
			<div>
				<Divider sx={{ my: 8 }} />

				<Typography gutterBottom align="center" variant="h6">
					While you wait...
				</Typography>
				<Typography align="center" color="textSecondary" variant="body2">
					Might aswell fill these out
				</Typography>

				<Grid sx={{ mt: 2 }} container spacing={5} flexDirection="row" alignItems="center">
					<Grid item xs={12} sm={5}>
						<TextField
							variant="filled"
							value={keyText}
							onChange={(e) => setKeyText(e.target.value)}
							placeholder="Key"
							fullWidth
							InputProps={{
								sx: { fontSize: 32, fontWeight: 900 },
							}}
						/>
					</Grid>
					<Grid item xs={12} sm={5}>
						<TextField
							variant="filled"
							value={propertyText}
							onChange={(e) => setPropertyText(e.target.value)}
							placeholder="Value"
							fullWidth
							InputProps={{
								sx: { fontSize: 32, fontWeight: 900 },
							}}
						/>
					</Grid>
					<Grid item xs={12} sm={2}>
						<SetButton
							fullWidth
							disabled={keyText.length === 0 || propertyText.length === 0}
							variant="contained"
							size="large"
						>
							Set
						</SetButton>
					</Grid>
				</Grid>

				<Button startIcon={<IoAdd />} sx={{ mt: 4 }}>
					Add more
				</Button>
			</div>
		</Slide>
	)
})
