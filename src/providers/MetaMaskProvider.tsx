import React, { useContext, useEffect, useState } from 'react'

import { metaMaskExists, mmRequestAccounts } from '@/utils/metamask'

const ethereum = window.ethereum

const MetaMaskContext = React.createContext({} as any)

export const MetaMaskProvider = ({ children }: any) => {
	const [accounts, setAccounts] = useState([])
	const [currentAddress, setCurrentAddress] = useState<string | undefined>()

	useEffect(() => {
		if (!metaMaskExists) return

		setCurrentAddress(ethereum.selectedAddress)

		// Listen for changes to the connected account selections
		return ethereum.on('accountsChanged', (accounts: any) => {
			setCurrentAddress(accounts[0])
		})
	}, [])

	const connectToMetaMask = async () => {
		const accounts = await mmRequestAccounts()
		setAccounts(accounts)
	}

	return (
		<MetaMaskContext.Provider
			value={{
				accounts,
				currentAddress,
				connectToMetaMask,
			}}
		>
			{children}
		</MetaMaskContext.Provider>
	)
}

export const useMetaMask = () => useContext(MetaMaskContext)
