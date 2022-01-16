export const tryNTimes = async (callbackToTry: any, times = 5, interval = 300) => {
	const delay = (ms: number): Promise<void> => new Promise<void>((resolve) => setTimeout(resolve, ms))

	if (times < 1) throw new Error(`Bad argument: 'times' must be greater than 0, but ${times} was received.`)
	let attemptCount = 0
	// eslint-disable-next-line no-constant-condition
	while (true) {
		try {
			const result = await callbackToTry()
			return result
		} catch (error) {
			if (++attemptCount >= times) throw error
		}
		await delay(interval)
	}
}
