import { Button, Tooltip } from '@mui/material'
import { useSnackbar } from 'notistack'

import MetaMaskFoxLogo from '@/assets/metamask-fox.svg'
import { useMetaMask } from '@/providers/MetaMaskProvider'

const obfuscateAddress = (str: string): string => {
	const firstChars = str.substr(0, 5)
	const lastChars = str.substr(-4)
	return `${firstChars}...${lastChars}`
}

export const MetaMaskSelect = () => {
	const { enqueueSnackbar } = useSnackbar()

	const { currentAddress, connectToMetaMask } = useMetaMask()

	const handleMetaMaskClick = () => {
		if (!currentAddress) {
			connectToMetaMask()
			return
		}
		setClipboard()
	}

	const setClipboard = async () => {
		const type = 'text/plain'
		const blob = new Blob([currentAddress], { type })
		const data = [new ClipboardItem({ [type]: blob })]

		navigator.clipboard.write(data).then(
			() => {
				enqueueSnackbar('MetaMask address copied!')
			},
			() => {
				enqueueSnackbar("Can't copy!", { variant: 'error' })
			},
		)
	}

	return (
		<Tooltip title={currentAddress ? 'Copy address' : 'Connect to MetaMask'}>
			<Button
				startIcon={<img src={MetaMaskFoxLogo} height={24} width={24} alt="Metamask Logo" />}
				variant="outlined"
				color="secondary"
				onClick={handleMetaMaskClick}
			>
				{currentAddress ? obfuscateAddress(currentAddress) : 'Connect'}
			</Button>
		</Tooltip>
	)
}
