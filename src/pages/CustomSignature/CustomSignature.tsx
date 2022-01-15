import {
	Button,
	Card,
	CircularProgress,
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
import { fetchSpaces, getLatestBlockID } from '@/utils/quarkvm'
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

const SectionTitle = styled(Typography)`
	width: fit-content;
	background-image: linear-gradient(100deg, #aa039f, #ed014d, #f67916);
	background-clip: text;
	text-fill-color: transparent;
	filter: ${({ theme }) =>
		theme.palette.mode === 'dark' ? 'contrast(30%) brightness(200%)' : 'contrast(60%) brightness(100%)'};
`

const jsonPlaceholder = `{
  "types": {
    "Claim": [
      {
        "name": "space",
        "type": "string"
      },
      {
        "name": "price",
        "type": "uint64"
      },
      {
        "name": "blockID",
        "type": "string"
      }
    ],
    "EIP712Domain": [
      {
        "name": "name",
        "type": "string"
      },
      {
        "name": "magic",
        "type": "uint64"
      }
    ]
  },
  "primaryType": "Claim",
  "domain": {
    "name": "Spaces",
    "magic": "1"
  },
  "message": {
    "blockID": "YRiMVk2mjmdAoFQ7kkksu6BzJG48nBZxx68xJfY6hnWRZ1oPU",
    "price": "1",
    "space": "connoraf"
  }
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
		clearOutput()
		try {
			const parsedJson = JSON.parse(jsonInput)
			console.log(`parsedJson`, parsedJson)
			setIsSigning(true)
			const signature = await signWithMetaMaskV4(parsedJson)
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
	}

	const submitRequest = async () => {
		if (!signature?.length || isSubmitting) return
		setIsSubmitting(true)

		try {
			const res = await fetchSpaces('issueTx', {
				typedData: jsonInput,
				signature,
			})

			setIsSubmitting(false)
			setResponse(res)
		} catch (err: any) {
			setIsSubmitting(false)
			setSubmitError(err.message)
		}
	}

	const setSampleJson = async () => {
		try {
			const latestBlockId = await getLatestBlockID()
			const sampleData = JSON.parse(jsonPlaceholder)
			const sampleDataWithLatestBlock = {
				...sampleData,
				message: {
					...sampleData.message,
					blockID: latestBlockId,
				},
			}
			const sampleJson = JSON.stringify(sampleDataWithLatestBlock, null, 2)
			setJsonInput(sampleJson)
		} catch (err) {
			// eslint-disable-next-line no-console
			console.error(err)
			setJsonInput(jsonPlaceholder)
		}
	}

	return (
		<Page>
			<PageTitle variant="h3" gutterBottom sx={{ mt: 3 }}>
				Hi,{' '}
				<TypewrittingInput waitBeforeDeleteMs={2000} strings={DEV_NAMES}>
					{({ currentText }) => <span>{currentText}</span>}
				</TypewrittingInput>
				!
			</PageTitle>
			<Grid container sx={{ width: '100%', height: '100%', minHeight: 200 }} spacing={4}>
				<Grid item md={4} xs={12} sx={{ position: 'relative' }}>
					<SignButton
						variant="contained"
						disabled={!jsonInput?.length}
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
							<Typography variant="h6" gutterBottom>
								Input:
							</Typography>
						</Grid>
						<Grid item>
							<Tooltip title="We'll automagically include the latest Block ID ✨" placement="top">
								<Button variant="text" sx={{ py: 0, mb: 1 }} onClick={setSampleJson}>
									Fill with sample.
								</Button>
							</Tooltip>
						</Grid>
					</Grid>
					<JsonTextArea
						onChange={(e) => setJsonInput(e.target.value)}
						value={jsonInput}
						placeholder={jsonPlaceholder}
						sx={{ borderRadius: 4, pt: 2, pr: 2, pl: 2, pb: 20, height: '100% !important' }}
					/>
				</Grid>
				<Grid item md={8} xs={12}>
					<Grid container justifyContent="space-between" alignItems="end">
						<Grid item>
							<Typography variant="h6" gutterBottom>
								Output:
							</Typography>
						</Grid>
						{(!!signature || !!signatureError || !!response || !!submitError) && (
							<Grid item>
								<Button variant="text" sx={{ py: 0, mb: 1 }} onClick={clearOutput}>
									Clear output.
								</Button>
							</Grid>
						)}
					</Grid>

					<Card sx={{ height: '100%', width: '100%', p: 2, overflow: 'auto' }}>
						<Fade mountOnEnter in={!!(signature?.length || signatureError?.length)}>
							<div>
								{signatureError && (
									<Typography color="red" fontFamily="monospace">
										{signatureError}
									</Typography>
								)}
								{signature && (
									<>
										<SectionTitle variant="h6" gutterBottom>
											Signature:
										</SectionTitle>
										<Typography fontFamily="monospace" sx={{ overflowWrap: 'anywhere' }}>
											{signature}
										</Typography>
									</>
								)}
							</div>
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
										my: 2,
									}}
									onClick={() => submitRequest()}
								>
									{isSubmitting ? (
										<CircularProgress color="inherit" />
									) : (
										<>
											Submit <span style={{ marginLeft: 8 }}>🚀</span>
										</>
									)}
								</SubmitButton>
							</div>
						</Slide>
						<Slide direction="up" mountOnEnter in={!!(response || submitError)}>
							<Box sx={{ maxHeight: 0, pb: 2 }}>
								<SectionTitle variant="h6" gutterBottom>
									Response:
								</SectionTitle>
								{submitError ? (
									<Typography fontFamily="monospace" color="red" sx={{ overflowWrap: 'anywhere', mt: 2 }}>
										{submitError}
									</Typography>
								) : (
									<>
										<pre>
											<Typography fontFamily="monospace" sx={{ overflowWrap: 'anywhere', mt: 2 }}>
												{JSON.stringify(response, null, 2)}
											</Typography>
										</pre>
										<Divider sx={{ mt: 20 }} />
									</>
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
