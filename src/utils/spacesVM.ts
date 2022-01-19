import { b64_to_utf8, utf8_to_b64 } from './encoding'
import { tryNTimes } from './tryNTimes'

import { API_DOMAIN } from '@/constants'
import { TransactionInfo } from '@/types'

export const fetchSpaces = async (method: string, params = {}) => {
	const response = await fetch(`${API_DOMAIN}`, {
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

	// Recursively read file chunks until done
	const reader = response.body?.getReader()
	const decoder = new TextDecoder()
	let decodedResult = ''
	const processChunk = async ({ done, value }: any) => {
		if (done) return
		decodedResult += decoder.decode(value)
		await reader?.read().then(processChunk)
	}
	await reader?.read().then(processChunk)

	const data = JSON.parse(decodedResult)
	if (data.error) throw data.error
	return data?.result
}

/**
 * Pings SpacesVM returns whether connected or not
 */
export const isConnectedToSpacesVM = async (): Promise<boolean> => {
	try {
		const { success } = await fetchSpaces('ping')
		return success
	} catch {
		return false
	}
}

export const querySpace = async (space: string) => {
	try {
		return await fetchSpaces('info', {
			space,
		})
	} catch (err) {
		// eslint-disable-next-line no-console
		console.log(`err`, err)
		return
	}
}

export const querySpaceKey = async (space: string, key: string) => {
	const keyData = await fetchSpaces('resolve', { path: `${space}/${key}` })
	return {
		...keyData,
		value: keyData?.value && b64_to_utf8(keyData.value),
	}
}

export const getLatestBlockID = async () => {
	const blockData = await fetchSpaces('lastAccepted')
	return blockData?.blockId
}

export const getLatestActivity = async () => {
	const activity = await fetchSpaces('recentActivity')

	return activity
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

export const getAddressBalance = async (address: string) => fetchSpaces('balance', { address }) // some random balance for now

/**
 * Query spacesVM to get the fee for a transaction, and the typedData that needs to be signed
 * in orde to submit the transaction
 *
 * @param transactionInfo Object containing type, space, units, key, value, and to (some optional)
 * @returns Object wit
 */
export const getSuggestedFee = async (transactionInfo: TransactionInfo) => {
	const input = { ...transactionInfo }
	if (transactionInfo.value) {
		input.value = utf8_to_b64(transactionInfo.value)
	}
	return await fetchSpaces('suggestedFee', { input })
}

/**
 * Issues a transaction to spacesVM and polls the VM until the transaction is confirmed.
 * Used for claim, lifeline, set, delete, move, and transfer
 * https://github.com/ava-labs/spacesvm#transaction-types
 *
 * @param typedData typedData from getSuggestedFee
 * @param signature signed typedData
 * @returns if successful, response has a txId
 */
export const issueAndConfirmTransaction = async (typedData: any, signature: string): Promise<boolean> => {
	const txResponse = await fetchSpaces('issueTx', { typedData, signature })
	if (!txResponse?.txId) return false

	const checkIsAccepted = async () => {
		try {
			const { accepted } = await fetchSpaces('hasTx', { txId: txResponse.txId })
			if (accepted) return true
			throw 'Transaction has not yet been accepted.'
		} catch (error) {
			throw 'Failed to fetch.'
		}
	}

	try {
		const response = await tryNTimes(checkIsAccepted, 20, 500)
		if (response) return true
	} catch {
		return false
	}
	return false
}
