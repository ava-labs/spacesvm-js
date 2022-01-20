import { FC } from 'react'
import { Box, useMediaQuery, useTheme } from '@mui/material'

import { AppBar } from '@/components/AppBar'
import { MetaMaskSelect } from '@/components/MetaMaskSelect'

export const Layout: FC = memo(({ children }) => {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

	return (
		<Box sx={{ background: theme.customPalette.customBackground }}>
			{!window.location.href.includes('/ping') && <AppBar />}
			<Box
				id="layout"
				className="scroller"
				sx={{
					display: 'flex',
					flexDirection: 'column',
					overflow: 'auto',
					height: '100vh',
					scrollbarWidth: 'thin', // for firefox
				}}
			>
				{children}
			</Box>
			{isMobile && <MetaMaskSelect />}
		</Box>
	)
})
