import { memo } from 'react'
import { Box, Typography } from '@mui/material'

export const PageSubtitle = memo(({ children, ...rest }: any) => (
	<Box
		sx={{
			px: {
				xs: 1,
				sm: 0,
			},
			mb: 4,
		}}
	>
		<Typography color="textSecondary" variant="h6" component="h2" {...rest}>
			{children}
		</Typography>
	</Box>
))
