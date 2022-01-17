export const isValidWalletAddress = (address: string) => /^0x[a-fA-F0-9]{40}$/.test(address)
