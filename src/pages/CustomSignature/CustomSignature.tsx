import { Button, Card, Grid, styled, TextareaAutosize, Typography } from '@mui/material'

import { Page } from '@/components/Page'
import { PageTitle } from '@/components/PageTitle'
import { TypewrittingInput } from '@/components/TypewrittingInput'
import { signWithMetaMask } from '@/utils/metamask'
import { shuffleArray } from '@/utils/shuffleArray'

const JsonTextArea = styled(TextareaAutosize)`
	width: 100%;
	max-width: 100%;
	min-width: 100%;
	border: 0;
	outline: none;
	max-height: 100%;
	overflow-y: scroll !important;
	resize: none;
`

const jsonPlaceholder = `[
  {
    "type": "string",
    "name": "BlockID",
    "value": "4Cwd9xZXfiBc3djER9zBpYJw6rAYHqN1s9DCpNttbyRPVdYRb"
  },
  {
    "type": "string",
    "name": "Prefix",
    "value": "connor"
  },
  {
    "type": "string",
    "name": "Type",
    "value": "claim"
  }
]
`

const DEV_NAMES = shuffleArray([
	'Patrick',
	'Connor',
	'other Conor',
	'Cohan',
	'Dhruba',
	'Gabriel',
	'Gyuho',
	'Jiten',
	'Xander',
])

export const CustomSignature = () => {
	const [json, setJson] = useState<string>('')
	const [signature, setSignature] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)

	const signJson = async () => {
		if (!json?.length) return
		try {
			const parsedJson = JSON.parse(json)
			const signature = await signWithMetaMask(parsedJson)
			if (!signature) {
				setError('Must sign in metamask!')
				return
			}

			// eslint-disable-next-line no-console
			console.log(signature)
			setError(null)
			setSignature(signature)
		} catch (error: any) {
			setError(error.message)
		}
	}

	return (
		<Page>
			<PageTitle variant="h3" sx={{ mt: 3 }}>
				Hi,{' '}
				<TypewrittingInput waitBeforeDeleteMs={2000} strings={DEV_NAMES}>
					{({ currentText }) => <span>{currentText}</span>}
				</TypewrittingInput>
				!
			</PageTitle>
			<Grid container sx={{ width: '100%', height: '100%', minHeight: 200 }} spacing={1}>
				<Grid item md={5} xs={12}>
					<Grid container justifyContent="space-between" alignItems="end">
						<Grid item>
							<Typography variant="h6">Input:</Typography>
						</Grid>
						<Grid item>
							<Button variant="text" sx={{ py: 0 }} onClick={() => setJson(jsonPlaceholder)}>
								Fill with sample.
							</Button>
						</Grid>
					</Grid>
					<JsonTextArea
						onChange={(e) => setJson(e.target.value)}
						value={json}
						placeholder={jsonPlaceholder}
						sx={{ borderRadius: 2, padding: 2, height: '100% !important' }}
					/>
				</Grid>
				<Grid item md={2} xs={12}>
					<Button
						variant="contained"
						fullWidth
						onClick={signJson}
						sx={{ mt: 16, background: 'linear-gradient(100deg,#aa039f,#ed014d,#f67916)' }}
					>
						<Typography variant="button" fontSize={20} sx={{ verticalAlign: 'middle' }}>
							Sign
							<span style={{ marginLeft: 8 }}>➡️</span>
						</Typography>
					</Button>
				</Grid>
				<Grid item md={5} xs={12}>
					<Typography variant="h6">Signature:</Typography>
					<Card sx={{ height: '100%', width: '100%', p: 2, maxWidth: 900 }}>
						{error ? (
							<Typography color="red" fontFamily="monospace">
								{error}
							</Typography>
						) : (
							<Typography fontFamily="monospace" sx={{ overflowWrap: 'anywhere' }}>
								{signature}
							</Typography>
						)}
					</Card>
				</Grid>
			</Grid>
		</Page>
	)
}

/**
[{"type":"string","name":"BlockID","value":"4Cwd9xZXfiBc3djER9zBpYJw6rAYHqN1s9DCpNttbyRPVdYRb"},{"type":"string","name":"Prefix","value":"connor"},{"type":"string","name":"Type","value":"claim"}]
 */
