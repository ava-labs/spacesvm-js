import { getLatestBlockID } from './quarkvm'

enum Method {
	CLAIM = 'claim',
	SET = 'set',
	TRANSFER = 'transfer',
	LIFELINE = 'lifeline',
}

export const getClaimPayload = async (prefix: string) => {
	const blockId = await getLatestBlockID()
	return [
		{
			type: 'string',
			name: 'BlockID',
			value: blockId,
		},
		{
			type: 'string',
			name: 'Prefix',
			value: prefix,
		},
		{
			type: 'string',
			name: 'Type',
			value: Method.CLAIM,
		},
	]
}

export const getSetPayload = async (prefix: string, key: string, value: string) => {
	const blockId = await getLatestBlockID()
	return [
		{
			type: 'string',
			name: 'BlockID',
			value: blockId,
		},
		{
			type: 'string',
			name: 'Prefix',
			value: prefix,
		},
		{
			type: 'string',
			name: 'Type',
			value: Method.SET,
		},
		{
			type: 'string',
			name: 'Key',
			value: key,
		},
		{
			type: 'string',
			name: 'Value',
			value: value,
		},
	]
}

export const getTransferPayload = async (prefix: string, to: string, value: string) => {
	const blockId = await getLatestBlockID()
	return [
		{
			type: 'string',
			name: 'BlockID',
			value: blockId,
		},
		{
			type: 'string',
			name: 'Prefix',
			value: prefix,
		},
		{
			type: 'string',
			name: 'Type',
			value: Method.TRANSFER,
		},
		{
			type: 'string',
			name: 'To',
			value: to,
		},
		{
			type: 'string',
			name: 'Value',
			value: value,
		},
	]
}

export const getLifelinePayload = async (prefix: string) => {
	const blockId = await getLatestBlockID()
	return [
		{
			type: 'string',
			name: 'BlockID',
			value: blockId,
		},
		{
			type: 'string',
			name: 'Prefix',
			value: prefix,
		},
		{
			type: 'string',
			name: 'Type',
			value: Method.LIFELINE,
		},
	]
}
