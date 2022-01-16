import { API_DOMAIN } from '@/constants'

export const fetchSpaces = async (method: string, params = {}) => {
	try {
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

export const isConnectedToSpacesVM = async () => {
	try {
		const { success } = await fetchSpaces('ping')
		return success
	} catch {
		return false
	}
}

export type SpaceKeyValue = {
	key: string
	value: string
}

export const querySpace = async (space: string) => {
	try {
		const response = await fetchSpaces('info', {
			space,
		})
		return {
			...response,
			values: response.values.map(({ key, value }: SpaceKeyValue) => ({ key, value: atob(value) })),
		}
	} catch (err) {
		return
	}
}

export const querySpaceKey = async (prefix: string, key: string) => {
	const response = await fetchSpaces('resolve', { path: `${prefix}/${key}` })
	if (!response?.exists) return
	return atob(response?.value)
}

export const getLatestBlockID = async () => {
	const blockData = await fetchSpaces('lastAccepted')
	return blockData?.blockId
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

export enum TxType {
	Claim = 'claim',
	Lifeline = 'lifeline',
	Set = 'set',
	Delete = 'delete',
	Move = 'move',
	Transfer = 'transfer',
}

type TransactionInfo = {
	type: TxType
	space?: string
	key?: string
	value?: string
	to?: string
	units?: string
}

export const getSuggestedFee = async (transactionInfo: TransactionInfo) =>
	await fetchSpaces('suggestedFee', { input: transactionInfo })

export const claimSpace = async (typedData: any, signature: string) => {
	console.log(`typedData, signature`, typedData, signature)
	const res = await fetchSpaces('issueTx', { typedData, signature })
	console.log(`res`, res)
}
