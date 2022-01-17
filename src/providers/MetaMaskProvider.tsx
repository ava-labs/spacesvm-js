import { IoDownloadOutline } from 'react-icons/io5'
import MetaMaskOnboarding from '@metamask/onboarding'
import { Button } from '@mui/material'
import { useSnackbar } from 'notistack'

import { metaMaskExists, mmRequestAccounts } from '@/utils/metamask'
import { getAddressBalance, issueAndConfirmTransaction } from '@/utils/spacesVM'

const ethereum = window.ethereum

const MetaMaskContext = createContext({} as any)

const onboarding = new MetaMaskOnboarding()

export const MetaMaskProvider = ({ children }: any) => {
	const [currentAddress, setCurrentAddress] = useState<string | undefined>()
	const { enqueueSnackbar } = useSnackbar()

	useEffect(() => {
		if (!metaMaskExists) return
		setCurrentAddress(ethereum.selectedAddress)
		// Listen for changes to the connected account selections
		return ethereum.on('accountsChanged', (accounts: any) => {
			setCurrentAddress(accounts[0])
		})
	}, [])

	const connectToMetaMask = () => {
		mmRequestAccounts()
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
	 * Checks balance for address on Spaces VM and updates context
	 */
	const updateBalance = useCallback(async () => {
		if (!currentAddress) {
			setBalance(null)
			return
		}
		const response = await getAddressBalance(currentAddress)
		response?.balance && setBalance(response.balance)
	}, [currentAddress])

	/**
	 * Update balance when changing accounts and on mount
	 */
	const [balance, setBalance] = useState<number | null>(null)

	useEffect(() => {
		updateBalance()
	}, [updateBalance])

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
			const accounts = await mmRequestAccounts()
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
				currentAddress,
				balance,
				connectToMetaMask,
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
