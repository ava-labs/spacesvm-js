import React, { useContext, useState } from 'react'

import { mmRequestAccounts } from '@/utils/metamask'

const MetaMaskContext = React.createContext({})

// type MetaMask = {
// 	accounts: string[]
// 	selectedAccount?: string
// 	currentBalance?: number
// }

export const MetaMaskProvider = ({ children }: any) => {
	const [accounts, setAccounts] = useState([])
	const [selectedAccount, setSelectedAccount] = useState<string | undefined>()

	/**
	 * Lots of legic to implement still
	 */

	const linkToMetaMask = async () => {
		const accounts = await mmRequestAccounts()
		setAccounts(accounts)
	}

	const selectAccount = (address: string) => setSelectedAccount(address)

	return (
		<MetaMaskContext.Provider
			value={{
				accounts,
				selectedAccount,
				selectAccount,
				linkToMetaMask,
			}}
		>
			{children}
		</MetaMaskContext.Provider>
	)
}

export const useMetaMask = () => useContext(MetaMaskContext)
