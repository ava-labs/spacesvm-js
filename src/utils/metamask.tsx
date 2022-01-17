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
