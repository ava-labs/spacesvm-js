import { ONE_MINUTES_IN_MS } from '@/constants'

type msToTimeConfig = {
	showMs?: boolean // whether or not to show the ms after the decimal, e.g. `10.23s` vs `10s`
}

export const msToTime = (ms: number, { showMs = true }: msToTimeConfig = {}): string => {
	let seconds = ms / 1000
	// @ts-ignore
	const hours = parseInt(seconds / 3600)
	seconds = seconds % 3600
	// @ts-ignore
	const minutes = parseInt(seconds / 60)
	seconds = seconds % 60

	let finalString = ''

	if (ms < ONE_MINUTES_IN_MS) {
		if (showMs) {
			finalString +=
				String(Math.floor(seconds)) +
				'.' +
				String(Math.trunc(ms) % 1000)
					.padStart(3, '0')
					.slice(0, 2)
					.replace('-', '') +
				's'
		} else {
			finalString += String(Math.floor(seconds)) + 's'
		}
	} else {
		if (hours > 0) {
			finalString += String(hours) + 'h '
		}

		if (minutes > 0 || hours > 0) {
			if (hours > 0) {
				finalString += String(minutes).padStart(2, '0') + 'm '
			} else {
				finalString += minutes + 'm<br/>'
			}
		}

		if (seconds > 0 || minutes > 0 || hours > 0) {
			if (hours > 0) {
				//finalString += String(Math.floor(seconds)).padStart(2, '0') + 's'
			} else {
				if (minutes > 0) {
					finalString += String(Math.floor(seconds)).padStart(2, '0') + 's'
				} else {
					finalString += Math.floor(seconds) + 's'
				}
			}
		}
	}

	return finalString
}
