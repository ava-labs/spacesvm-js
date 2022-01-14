import { Button, Card, Grid, styled, TextareaAutosize, Typography } from '@mui/material'

import { Page } from '@/components/Page'
import { PageTitle } from '@/components/PageTitle'
import { signWithMetaMask } from '@/utils/metamask'

const JsonTextArea = styled(TextareaAutosize)`
	min-height: 800px;
	width: 100%;
	max-width: 100%;
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

export const CustomSignature = () => {
	const [json, setJson] = useState<string | null>(null)
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
				Hi, Patrick!
			</PageTitle>
			<Grid container sx={{ width: '100%' }} spacing={1}>
				<Grid item md={5} xs={12}>
					<Typography variant="h6">Input:</Typography>
					<JsonTextArea onChange={(e) => setJson(e.target.value)} placeholder={jsonPlaceholder} />
				</Grid>
				<Grid item md={2} xs={12}>
					<Button variant="contained" fullWidth sx={{ mt: 16 }} onClick={signJson}>
						<Typography variant="button" fontSize={20} sx={{ verticalAlign: 'middle' }}>
							Sign
							<span style={{ marginLeft: 8 }}>➡️</span>
						</Typography>
					</Button>
				</Grid>
				<Grid item md={5} xs={12}>
					<Typography variant="h6">Signature:</Typography>
					<Card sx={{ height: 800, width: '100%', p: 1, maxWidth: 900 }}>
						{error ? (
							<Typography color="red" fontFamily="monospace">
								{error}
							</Typography>
						) : (
							<Typography fontFamily="monospace">{signature}</Typography>
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
