export enum TxType {
	Claim = 'claim',
	Lifeline = 'lifeline',
	Set = 'set',
	Delete = 'delete',
	Move = 'move',
	Transfer = 'transfer',
}

export type TransactionInfo = {
	type: TxType
	space?: string
	key?: string
	value?: string
	to?: string
	units?: string
}
