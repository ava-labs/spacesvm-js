import { Twemoji } from 'react-emoji-render'
import { GoArrowRight } from 'react-icons/go'
import { Box, Button, Dialog, DialogContent, Grow, Typography } from '@mui/material'

import { AddressChip } from '../AddressChip/AddressChip'
import { DialogTitle } from '../DialogTitle'

import { rainbowText } from '@/theming/rainbowText'
import { numberWithCommas } from '@/utils/numberUtils'

type TransferFundsSuccessDialogProps = {
	open: boolean
	onClose(): void
	transferAmount: number
	toAddress: string
}

export const TransferFundsSuccessDialog = ({
	open,
	onClose,
	transferAmount,
	toAddress,
}: TransferFundsSuccessDialogProps) => (
	<Dialog open={open} maxWidth="xs" onClose={onClose} TransitionComponent={Grow}>
		<DialogTitle onClose={onClose}>
			<Box sx={{ pt: 1, display: 'flex', justifyContent: 'center' }}>
				<Typography
					variant="h3"
					align="center"
					sx={{
						...rainbowText,
					}}
				>
					{numberWithCommas(transferAmount)} SPC sent!&nbsp;
				</Typography>
			</Box>
		</DialogTitle>
		<DialogContent>
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
				<Typography variant="body1">&nbsp; To: &nbsp;</Typography>
				<AddressChip address={toAddress} />
			</Box>
		</DialogContent>
	</Dialog>
)
