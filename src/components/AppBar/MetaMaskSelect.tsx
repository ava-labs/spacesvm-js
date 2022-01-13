import { Button, Tooltip } from '@mui/material'
import { useSnackbar } from 'notistack'

import MetaMaskFoxLogo from '@/assets/metamask-fox.svg'

const obfuscateAddress = (str: string): string => {
	const firstChars = str.substr(0, 5)
	const lastChars = str.substr(-4)
	return `${firstChars}...${lastChars}`
}

export const MetaMaskSelect = () => {
	const { enqueueSnackbar } = useSnackbar()

	const walletAddress = '0xeB4Fc761FAb7501abe8cD04b2d831a45E8913DdC'

	const setClipboard = async (text: string) => {
		const type = 'text/plain'
		const blob = new Blob([text], { type })
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
		<Tooltip title="MetaMask address">
			<Button
				startIcon={<img src={MetaMaskFoxLogo} height={24} width={24} alt="Metamask Logo" />}
				variant="outlined"
				color="secondary"
				onClick={async () => {
					await setClipboard(walletAddress)
				}}
			>
				{obfuscateAddress(walletAddress)}
			</Button>
		</Tooltip>
	)
}
