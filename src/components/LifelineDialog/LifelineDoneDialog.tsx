import { Twemoji } from 'react-emoji-render'
import { Box, Button, Dialog, DialogContent, Grow, Typography } from '@mui/material'

import { DialogTitle } from '../DialogTitle'

import { rainbowText } from '@/theming/rainbowText'

type LifelineDoneDialogProps = {
	open: boolean
	onClose(): void
}

export const LifelineDoneDialog = ({ open, onClose }: LifelineDoneDialogProps) => (
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
					Lifeline extended!&nbsp;
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
