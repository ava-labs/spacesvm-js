import { Link } from 'react-router-dom'
import { AppBar as MuiAppBar, Box, Container, Grid, Toolbar, Typography } from '@mui/material'

import { ThemeToggle } from '../ThemeToggle'
import { MetaMaskSelect } from './MetaMaskSelect'

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
				mx: '10px',
				width: 'calc(100% - 20px)',
			}}
		>
			<Toolbar>
				<Container maxWidth="xl" disableGutters>
					<Grid container alignItems="center" justifyContent="space-between" wrap="nowrap">
						<Grid item>
							<Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
								<img src={Logo} width={32} height={32} alt={`${APP_NAME} Logo`} />
								<Typography
									variant="h4"
									component="div"
									color="textPrimary"
									sx={{ fontFamily: 'DM Serif Display', ml: 2, letterSpacing: 8 }}
								>
									{APP_NAME}
								</Typography>
							</Link>
						</Grid>

						<Grid item container alignItems="center" justifyContent="flex-end" wrap="nowrap" spacing={3}>
							<Grid item>
								<ThemeToggle />
							</Grid>

							<Grid item>
								<MetaMaskSelect />
							</Grid>
						</Grid>
					</Grid>
				</Container>
			</Toolbar>
		</MuiAppBar>
	</Box>
))
