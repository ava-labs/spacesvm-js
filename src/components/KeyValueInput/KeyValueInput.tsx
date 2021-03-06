import { AiOutlineRedo } from 'react-icons/ai'
import { IoAdd, IoCloseCircleOutline, IoInformationCircleOutline } from 'react-icons/io5'
import { Button, CircularProgress, Grid, Grow, IconButton, styled, TextField, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useSnackbar } from 'notistack'

import { VALID_KEY_REGEX } from '@/constants'
import { useMetaMask } from '@/providers/MetaMaskProvider'
import { purpleButton } from '@/theming/purpleButton'
import { TxType } from '@/types'
import { getSuggestedFee } from '@/utils/spacesVM'

const SetButton = styled(Button)(({ theme }) => ({
	...purpleButton(theme),
	padding: 0,
	minWidth: 0,
	height: 66,
}))

type KeyValueInputProps = {
	spaceId: string
	refreshSpaceDetails: any
	empty: boolean
}

export const KeyValueInput = memo(({ spaceId, refreshSpaceDetails, empty }: KeyValueInputProps) => {
	const { signWithMetaMask, issueTx } = useMetaMask()
	const [formValues, setFormValues] = useState<{ keyText?: string; valueText?: string; loading?: boolean }[]>([])
	const { enqueueSnackbar, closeSnackbar } = useSnackbar()

	const handleChange = (i: any, e: any) => {
		const newFormValues = [...formValues]

		if (e.target.name === 'keyText') {
			// @ts-ignore
			newFormValues[i][e.target.name] = e.target.value.toLowerCase()
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

	const submitKeyValue = async (i: number) => {
		const { keyText, valueText } = formValues[i]
		if (!keyText || !valueText || !spaceId) return
		const { typedData } = await getSuggestedFee({
			type: TxType.Set,
			space: spaceId,
			key: keyText,
			value: valueText,
		})

		const signature = await signWithMetaMask(typedData)
		if (!signature) {
			onSubmitFailure(i)
			return
		}

		const success = await issueTx(typedData, signature)
		if (!success) {
			onSubmitFailure(i)
			return
		}
		enqueueSnackbar('Item added successfully!', { variant: 'success' })
		refreshSpaceDetails()
		handleChange(i, {
			target: {
				name: 'loading',
				value: false,
			},
		})
		removeFormFields(i)
	}

	const onSubmitFailure = async (i: number) => {
		handleChange(i, {
			target: {
				name: 'loading',
				value: false,
			},
		})
		enqueueSnackbar('Oops!  Something went wrong when saving your key.  Try again!', {
			variant: 'warning',
			persist: true,
			action: (
				<>
					<Button
						startIcon={<AiOutlineRedo />}
						variant="outlined"
						color="inherit"
						onClick={() => {
							closeSnackbar()
							submitKeyValue(i)
						}}
					>
						Retry set
					</Button>
					<Tooltip title="Dismiss">
						<IconButton onClick={() => closeSnackbar()} color="inherit">
							<IoCloseCircleOutline />
						</IconButton>
					</Tooltip>
				</>
			),
		})
	}

	return (
		<>
			<Button
				disabled={formValues.length >= 5}
				onClick={() => addFormFields()}
				startIcon={<IoAdd />}
				variant="outlined"
				autoFocus
				color="secondary"
				sx={{ margin: 'auto', display: 'flex', mb: 4 }}
			>
				{empty ? 'Start adding' : 'Add more'}
			</Button>

			{formValues.map(
				({ keyText, valueText, loading }, i) =>
					i < 5 && (
						<Grow in={true} key={i}>
							<Grid key={i} sx={{ my: 4 }} container spacing={2} flexDirection="row" alignItems="center">
								<Grid item xs={12} sm={4}>
									<TextField
										color="secondary"
										disabled={loading}
										variant="filled"
										value={keyText}
										name="keyText"
										autoFocus
										onChange={(e) => {
											if (e.target.value === '' || VALID_KEY_REGEX.test(e.target.value)) {
												handleChange(i, e)
											}
										}}
										placeholder="Key"
										fullWidth
										helperText={
											<Tooltip
												title={
													<Typography variant="caption" noWrap fontSize={10}>
														Any lowercase string - e.g. twitter
													</Typography>
												}
												placement="bottom"
											>
												<Typography
													sx={{
														'&:hover': {
															cursor: 'help',
														},
													}}
													variant="caption"
													component="span"
													color="textSecondary"
												>
													<Box display="inline-flex" component="span" position="relative" top={3} left={-4}>
														<IoInformationCircleOutline size={14} />
													</Box>
													Hint
												</Typography>
											</Tooltip>
										}
										InputProps={{
											sx: { fontSize: 32, fontWeight: 900 },
										}}
										inputProps={{
											spellCheck: 'false',
										}}
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField
										color="secondary"
										disabled={loading}
										variant="filled"
										value={valueText}
										name="valueText"
										onChange={(e) => handleChange(i, e)}
										placeholder="Value"
										fullWidth
										helperText={
											<Tooltip
												title={
													<Typography variant="caption" noWrap fontSize={10}>
														Any lowercase string - e.g. https://example.com/
													</Typography>
												}
												placement="bottom"
											>
												<Typography
													sx={{
														'&:hover': {
															cursor: 'help',
														},
													}}
													variant="caption"
													component="span"
													color="textSecondary"
												>
													<Box display="inline-flex" component="span" position="relative" top={3} left={-4}>
														<IoInformationCircleOutline size={14} />
													</Box>
													Hint
												</Typography>
											</Tooltip>
										}
										InputProps={{
											sx: { fontSize: 32, fontWeight: 900 },
										}}
										inputProps={{
											spellCheck: 'false',
										}}
									/>
								</Grid>
								<Grid item sm={2} xs={12}>
									<SetButton
										fullWidth
										onClick={() => {
											handleChange(i, {
												target: {
													name: 'loading',
													value: true,
												},
											})

											submitKeyValue(i)
										}}
										disabled={loading || keyText?.length === 0 || valueText?.length === 0}
										sx={{ mb: 3 }}
										variant="contained"
										size="large"
									>
										{loading ? <CircularProgress color="secondary" /> : 'Set'}
									</SetButton>
								</Grid>
							</Grid>
						</Grow>
					),
			)}
		</>
	)
})
