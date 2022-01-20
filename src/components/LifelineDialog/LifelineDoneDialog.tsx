import { Twemoji } from 'react-emoji-render'
import { Dialog, Grow, Typography } from '@mui/material'

import { DialogTitle } from '@/components/DialogTitle'
import { rainbowText } from '@/theming/rainbowText'

type LifelineDoneDialogProps = {
	open: boolean
	onClose(): void
}

export const LifelineDoneDialog = ({ open, onClose }: LifelineDoneDialogProps) => (
	<Dialog open={open} maxWidth="xs" onClose={onClose} TransitionComponent={Grow}>
		<DialogTitle onClose={onClose}>
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
		</DialogTitle>
	</Dialog>
)
