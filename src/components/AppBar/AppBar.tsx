import { useState } from 'react'
import { FiMenu } from 'react-icons/fi'
import { AppBar as MuiAppBar, Box, Divider, IconButton, Toolbar, Typography, useTheme } from '@mui/material'

import { SearchField } from '../SearchField/SearchField'

import { AppDrawer } from '@/components/AppDrawer'
import { LogoLink } from '@/components/LogoLink'
import { Nav } from '@/components/Nav'

export const AppBar = () => {
	const theme = useTheme()
	const [menuOpen, setMenuOpen] = useState<boolean>(false)
	const [searchQuery, setSearchQuery] = useState<string>('')

	return (
		<>
			<MuiAppBar
				elevation={0}
				position="sticky"
				sx={{
					flexGrow: 1,
					display: {
						xs: 'flex',
						md: 'none',
					},
					backgroundColor: theme.customPalette.appBarBackground,
				}}
			>
				<Toolbar
					sx={{
						flexGrow: 1,
						display: {
							xs: 'flex',
							md: 'none',
						},
						position: 'relative',
					}}
				>
					<IconButton onClick={() => setMenuOpen(!menuOpen)} sx={{ position: 'absolute', left: 0, ml: 1 }}>
						<FiMenu />
					</IconButton>
					<Typography variant="h6" component="h1" sx={{ flexGrow: 1 }} noWrap>
						<LogoLink isSmall />
					</Typography>
				</Toolbar>
				<Divider />
			</MuiAppBar>

			<AppDrawer
				sx={{
					display: {
						xs: 'flex',
						md: 'none',
					},
				}}
				open={menuOpen}
				onClose={() => setMenuOpen(false)}
				PaperProps={{
					sx: {
						background: theme.customPalette.sidebarGradientBackground,
					},
				}}
			>
				<Box sx={{ width: 300 }}>
					<SearchField searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
					<Nav setMenuOpen={setMenuOpen} searchQuery={searchQuery} />
				</Box>
			</AppDrawer>
		</>
	)
}
