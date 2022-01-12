import { FC, memo } from 'react'
import { Box, useTheme } from '@mui/material'

export const Layout: FC = memo(({ children }) => {
	const theme = useTheme()

	return (
		<Box sx={{ background: theme.customPalette.customBackground }}>
			<Box
				sx={{
					p: {
						xs: 1,
						sm: 2,
					},
					display: 'flex',
					overflow: 'auto',
					height: {
						sm: 'unset',
						md: '100vh',
					},
				}}
			>
				{children}
			</Box>
		</Box>
	)
})
