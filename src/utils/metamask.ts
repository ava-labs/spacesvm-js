import MetaMaskOnboarding from '@metamask/onboarding'

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

export const ethSign = async (username: string): Promise<string | undefined> => {
	if (!metaMaskExists) return

	const msgParams = [
		{
			type: 'string',
			name: 'Username',
			value: username,
		},
	]

	try {
		const from = await mmRequestAccounts()
		const signature = await ethereum.request({
			method: 'eth_signTypedData',
			params: [msgParams, from[0]],
		})
		return signature
	} catch (error) {
		console.error(error)
	}
}
