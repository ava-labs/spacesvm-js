import { Chip, SxProps, Tooltip, TooltipProps } from '@mui/material'
import { useSnackbar } from 'notistack'

import { obfuscateAddress } from '@/utils/obfuscateAddress'
import { setClipboard } from '@/utils/setClipboard'

type AddressChipProps = {
	address: string
	tooltipPlacement?: TooltipProps['placement']
	isMetaMaskAddress?: boolean
	sx?: SxProps
	copyText?: string
	copySuccessText?: string
	isObfuscated?: boolean
}

export const AddressChip = ({
	address,
	copyText = 'Copy address',
	copySuccessText = 'Address copied!',
	tooltipPlacement = 'bottom',
	sx = {},
	isObfuscated = true,
	isMetaMaskAddress = false,
	...rest
}: AddressChipProps) => {
	const { enqueueSnackbar } = useSnackbar()

	return (
		<Tooltip title={copyText} placement={tooltipPlacement}>
			<Chip
				sx={{ ...sx, cursor: 'pointer' }}
				label={isObfuscated ? obfuscateAddress(address) : address}
				onClick={() => {
					setClipboard({
						value: address,
						onSuccess: () => enqueueSnackbar(isMetaMaskAddress ? 'MetaMask address copied!' : copySuccessText),
						onFailure: () => enqueueSnackbar("Can't copy!", { variant: 'error' }),
					})
				}}
				{...rest}
			/>
		</Tooltip>
	)
}
