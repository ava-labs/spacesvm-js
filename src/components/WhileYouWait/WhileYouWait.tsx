import { IoAdd } from 'react-icons/io5'
import { Button, CircularProgress, Divider, Grid, Slide, TextField, Typography } from '@mui/material'
import { styled } from '@mui/system'

import { USERNAME_REGEX } from '@/constants'

const SetButton = styled(Button)(({ theme }) => ({
	backgroundColor: '#523df1',
	padding: theme.spacing(1),
	height: 80,
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

export const WhileYouWait = memo(() => {
	const [showAfterDelay, setShowAfterDelay] = useState<boolean>(false)
	const [delay] = useState<number>(2500)
	const [formValues, setFormValues] = useState<{ keyText?: string; valueText?: string; loading?: boolean }[]>([
		{ keyText: '', valueText: '', loading: false },
	])

	useEffect(() => {
		setTimeout(() => {
			setShowAfterDelay(true)
		}, delay)
	}, [delay])

	const handleChange = (i: any, e: any) => {
		const newFormValues = [...formValues]

		if (e.target.name === 'keyText') {
			if (e.target.value === '' || USERNAME_REGEX.test(e.target.value)) {
				// @ts-ignore
				newFormValues[i][e.target.name] = e.target.value.toLowerCase()
			}
		} else {
			// @ts-ignore
			newFormValues[i][e.target.name] = e.target.value
		}

		setFormValues(newFormValues)
	}

	const addFormFields = () => {
		setFormValues([...formValues, { keyText: '', valueText: '', loading: false }])
	}

	const removeFormFields = (i: number) => {
		const newFormValues = [...formValues]
		newFormValues.splice(i, 1)
		setFormValues(newFormValues)
	}

	return (
		<Slide direction="up" mountOnEnter in={showAfterDelay}>
			<div>
				<Divider sx={{ my: 8 }} />

				<Typography gutterBottom align="center" variant="h6" fontFamily="DM Serif Display">
					While you wait...
				</Typography>
				<Typography align="center" color="textSecondary" variant="body2">
					Might aswell fill these out with something 🤓
				</Typography>

				{formValues.map(
					({ keyText, valueText, loading }, i) =>
						i < 5 && (
							<Grid
								key={i}
								sx={{ mt: 2 }}
								container
								spacing={5}
								flexDirection="row"
								alignItems="center"
								justifyContent="center"
							>
								<Grid item xs={12} sm={4}>
									<TextField
										color="secondary"
										disabled={loading}
										variant="filled"
										value={keyText}
										name="keyText"
										onChange={(e) => handleChange(i, e)}
										placeholder="Key"
										fullWidth
										InputProps={{
											sx: { fontSize: 32, fontWeight: 900 },
										}}
										inputProps={{
											spellCheck: 'false',
										}}
									/>
								</Grid>
								<Grid item xs={12} sm={4}>
									<TextField
										color="secondary"
										disabled={loading}
										variant="filled"
										value={valueText}
										name="valueText"
										onChange={(e) => handleChange(i, e)}
										placeholder="Value"
										fullWidth
										InputProps={{
											sx: { fontSize: 32, fontWeight: 900 },
										}}
										inputProps={{
											spellCheck: 'false',
										}}
									/>
								</Grid>
								<Grid item xs={12} sm={2}>
									<SetButton
										fullWidth
										onClick={() => {
											handleChange(i, {
												target: {
													name: 'loading',
													value: true,
												},
											})

											console.info('SETTING KEY/VALUE PAIR...', formValues[i])
										}}
										disabled={loading || keyText?.length === 0 || valueText?.length === 0}
										variant="contained"
										size="large"
									>
										{loading ? <CircularProgress color="secondary" /> : 'Set'}
									</SetButton>
								</Grid>
							</Grid>
						),
				)}

				<Button
					disabled={formValues.length >= 5}
					onClick={() => addFormFields()}
					startIcon={<IoAdd />}
					variant="outlined"
					color="secondary"
					sx={{ margin: 'auto', mt: 4, display: 'flex' }}
				>
					Add more
				</Button>
			</div>
		</Slide>
	)
})
