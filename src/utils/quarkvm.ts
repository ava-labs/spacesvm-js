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
	return JSON.parse(new TextDecoder().decode(encodedData?.value))?.result
}

export const getQuarkValue = async (prefix: string, key: string) => {
	const response = await fetchQuark('resolve', { path: `${prefix}/${key}` })
	return atob(response?.value)
}

export const getLatestBlockID = async () => {
	const blockData = await fetchQuark('lastAccepted')
	return blockData?.blockId
}

export const getPrefixInfo = async (prefix: string) => {
	const prefixData = await fetchQuark('prefixInfo', { prefix: btoa(prefix) })
	if (!prefixData.info) return
	return prefixData
}
