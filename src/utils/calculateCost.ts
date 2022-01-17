export const TRANSFER_COST = 1

const SPACE_DESIRABILITY_MULTIPLIER = 5
const MIN_CLAIM_FEE = 100
const MAX_IDENTIFIER_SIZE = 256
export const getSpaceNameUnits = (spaceName: string): number => {
	const desirability = (MAX_IDENTIFIER_SIZE - spaceName.length) * SPACE_DESIRABILITY_MULTIPLIER
	return Math.max(desirability, MIN_CLAIM_FEE)
}

export const calculateClaimCost = (spaceName: string): number => 5 + getSpaceNameUnits(spaceName)
// export const calculateLifelineCost = (spaceName: string): number => 5 + getSpaceNameUnits(spaceName) / 10
