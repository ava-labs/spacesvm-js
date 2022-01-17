export const calculateClaimCost = (p: string): number => {
	const ClaimTier1Size = 12
	const ClaimTier2Size = 36
	const ClaimTier1Multiplier = 25
	const ClaimTier2Multiplier = 5
	const ClaimTier3Multiplier = 1
	const desirability = 256 - p.length

	if (p.length > ClaimTier2Size) {
		return desirability * ClaimTier3Multiplier
	}

	if (p.length > ClaimTier1Size) {
		return desirability * ClaimTier2Multiplier
	}

	return desirability * ClaimTier1Multiplier
}

export const TRANSFER_COST = 1
