import { Box, Typography } from '@mui/material'

import { rainbowText } from '@/theming/rainbowText'

export const PageTitle = memo(({ isRainbow = false, children, sx = {}, ...rest }: any) => (
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
		<Typography
			variant="h3"
			component="h2"
			sx={{ fontFamily: 'DM Serif Display', ...(isRainbow && { ...rainbowText }) }}
			{...rest}
		>
			{children}
		</Typography>
	</Box>
))
