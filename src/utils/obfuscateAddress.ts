export const obfuscateAddress = (str?: string): string => {
	if (str) {
		const firstChars = str.substr(0, 5)
		const lastChars = str.substr(-4)
		return `${firstChars}...${lastChars}`
	}

	return ''
}
