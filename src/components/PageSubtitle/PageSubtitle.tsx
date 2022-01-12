import { memo } from 'react'
import { Box, Typography } from '@mui/material'

export const PageSubtitle = memo(({ children }) => (
	<Box
		sx={{
			px: {
				xs: 1,
				sm: 0,
				maxWidth: 500,
			},
			mb: 4,
		}}
	>
		<Typography color="textSecondary" paragraph>
			{children}
		</Typography>
	</Box>
))
