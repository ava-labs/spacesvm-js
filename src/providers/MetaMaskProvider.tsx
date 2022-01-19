import { isAndroid, isIOS } from 'react-device-detect'
import { IoArrowRedo, IoCloseCircleOutline, IoDownloadOutline } from 'react-icons/io5'
import MetaMaskOnboarding from '@metamask/onboarding'
import { Button, IconButton, Tooltip } from '@mui/material'
import throttle from 'lodash/throttle'
import { useSnackbar } from 'notistack'

import { APP_NAME } from '@/constants'
import { getAddressBalance, isConnectedToSpacesVM, issueAndConfirmTransaction } from '@/utils/spacesVM'

declare global {
	interface Window {
		ethereum: any
	}
}

const GOOGLE_PLAY_MM_LINK = 'https://play.google.com/store/apps/details?id=io.metamask'
const APPLE_STORE_MM_LINK = 'https://apps.apple.com/us/app/metamask-blockchain-wallet/id1438144202'

const ethereum = window.ethereum
const onboarding = new MetaMaskOnboarding()

const MetaMaskContext = createContext({} as any)

const throttledCheckSpacesConnection = throttle(isConnectedToSpacesVM, 1000)

export const MetaMaskProvider = ({ children }: any) => {
	const [currentAddress, setCurrentAddress] = useState<string | undefined>()
	const [isConnectingToMM, setIsConnectingToMM] = useState(false)
	const { enqueueSnackbar, closeSnackbar } = useSnackbar()
	const [metaMaskExists, setMetaMaskExists] = useState(ethereum !== undefined && ethereum?.isMetaMask)
	const [isConnectedToSpaces, setIsConnectedToSpaces] = useState(true)
	const [balance, setBalance] = useState<number | null>(null)

	/**
	 * Update balance when changing accounts and on mount
	 */
	const updateBalance = useCallback(async () => {
		if (!currentAddress || !isConnectedToSpaces) {
			setBalance(null)
			return
		}
		const response = await getAddressBalance(currentAddress)
		response?.balance !== undefined && setBalance(response.balance)
	}, [currentAddress, isConnectedToSpaces])
	useEffect(() => {
		updateBalance()
		const balanceUpdateInterval = setInterval(updateBalance, 10000) // Poll for latest balance every 10s
		return () => clearInterval(balanceUpdateInterval)
	}, [updateBalance])

	/**
	 * Set up ethereum account change listener
	 */
	useEffect(() => {
		if (!metaMaskExists) return
		setCurrentAddress(ethereum.selectedAddress)
		// Listen for changes to the connected account selections
		return ethereum.on('accountsChanged', (accounts: string[]) => {
			setCurrentAddress(accounts[0])
		})
	}, [updateBalance, metaMaskExists])

	/**
	 * Listen for ethereum initalization in browser
	 */
	useEffect(() => {
		const handleEthereum = () => setMetaMaskExists(!!ethereum?.isMetaMask)
		setTimeout(handleEthereum, 3000) // If ethereum isn't installed after 3 seconds then MM probably isn't installed.
		return window.addEventListener('ethereum#initialized', handleEthereum, { once: true })
	}, [])

	/**
	 * Connects to MM if not already connected, and returns the connected account
	 */
	const connectToMetaMask = async (): Promise<string[]> => {
		if (!metaMaskExists) {
			onboardToMetaMask()
			return []
		}

		setIsConnectingToMM(true)
		try {
			const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
			setCurrentAddress(accounts[0])
			setIsConnectingToMM(false)
			return accounts
		} catch (err) {
			setIsConnectingToMM(false)
			enqueueSnackbar(`Connect your wallet to use ${APP_NAME}!`, {
				variant: 'warning',
				persist: true,
				action: (
					<>
						<Button
							startIcon={<IoArrowRedo />}
							variant="outlined"
							color="inherit"
							onClick={() => {
								closeSnackbar()
								connectToMetaMask()
							}}
						>
							Try again
						</Button>
						<Tooltip title="Dismiss">
							<IconButton onClick={() => closeSnackbar()}>
								<IoCloseCircleOutline />
							</IconButton>
						</Tooltip>
					</>
				),
			})
			return []
		}
	}

	/**
	 * If MM not installed, prompt user to do so.
	 */
	const onboardToMetaMask = useCallback(async () => {
		if (metaMaskExists) return
		enqueueSnackbar('MetaMask needs to be installed.', {
			variant: 'warning',
			persist: true,
			action: (
				<>
					<Button
						startIcon={<IoDownloadOutline />}
						variant="outlined"
						color="inherit"
						href={isIOS ? APPLE_STORE_MM_LINK : isAndroid ? GOOGLE_PLAY_MM_LINK : 'javascript:void(0)'}
						onClick={() => {
							if (isIOS || isAndroid) return
							onboarding.startOnboarding()
						}}
					>
						Download MetaMask
					</Button>
					<Tooltip title="Dismiss">
						<IconButton onClick={() => closeSnackbar()}>
							<IoCloseCircleOutline />
						</IconButton>
					</Tooltip>
				</>
			),
		})
	}, [enqueueSnackbar, metaMaskExists, closeSnackbar])

	/**
	 * Issues a transaction to spacesVM and polls the VM until the transaction is confirmed.
	 * Used for claim, lifeline, set, delete, move, and transfer
	 * https://github.com/ava-labs/spacesvm#transaction-types
	 *
	 * @param typedData typedData from getSuggestedFee
	 * @param signature signed typedData
	 * @returns boolean - whether transaction issuing was successful
	 */
	const issueTx = useCallback(
		async (typedData: any, signature: string) => {
			if (!metaMaskExists) {
				onboardToMetaMask()
				return
			}
			const success = await issueAndConfirmTransaction(typedData, signature)
			updateBalance()
			return success
		},
		[updateBalance, onboardToMetaMask, metaMaskExists],
	)

	/**
	 * Signs a typed data payload.  The signature is needed to issue transactions to SpacesVM
	 *
	 * @param typedData from getSuggestedFee
	 * @returns signature
	 */
	const signWithMetaMask = async (typedData: any): Promise<string | undefined> => {
		if (!metaMaskExists) {
			onboardToMetaMask()
			return
		}
		try {
			const accounts = await connectToMetaMask()
			const signature = await ethereum.request({
				method: 'eth_signTypedData_v4',
				params: [accounts[0], JSON.stringify(typedData)],
			})
			return signature
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(error)
		}
	}

	const checkSpacesConnection = async () => {
		const isConnected = await throttledCheckSpacesConnection()
		if (isConnected === undefined) return // check was throttled
		setIsConnectedToSpaces(isConnected)
	}
	useEffect(() => {
		checkSpacesConnection()
	}, [])

	return (
		<MetaMaskContext.Provider
			value={{
				metaMaskExists,
				currentAddress,
				balance,
				connectToMetaMask,
				isConnectingToMM,
				signWithMetaMask,
				issueTx,
				checkSpacesConnection,
				isConnectedToSpaces,
			}}
		>
			{children}
		</MetaMaskContext.Provider>
	)
}

export const useMetaMask = () => useContext(MetaMaskContext)
