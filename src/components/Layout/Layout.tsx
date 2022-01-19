import { FC } from 'react'
import { Box, useMediaQuery, useTheme } from '@mui/material'

import { AppBar } from '../AppBar'
import { MetaMaskSelect } from '../MetaMaskSelect'

export const Layout: FC = memo(({ children }) => {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

	return (
		<Box sx={{ background: theme.customPalette.customBackground }}>
			{!window.location.href.includes('/ping') && <AppBar />}
			<Box
				id="layout"
				sx={{
					display: 'flex',
					flexDirection: 'column',
					overflow: 'auto',
					height: '100vh',
				}}
			>
				{children}
			</Box>
			{isMobile && <MetaMaskSelect onlyBalance />}
		</Box>
	)
})
