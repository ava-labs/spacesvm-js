import { Button, Card, Divider, Fade, Grid, Slide, Stepper, styled, TextareaAutosize, Typography } from '@mui/material'

import { SignButton } from './SignButton'

import MetaMaskFoxLogo from '@/assets/metamask-fox.svg'
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
	overflow-y: auto !important;
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

const SubmitButton = styled(Button)(({ theme }: any) => ({
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
		backgroundColor: theme.palette.mode === 'dark' ? 'hsla(0,0%,100%,0.1)' : 'hsla(0,0%,0%,0.1)',
	},
}))

export const CustomSignature = () => {
	const [json, setJson] = useState<string>('')
	const [isSigning, setIsSigning] = useState<boolean>(false)
	const [signature, setSignature] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)

	const signJson = async () => {
		if (!json?.length) return
		try {
			const parsedJson = JSON.parse(json)
			setIsSigning(true)
			const signature = await signWithMetaMask(parsedJson)
			setIsSigning(false)
			if (!signature) {
				setError('Must sign in metamask!')
				return
			}

			// eslint-disable-next-line no-console
			console.log(signature)
			setError(null)
			setSignature(signature)
		} catch (error: any) {
			setIsSigning(false)
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
					<SignButton variant="contained" fullWidth onClick={signJson} sx={{ mt: { xs: 1, md: 16 } }}>
						{isSigning ? (
							<Fade in={isSigning}>
								<img src={MetaMaskFoxLogo} alt="metamask-fox" height="100%" />
							</Fade>
						) : (
							<>
								Sign
								<span style={{ marginLeft: 8 }}>➡️</span>
							</>
						)}
					</SignButton>
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
						<Slide direction="up" mountOnEnter in={!!signature?.length}>
							<div>
								<Divider sx={{ my: 2 }} />
								<SubmitButton
									disabled={!signature?.length}
									variant="contained"
									sx={{
										display: 'block',
										margin: '0 auto',
									}}
								>
									SUBMIT
								</SubmitButton>
							</div>
						</Slide>
					</Card>
				</Grid>
			</Grid>
		</Page>
	)
}

/**
[{"type":"string","name":"BlockID","value":"4Cwd9xZXfiBc3djER9zBpYJw6rAYHqN1s9DCpNttbyRPVdYRb"},{"type":"string","name":"Prefix","value":"connor"},{"type":"string","name":"Type","value":"claim"}]
 */
