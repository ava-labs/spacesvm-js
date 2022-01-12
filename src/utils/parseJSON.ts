// A wrapper for "JSON.parse()"" to support "undefined" value
export const parseJSON = <T>(value: string | null): T | undefined => {
	try {
		return value === 'undefined' ? undefined : JSON.parse(value ?? '')
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error('parsing error on', { value })
		return undefined
	}
}
