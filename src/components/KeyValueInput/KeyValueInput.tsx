import { IoAdd } from 'react-icons/io5'
import { Button, CircularProgress, Grid, Grow, TextField } from '@mui/material'
import { styled } from '@mui/system'

import { USERNAME_REGEX } from '@/constants'
import { TxType } from '@/types'
import { signWithMetaMaskV4 } from '@/utils/metamask'
import { getSuggestedFee, issueTransaction } from '@/utils/spacesVM'

const SetButton = styled(Button)(({ theme }) => ({
	backgroundColor: '#523df1',
	padding: theme.spacing(1),
	height: 66,
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

type KeyValueInputProps = {
	spaceId: string
	refreshSpaceDetails: any
}

export const KeyValueInput = memo(({ spaceId, refreshSpaceDetails }: KeyValueInputProps) => {
	const [formValues, setFormValues] = useState<{ keyText?: string; valueText?: string; loading?: boolean }[]>([])

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

	const submitKeyValue = async (i: number) => {
		const { keyText, valueText } = formValues[i]
		if (!keyText || !valueText || !spaceId) return
		const { typedData } = await getSuggestedFee({
			type: TxType.Set,
			space: spaceId,
			key: keyText,
			value: btoa(valueText),
		})
		const signature = await signWithMetaMaskV4(typedData)
		if (!signature) return
		const result = await issueTransaction(typedData, signature)
		if (!result) return
		// Give the blockchain a chance to update... yes I know this is bad code but its easy for now <3
		setTimeout(refreshSpaceDetails, 1000)
		handleChange(i, {
			target: {
				name: 'loading',
				value: false,
			},
		})
		removeFormFields(i)
	}

	return (
		<>
			<Button
				disabled={formValues.length >= 5}
				onClick={() => addFormFields()}
				startIcon={<IoAdd />}
				variant="outlined"
				color="secondary"
				sx={{ margin: 'auto', display: 'flex', mb: 4 }}
			>
				Add more
			</Button>
			<div>
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
											InputProps={{
												sx: { fontSize: 32, fontWeight: 900 },
											}}
											inputProps={{
												spellCheck: 'false',
											}}
										/>
									</Grid>
									<Grid item xs={2}>
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
			</div>
		</>
	)
})
