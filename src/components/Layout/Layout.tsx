import { FC } from 'react'
import { Box, useTheme } from '@mui/material'

import { AppBar } from '../AppBar'

export const Layout: FC = memo(({ children }) => {
	const theme = useTheme()

	return (
		<Box sx={{ background: theme.customPalette.customBackground }}>
			<AppBar />
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
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
