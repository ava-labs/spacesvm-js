import { memo } from 'react'
import { Link } from 'react-router-dom'
import { AppBar as MuiAppBar, Box, Container, Toolbar, Typography } from '@mui/material'

import Logo from '@/assets/favicon.png'
import { APP_NAME } from '@/constants'

export const AppBar = memo(() => (
	<Box sx={{ flexGrow: 1 }}>
		<MuiAppBar
			position="fixed"
			elevation={0}
			color="transparent"
			sx={{
				backdropFilter: 'blur(5px)',
				// for scrollbar not to be blurry
				mr: '10px',
			}}
		>
			<Toolbar>
				<Container maxWidth="xl" disableGutters>
					<Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
						<img src={Logo} width={32} height={32} alt={`${APP_NAME} Logo`} />
						<Typography variant="h4" component="div" color="textPrimary" sx={{ fontFamily: 'DM Serif Display', ml: 1 }}>
							{APP_NAME}
						</Typography>
					</Link>
				</Container>
			</Toolbar>
		</MuiAppBar>
	</Box>
))
