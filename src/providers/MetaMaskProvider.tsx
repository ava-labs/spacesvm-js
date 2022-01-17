import { IoDownloadOutline } from 'react-icons/io5'
import MetaMaskOnboarding from '@metamask/onboarding'
import { Button } from '@mui/material'
import { useSnackbar } from 'notistack'

import { getAddressBalance, issueAndConfirmTransaction } from '@/utils/spacesVM'

declare global {
	interface Window {
		ethereum: any
	}
}

const ethereum = window.ethereum
const onboarding = new MetaMaskOnboarding()

const MetaMaskContext = createContext({} as any)

export const MetaMaskProvider = ({ children }: any) => {
	const [currentAddress, setCurrentAddress] = useState<string | undefined>()
	const [isConnectingToMM, setIsConnectingToMM] = useState(false)
	const { enqueueSnackbar, closeSnackbar } = useSnackbar()
	const metaMaskExists = useRef(ethereum !== undefined && ethereum?.isMetaMask)

	/**
	 * Update balance when changing accounts and on mount
	 */
	const [balance, setBalance] = useState<number | null>(null)
	const updateBalance = useCallback(async () => {
		if (!currentAddress) {
			setBalance(null)
			return
		}
		const response = await getAddressBalance(currentAddress)
		response?.balance && setBalance(response.balance)
	}, [currentAddress])
	useEffect(() => {
		updateBalance()
	}, [updateBalance])

	useEffect(() => {
		if (!metaMaskExists) return
		setCurrentAddress(ethereum.selectedAddress)
		// Listen for changes to the connected account selections
		return ethereum.on('accountsChanged', (accounts: any) => {
			setCurrentAddress(accounts[0])
		})
	}, [updateBalance])

	const connectToMetaMask = async () => {
		if (!metaMaskExists) {
			onboardToMetaMask()
			return
		}
		setIsConnectingToMM(true)
		try {
			const res = await ethereum.request({ method: 'eth_requestAccounts' })
			setIsConnectingToMM(false)
			return res
		} catch (err) {
			setIsConnectingToMM(false)
			enqueueSnackbar('Connect your wallet to use Spaces!', {
				variant: 'warning',
				persist: true,
				action: (
					<Button
						startIcon={<IoDownloadOutline />}
						variant="outlined"
						color="inherit"
						onClick={() => {
							closeSnackbar()
							connectToMetaMask()
						}}
						sx={{ ml: 1, mr: -1 }}
					>
						Try again
					</Button>
				),
			})
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
				<Button
					startIcon={<IoDownloadOutline />}
					variant="outlined"
					color="inherit"
					onClick={() => onboarding.startOnboarding()}
					sx={{ ml: 1, mr: -1 }}
				>
					Download MetaMask
				</Button>
			),
		})
	}, [enqueueSnackbar])

	/**
	 * Issues a transaction to spacesVM and polls the VM until the transaction is confirmed.
	 * Used for claim, lifeline, set, delete, move, and transfer
	 * https://github.com/ava-labs/spacesvm#transaction-types
	 *
	 * @param typedData typedData from getSuggestedFee
	 * @param signature signed typedData
	 * @returns if successful, response has a txId
	 */
	const issueTx = useCallback(
		async (typedData: any, signature: string) => {
			await onboardToMetaMask()
			const success = await issueAndConfirmTransaction(typedData, signature)
			updateBalance()
			return success
		},
		[updateBalance, onboardToMetaMask],
	)

	const signWithMetaMask = async (typedData: any) => {
		onboardToMetaMask()
		try {
			const accounts = await connectToMetaMask()
			console.log(`accounts`, accounts)
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

	return (
		<MetaMaskContext.Provider
			value={{
				metaMaskExists,
				currentAddress,
				balance,
				connectToMetaMask,
				isConnectingToMM,
				signWithMetaMask,
				onboardToMetaMask,
				issueTx,
			}}
		>
			{children}
		</MetaMaskContext.Provider>
	)
}

export const useMetaMask = () => useContext(MetaMaskContext)
