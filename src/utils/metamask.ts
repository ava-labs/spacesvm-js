declare global {
	interface Window {
		ethereum: any
	}
}

const ethereum = window.ethereum

export const metaMaskExists = typeof ethereum !== undefined && ethereum.isMetaMask

export const mmRequestAccounts = async () => {
	if (!metaMaskExists) return
	return ethereum.request({ method: 'eth_requestAccounts' })
}

export const signTransaction = async (payload: any): Promise<string | undefined> => {
	if (!metaMaskExists) return
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
