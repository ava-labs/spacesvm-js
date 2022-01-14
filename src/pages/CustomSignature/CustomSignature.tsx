import { FiSend } from 'react-icons/fi'
import {
	Button,
	Card,
	CircularProgress,
	Divider,
	Fade,
	Grid,
	Slide,
	Stepper,
	styled,
	TextareaAutosize,
	Typography,
} from '@mui/material'
import { Box } from '@mui/system'

import { SignButton } from './SignButton'
import { SubmitButton } from './SubmitButton'

import MetaMaskFoxLogo from '@/assets/metamask-fox.svg'
import { Page } from '@/components/Page'
import { PageTitle } from '@/components/PageTitle'
import { TypewrittingInput } from '@/components/TypewrittingInput'
import { API_DOMAIN } from '@/constants'
import { signWithMetaMask } from '@/utils/metamask'
import { fetchQuark, getPrefixInfo } from '@/utils/quarkvm'
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

export const CustomSignature = () => {
	const [json, setJson] = useState<string>('')
	const [isSigning, setIsSigning] = useState<boolean>(false)
	const [signature, setSignature] = useState<string | null>(null)
	const [signatureError, setSignatureError] = useState<string | null>(null)

	const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
	const [response, setResponse] = useState<any>()
	const [submitError, setSubmitError] = useState<string | null>(null)

	const signJson = async () => {
		if (!json?.length) return
		setSignature('')
		setResponse(null)
		try {
			const parsedJson = JSON.parse(json)
			setIsSigning(true)
			const signature = await signWithMetaMask(parsedJson)
			setIsSigning(false)
			if (!signature) {
				setSignatureError('Must sign in metamask!')
				return
			}

			// eslint-disable-next-line no-console
			console.log(signature)
			setSignatureError(null)
			setSignature(signature)
		} catch (err: any) {
			setIsSigning(false)
			setSignatureError(err.message)
		}
	}

	const submitRequest = async () => {
		if (!signature?.length || isSubmitting) return
		setIsSubmitting(true)

		try {
			// const res = await fetch(`${API_DOMAIN}/public`, {
			// 	headers: {
			// 		'Content-Type': 'application/json',
			// 	},
			// 	method: 'POST',
			// 	body: JSON.stringify({
			// 		jsonrpc: '2.0',
			// 		method: `quarkvm.issueTx`,
			// 		params: JSON.stringify({
			// 			payload: JSON.parse(json),
			// 			signature,
			// 		}),
			// 		id: 1,
			// 	}),
			// })
			const res = await getPrefixInfo('connor')

			setIsSubmitting(false)
			setResponse(res)
		} catch (err: any) {
			setIsSubmitting(false)
			setSubmitError(err.message)
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
				<Grid item md={4} xs={12} sx={{ position: 'relative' }}>
					<SignButton
						variant="contained"
						disabled={!json?.length}
						onClick={signJson}
						sx={{ position: 'absolute', right: 0, bottom: 0, mr: 4 }}
					>
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
				<Grid item md={8} xs={12}>
					<Typography variant="h6">Signature:</Typography>
					<Card sx={{ height: '100%', width: '100%', p: 2, maxWidth: 900, overflow: 'auto' }}>
						<Fade mountOnEnter in={!!(signature?.length || signatureError?.length)}>
							{signatureError ? (
								<Typography color="red" fontFamily="monospace">
									{signatureError}
								</Typography>
							) : (
								<Typography fontFamily="monospace" sx={{ overflowWrap: 'anywhere' }}>
									{signature}
								</Typography>
							)}
						</Fade>

						<Slide direction="up" mountOnEnter in={!!signature?.length}>
							<div>
								<Divider sx={{ my: 2 }} />
								<SubmitButton
									disabled={!signature?.length}
									variant="contained"
									sx={{
										display: 'flex',
										margin: '0 auto',
									}}
									onClick={() => submitRequest()}
								>
									{isSubmitting ? (
										<CircularProgress color="inherit" />
									) : (
										<>
											Submit
											<FiSend style={{ marginLeft: 8 }} />
										</>
									)}
								</SubmitButton>
							</div>
						</Slide>
						<Slide direction="up" mountOnEnter in={!!(response || submitError)}>
							<Box sx={{ maxHeight: 0, pb: 2 }}>
								{submitError ? (
									<Typography fontFamily="monospace" color="red" sx={{ overflowWrap: 'anywhere', mt: 2 }}>
										{submitError}
									</Typography>
								) : (
									<pre>
										<Typography fontFamily="monospace" sx={{ overflowWrap: 'anywhere', mt: 2 }}>
											{JSON.stringify(response, null, 2)}
										</Typography>
									</pre>
								)}
							</Box>
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
