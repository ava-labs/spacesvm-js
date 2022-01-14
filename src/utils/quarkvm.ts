import { API_DOMAIN } from '@/constants'

const fetchQuark = async (method: string, params = {}) => {
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
}

export const pingQuark = async () => fetchQuark('ping')

export const getQuarkValue = async (prefix: string, key: string) => {
	const response = await fetchQuark('resolve', { path: `${prefix}/${key}` })
	if (!response?.exists) return
	return atob(response?.value)
}

export const getLatestBlockID = async () => {
	const blockData = await fetchQuark('lastAccepted')
	return blockData?.blockId
}

export const getPrefixInfo = async (prefix: string) => {
	const prefixData = await fetchQuark('prefixInfo', {
		prefix: btoa(
			// using `encodeURIComponent` in case someone pass non Latin1 chars like `😀` since btoa doesn't support them
			encodeURIComponent(prefix),
		),
	})
	if (!prefixData.info) return
	return prefixData.info
}

export const isAlreadyClaimed = async (prefix: string) => {
	const response = await fetchQuark('claimed', {
		prefix: btoa(
			// using `encodeURIComponent` in case someone pass non Latin1 chars like `😀` since btoa doesn't support them
			encodeURIComponent(prefix),
		),
	})
	if (!response) throw 'Unable to validate prefix'
	return response.claimed
}

// Requests for the estimated difficulty from VM.
export const estimateDifficulty = async () => await fetchQuark('difficultyEstimate')

// Checks the validity of the blockID.
// Returns "true" if the block is valid.
// TODO: check if this works...
export const getIsValidBlockId = async (blockId: string) => await fetchQuark('validBlockID', { blockId })

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

export const getAddressBalance = async (address: string) => Math.random() * 50000 // some random balance for now

// export const getAddressBalance = async (address: string) => {
// 	const response = await fetchQuark('balance', { address })
// 	if (!response) throw 'Invalid address'
// 	return response.balance
// }
