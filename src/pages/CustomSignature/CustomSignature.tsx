import {
	Button,
	Card,
	CircularProgress,
	Container,
	Divider,
	Fade,
	Grid,
	Slide,
	styled,
	TextareaAutosize,
	Tooltip,
	Typography,
} from '@mui/material'
import { Box } from '@mui/system'

import { SignButton } from './SignButton'
import { SubmitButton } from './SubmitButton'

import MetaMaskFoxLogo from '@/assets/metamask-fox.svg'
import { Page } from '@/components/Page'
import { PageTitle } from '@/components/PageTitle'
import { TypewrittingInput } from '@/components/TypewrittingInput'
import { signWithMetaMaskV4 } from '@/utils/metamask'
import { fetchSpaces, getSuggestedFee } from '@/utils/quarkvm'
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
	font-size: 14px;
`

const SectionTitle = styled(Typography)`
	width: fit-content;
	background-image: linear-gradient(100deg, #aa039f, #ed014d, #f67916);
	background-clip: text;
	text-fill-color: transparent;
	filter: ${({ theme }) =>
		theme.palette.mode === 'dark' ? 'contrast(30%) brightness(200%)' : 'contrast(60%) brightness(100%)'};
`

const jsonPlaceholder = `{
  "type": "claim",
  "space": "connor"
}`

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
	const [jsonInput, setJsonInput] = useState<string>('')
	const [isSigning, setIsSigning] = useState<boolean>(false)
	const [signature, setSignature] = useState<string | null>(null)
	const [signatureError, setSignatureError] = useState<string | null>(null)

	const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
	const [response, setResponse] = useState<any>()
	const [submitError, setSubmitError] = useState<string | null>(null)

	const signJson = async () => {
		if (!jsonInput?.length) return
		try {
			setIsSigning(true)
			const signature = await signWithMetaMaskV4(typedData)
			setIsSigning(false)
			if (!signature) {
				setSignatureError('Must sign in metamask!')
				return
			}

			// eslint-disable-next-line no-console
			console.log('signature', signature)
			setSignatureError(null)
			setSignature(signature)
		} catch (err: any) {
			setIsSigning(false)
			setSignatureError(err.message)
		}
	}

	const clearOutput = () => {
		setSignature(null)
		setResponse(null)
		setSignatureError(null)
		setSubmitError(null)
		setTypedData(null)
	}

	const submitRequest = async () => {
		if (!signature?.length || isSubmitting) return
		setIsSubmitting(true)

		try {
			// eslint-disable-next-line no-console
			console.log(`Issuing Tx with Params:`, {
				typedData,
				signature,
			})

			const res = await fetchSpaces('issueTx', {
				typedData,
				signature,
			})

			setIsSubmitting(false)
			setResponse(res)
		} catch (err: any) {
			console.log(`err in component`, err)
			setIsSubmitting(false)
			setSubmitError(err)
		}
	}

	const [typedData, setTypedData] = useState<any>()
	const getTypedData = async () => {
		const { typedData } = await getSuggestedFee(JSON.parse(jsonInput))
		setTypedData(typedData)
	}

	return (
		<Page>
			<Container sx={{ maxWidth: 800 }}>
				<PageTitle variant="h3" gutterBottom sx={{ mt: 3 }}>
					Hi,{' '}
					<TypewrittingInput waitBeforeDeleteMs={2000} strings={DEV_NAMES}>
						{({ currentText }) => <span>{currentText}</span>}
					</TypewrittingInput>
					!
				</PageTitle>
				<Grid container justifyContent="space-between" alignItems="flex-end">
					<Grid item>
						<SectionTitle variant="h5" gutterBottom>
							Input:
						</SectionTitle>
					</Grid>
					<Grid item>
						<Button variant="text" sx={{ py: 0, mb: 1 }} onClick={() => setJsonInput(jsonPlaceholder)}>
							Fill with sample.
						</Button>
					</Grid>
				</Grid>
				<Card sx={{ height: 300 }}>
					<JsonTextArea
						onChange={(e) => setJsonInput(e.target.value)}
						value={jsonInput}
						placeholder={jsonPlaceholder}
						sx={{ borderRadius: 4, p: 2, height: '100% !important' }}
					/>
				</Card>
				<Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
					<Button onClick={clearOutput} sx={{ mr: 4 }}>
						Reset
					</Button>
					<SignButton variant="contained" disabled={!jsonInput?.length} onClick={getTypedData}>
						Prepare for Signing
						<span style={{ marginLeft: 8 }}>👇</span>
					</SignButton>
				</Box>
				<Slide direction="up" mountOnEnter in={!!typedData}>
					<div>
						<SectionTitle variant="h5" gutterBottom>
							Typed Data:
						</SectionTitle>
						<Card sx={{ height: 400, px: 2, overflowY: 'scroll' }}>
							<pre>
								<Typography fontFamily="monospace" fontSize={12} sx={{ overflowWrap: 'anywhere', mt: 2 }}>
									{JSON.stringify(typedData, null, 2)}
								</Typography>
							</pre>
						</Card>
						<Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
							<Button onClick={clearOutput} sx={{ mr: 4 }}>
								Reset
							</Button>
							<SignButton variant="contained" disabled={!jsonInput?.length} onClick={signJson}>
								{isSigning ? (
									<Fade in={isSigning}>
										<img src={MetaMaskFoxLogo} alt="metamask-fox" height="100%" />
									</Fade>
								) : (
									<>
										Sign
										<span style={{ marginLeft: 8 }}>✍</span>
									</>
								)}
							</SignButton>
						</Box>
					</div>
				</Slide>
				<Slide direction="up" mountOnEnter in={!!signature?.length || !!signatureError?.length}>
					<div>
						<SectionTitle variant="h5" gutterBottom>
							Signature:
						</SectionTitle>
						<Card sx={{ p: 2 }}>
							{signatureError ? (
								<Typography fontFamily="monospace" fontSize={24} color="red" sx={{ overflowWrap: 'anywhere' }}>
									{signatureError}
								</Typography>
							) : (
								<Typography fontFamily="monospace" fontSize={24} sx={{ overflowWrap: 'anywhere' }}>
									{signature}
								</Typography>
							)}
						</Card>
						<Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
							<Button onClick={clearOutput} sx={{ mr: 4 }}>
								Reset
							</Button>
							<SubmitButton variant="contained" disabled={!!signatureError} onClick={submitRequest}>
								Submit
								<span style={{ marginLeft: 8 }}>🚀</span>
							</SubmitButton>
						</Box>
					</div>
				</Slide>
				<Slide direction="up" mountOnEnter in={!!response || !!submitError}>
					<div>
						<SectionTitle variant="h5" gutterBottom>
							Response:
						</SectionTitle>
						<Card sx={{ p: 2 }}>
							{submitError ? (
								<pre>
									<Typography fontFamily="monospace" fontSize={24} color="red" sx={{ overflowWrap: 'anywhere' }}>
										{JSON.stringify(submitError, null, 2)}
									</Typography>
								</pre>
							) : (
								<pre>
									<Typography fontFamily="monospace" fontSize={24} sx={{ overflowWrap: 'anywhere' }}>
										{JSON.stringify(response, null, 2)}
									</Typography>
								</pre>
							)}
						</Card>
						<Button onClick={clearOutput} sx={{ mr: 4 }}>
							Reset
						</Button>
					</div>
				</Slide>
			</Container>
		</Page>
	)
}

/**
[{"type":"string","name":"BlockID","value":"4Cwd9xZXfiBc3djER9zBpYJw6rAYHqN1s9DCpNttbyRPVdYRb"},{"type":"string","name":"Prefix","value":"connor"},{"type":"string","name":"Type","value":"claim"}]
 */
