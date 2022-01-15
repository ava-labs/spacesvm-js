import { API_DOMAIN } from '@/constants'

export const fetchQuark = async (method: string, params = {}) => {
	try {
		const response = await fetch(`${API_DOMAIN}/public`, {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({
				jsonrpc: '2.0',
				method: `quarkvm.${method}`,
				params,
				id: 1,
			}),
		})
		const reader = response.body?.getReader()
		const encodedData = await reader?.read()
		const data = JSON.parse(new TextDecoder().decode(encodedData?.value))
		if (data.error) throw data.error
		return data?.result
	} catch (err) {
		// console.error(err)
		return
	}
}

export const fetchSpaces = async (method: string, params = {}) => {
	try {
		const response = await fetch(`${API_DOMAIN}/public`, {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({
				jsonrpc: '2.0',
				method: `spacesvm.${method}`,
				params,
				id: 1,
			}),
		})
		const reader = response.body?.getReader()
		const encodedData = await reader?.read()
		if (encodedData?.value === undefined) return
		const data = JSON.parse(new TextDecoder().decode(encodedData?.value))
		if (data.error) throw data.error
		return data?.result
	} catch (err) {
		console.error(err)
	}
}

export const pingSpaces = async () => fetchSpaces('ping')

export const getQuarkValue = async (prefix: string, key: string) => {
	const response = await fetchSpaces('resolve', { path: `${prefix}/${key}` })
	if (!response?.exists) return
	return atob(response?.value)
}

export const getLatestBlockID = async () => {
	const blockData = await fetchSpaces('lastAccepted')
	return blockData?.blockId
}

export const getPrefixInfo = async (space: string) => {
	const spaceData = await fetchSpaces('info', {
		space,
	})
	console.log(`spaceData`, spaceData)
	if (!spaceData?.info) return
	return spaceData.info
}

export const isAlreadyClaimed = async (space: string) => {
	const response = await fetchSpaces('claimed', {
		space,
	})
	if (!response) throw 'Unable to validate space'
	return response.claimed
}

// Requests for the estimated difficulty from VM.
export const estimateDifficulty = async () => await fetchSpaces('difficultyEstimate')

// Checks the validity of the blockID.
// Returns "true" if the block is valid.
// TODO: check if this works...
export const getIsValidBlockId = async (blockId: string) => await fetchSpaces('validBlockID', { blockId })

// Checks the status of the transaction, and returns "true" if confirmed.
export const getIsTxConfirmed = async (txId: string) => {
	const data = await fetchQuark('checkTx', { TxID: txId })
	return data.confirmed
}

// export const claimPrefix = async (signature: string, prefix: string) => {
// 	const message = await getClaimPayload(prefix)
// 	return await fetchQuark('issueTxHR', { signature, message: atob(message) })
// }

// export const setKeyValue = async (signature: string, prefix: string, key: string, value: string) => {
// 	const message = await getSetPayload(prefix, key, value)
// 	return await fetchQuark('issueTxHR', { signature, message: atob(message) })
// }

// export const transfer = async (signature: string, prefix: string, to: string, value: string) => {
// 	const message = await getTransferPayload(prefix, to, value)
// 	return await fetchQuark('issueTxHR', { signature, message: atob(message) })
// }

// export const lifeline = async (signature: string, prefix: string) => {
// 	const message = await getLifelinePayload(prefix)
// 	return await fetchQuark('issueTxHR', { signature, message: atob(message) })
// }

export const getAddressBalance = async (address: string) => fetchSpaces('balance', { address }) // some random balance for now

// export const getAddressBalance = async (address: string) => {
// 	const response = await fetchQuark('balance', { address })
// 	if (!response) throw 'Invalid address'
// 	return response.balance
// }
