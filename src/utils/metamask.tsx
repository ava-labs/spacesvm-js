import { IoDownloadOutline } from 'react-icons/io5'
import MetaMaskOnboarding from '@metamask/onboarding'
import { Button } from '@mui/material'

const onboarding = new MetaMaskOnboarding()

declare global {
	interface Window {
		ethereum: any
	}
}

const ethereum = window.ethereum

export const metaMaskExists = typeof ethereum !== undefined && ethereum?.isMetaMask

export const mmRequestAccounts = async () => {
	if (!metaMaskExists) return
	return ethereum.request({ method: 'eth_requestAccounts' })
}

export const signTransaction = async (payload: any, enqueueSnackbar: any): Promise<string | undefined> => {
	// Display an install notification if MetaMask not installed
	if (!metaMaskExists) {
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

		return
	}

	try {
		const accounts = await mmRequestAccounts()
		const signature = await ethereum.request({
			method: 'eth_signTypedData',
			params: [payload, accounts[0]],
		})
		return signature
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error)
	}
}
