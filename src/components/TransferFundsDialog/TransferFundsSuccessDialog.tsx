import { Twemoji } from 'react-emoji-render'
import { Box, Button, Dialog, DialogContent, DialogTitle, Grow, Typography } from '@mui/material'

import { rainbowText } from '@/theming/rainbowText'

type TransferFundsSuccessDialogProps = {
	open: boolean
	onClose(): void
}

export const TransferFundsSuccessDialog = ({ open, onClose }: TransferFundsSuccessDialogProps) => (
	<Dialog open={open} maxWidth="xs" onClose={onClose} TransitionComponent={Grow}>
		<DialogTitle>
			<Box sx={{ pt: 1, display: 'flex', justifyContent: 'center' }}>
				<Typography
					variant="h3"
					align="center"
					sx={{
						...rainbowText,
					}}
				>
					Funds sent!&nbsp;
					<Twemoji svg text=":tada:" />
				</Typography>
			</Box>
		</DialogTitle>
		<DialogContent>
			<Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
				<Button color="secondary" size="small" variant="outlined" onClick={onClose} sx={{ display: 'flex' }}>
					Close
				</Button>
			</Box>
		</DialogContent>
	</Dialog>
)
