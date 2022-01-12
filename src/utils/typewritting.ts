export type TimeoutRange = number | [number, number]

const MINIMUM_THRESHOLD = 30

export const randomizeTimeout = (ms: TimeoutRange): number =>
	Array.isArray(ms)
		? // random value inside the specified min and max thresholds
		  ms[0] + Math.random() * (ms[1] - ms[0])
		: // randomize the value - with a minimum threshold
		  Math.max(Math.random() * ms, MINIMUM_THRESHOLD)
