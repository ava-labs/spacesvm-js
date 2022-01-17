import { Chip, SxProps, Tooltip, TooltipProps } from '@mui/material'
import { useSnackbar } from 'notistack'

import { obfuscateAddress } from '@/utils/obfuscateAddress'

type AddressChipProps = {
	address: string
	tooltipPlacement?: TooltipProps['placement']
	isMetaMaskAddress?: boolean
	sx?: SxProps
}

export const AddressChip = ({
	address,
	tooltipPlacement = 'bottom',
	sx = {},
	isMetaMaskAddress = false,
	...rest
}: AddressChipProps) => {
	const { enqueueSnackbar } = useSnackbar()

	const setClipboard = async () => {
		const type = 'text/plain'
		const blob = new Blob([address], { type })
		const data = [new ClipboardItem({ [type]: blob })]
		navigator.clipboard.write(data).then(
			() => {
				enqueueSnackbar(isMetaMaskAddress ? 'MetaMask address copied!' : 'Address copied!')
			},
			() => {
				enqueueSnackbar("Can't copy!", { variant: 'error' })
			},
		)
	}

	return (
		<Tooltip title="Copy Address" placement={tooltipPlacement}>
			<Chip sx={{ ...sx, cursor: 'pointer' }} label={obfuscateAddress(address)} onClick={setClipboard} {...rest} />
		</Tooltip>
	)
}
