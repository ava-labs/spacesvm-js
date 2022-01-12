import { memo } from 'react'
import { Box, Typography } from '@mui/material'

export const PageTitle = memo(({ children, ...rest }: any) => (
	<Box
		sx={{
			px: {
				xs: 1,
				sm: 0,
			},
			mb: 1.5,
		}}
	>
		<Typography gutterBottom variant="h4" component="h2" {...rest}>
			{children}
		</Typography>
	</Box>
))
