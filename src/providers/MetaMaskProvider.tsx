import { IoDownloadOutline } from 'react-icons/io5'
import MetaMaskOnboarding from '@metamask/onboarding'
import { Button } from '@mui/material'
import { useSnackbar } from 'notistack'

import { metaMaskExists, mmRequestAccounts } from '@/utils/metamask'
import { getAddressBalance } from '@/utils/quarkvm'

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

	const onboardToMetaMask = async () => {
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
	}

	const [balance, setBalance] = useState<number | null>(null)
	useEffect(() => {
		if (!currentAddress) {
			setBalance(null)
			return
		}
		const getBalance = async () => {
			const response = await getAddressBalance(currentAddress)
			response?.balance && setBalance(response.balance)
		}
		getBalance()
	}, [currentAddress])

	return (
		<MetaMaskContext.Provider
			value={{
				currentAddress,
				balance,
				connectToMetaMask,
				onboardToMetaMask,
			}}
		>
			{children}
		</MetaMaskContext.Provider>
	)
}

export const useMetaMask = () => useContext(MetaMaskContext)
