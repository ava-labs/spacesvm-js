import { memo } from 'react'
import { Box, Typography } from '@mui/material'

export const PageTitle = memo(({ children, sx = {}, ...rest }: any) => (
	<Box
		sx={{
			px: {
				xs: 1,
				sm: 0,
			},
			mb: 1.5,
			...sx,
		}}
	>
		<Typography variant="h3" component="h2" sx={{ fontFamily: 'DM Serif Display' }} {...rest}>
			{children}
		</Typography>
	</Box>
))
