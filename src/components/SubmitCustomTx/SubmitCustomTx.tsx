import { Divider, Slide, Typography } from '@mui/material'
import { Box } from '@mui/system'

type SubmitCustomTxProps = {
	signature: string | null
}

export const SubmitCustomTx = ({ signature }: SubmitCustomTxProps) => (
	<Slide direction="up" mountOnEnter in={!!signature?.length}>
		<div>
			<Divider sx={{ my: 8 }} />

			<Typography variant="h3">Submit the tx</Typography>
		</div>
	</Slide>
)
