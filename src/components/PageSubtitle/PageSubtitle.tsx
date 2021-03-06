import { Box, Typography } from '@mui/material'

export const PageSubtitle = memo(({ children, ...rest }: any) => (
	<Box
		sx={{
			px: {
				xs: 1,
				sm: 0,
			},
		}}
	>
		<Typography color="textSecondary" variant="h6" component="h2" sx={{ fontFamily: 'DM Serif Display' }} {...rest}>
			{children}
		</Typography>
	</Box>
))
