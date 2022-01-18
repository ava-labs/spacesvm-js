import { addSeconds, format, formatDistance } from 'date-fns'

export const TRANSFER_COST = 1

const SPACE_DESIRABILITY_MULTIPLIER = 5
const MIN_CLAIM_FEE = 100
const MAX_SPACE_NAME_LENGTH = 256
export const getSpaceNameUnits = (spaceName: string): number => {
	const desirability = (MAX_SPACE_NAME_LENGTH - spaceName.length) * SPACE_DESIRABILITY_MULTIPLIER
	return Math.max(desirability, MIN_CLAIM_FEE)
}

export const calculateClaimCost = (spaceName: string): number => 5 + getSpaceNameUnits(spaceName)

const LIFELINE_BASE_COST = 5
export const calculateLifelineCost = (spaceName: string, extendUnits: number): number =>
	extendUnits * (getSpaceNameUnits(spaceName) / 10) + LIFELINE_BASE_COST

// 1 unit in lifelineTx == DefaultFreeClaimDuration * DefaultFreeClaimUnits
const DEFAULT_FREE_CLAIM_DURATION = 60 * 60 * 24 * 30 // 30 days
const DEFAULT_FREE_CLAIM_UNITS = 1000 // 1MiB/1KiB
export const HOURS_PER_LIFELINE_UNIT = DEFAULT_FREE_CLAIM_DURATION * DEFAULT_FREE_CLAIM_UNITS

export const getLifelineExtendedSeconds = (extendUnits: number, spaceUnits: number) =>
	extendUnits * (HOURS_PER_LIFELINE_UNIT / spaceUnits)

// Pretty date that represents the amount of time that will be extended
export const getDisplayLifelineTime = (extendUnits: number, spaceUnits: number) =>
	formatDistance(new Date(), addSeconds(new Date(), getLifelineExtendedSeconds(extendUnits, spaceUnits)))

// Pretty date that represents the exact date it will be extended to
export const getExtendToTime = (extendUnits: number, spaceUnits: number, existingExpiry: number) =>
	format(addSeconds(new Date(existingExpiry * 1000), getLifelineExtendedSeconds(extendUnits, spaceUnits)), 'MM/dd/yyyy')
