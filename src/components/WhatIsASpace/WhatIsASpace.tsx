import { IoInformationCircleOutline } from 'react-icons/io5'
import { Box, Button, Drawer as MuiDrawer, Typography } from '@mui/material'

import WhatsASpaceBg from '@/assets/whats-a-space.jpg'

export const WhatIsASpace = memo(() => {
	const [open, setOpen] = useState<boolean>(false)

	return (
		<>
			<Box display="flex" justifyContent="center" sx={{ mt: 1 }}>
				<Button
					onClick={() => setOpen(true)}
					color="secondary"
					size="small"
					startIcon={
						<Box display="flex" position="relative" top={1}>
							<IoInformationCircleOutline />
						</Box>
					}
				>
					What's a space?
				</Button>
			</Box>
			<MuiDrawer
				PaperProps={{
					sx: {
						borderLeft: (theme) => (theme.palette.mode === 'dark' ? '2px solid hsla(0, 0%, 100%, 0.2)' : 'unset'),
						width: '40vw',
						minWidth: 280,
						maxWidth: 540,
						p: {
							xs: 3,
							sm: 6,
						},
					},
				}}
				anchor={'right'}
				open={open}
				onClose={() => setOpen(false)}
			>
				<Box
					sx={{
						backgroundColor: (theme) => theme.customPalette.customBackground,
						backgroundImage: `url(${WhatsASpaceBg})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						backgroundRepeat: 'no-repeat',
						height: 180,
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						position: 'absolute',
						top: 0,
						right: 0,
						left: 0,
					}}
				>
					<Typography variant="h4" color="#fff" sx={{ fontFamily: 'DM Serif Display' }}>
						What's a space?
					</Typography>
				</Box>
				<Box pt={'180px'}>
					<Typography variant="body1" gutterBottom>
						Ostifie de ciarge de bâtard de torvisse de saintes fesses de charogne de calvinouche de saint-ciarge de
						mosus de Jésus de plâtre de câline de bine de sapristi de viarge d'enfant d'chienne de torrieux de charrue
						de boswell de viande à chien de marde de bout d'ciarge de crime de patente à gosse de maudit de verrat de
						colon de Jésus Marie Joseph de crisse de cul de crucifix de batince de p'tit Jésus.
					</Typography>
					<br />
					<Typography variant="body1">
						Ostifie de ciarge de bâtard de torvisse de saintes fesses de charogne de calvinouche de saint-ciarge de
						mosus de Jésus de plâtre de câline de bine de sapristi de viarge d'enfant d'chienne de torrieux de charrue
						de boswell de viande à chien de marde de bout d'ciarge de crime de patente à gosse de maudit de verrat de
						colon de Jésus Marie Joseph de crisse de cul de crucifix de batince de p'tit Jésus.
					</Typography>
					<br />
					<Typography variant="body1">
						Ostifie de ciarge de bâtard de torvisse de saintes fesses de charogne de calvinouche de saint-ciarge de
						mosus de Jésus de plâtre de câline de bine de sapristi de viarge d'enfant d'chienne de torrieux de charrue
						de boswell de viande à chien de marde de bout d'ciarge de crime de patente à gosse de maudit de verrat de
						colon de Jésus Marie Joseph de crisse de cul de crucifix de batince de p'tit Jésus.
					</Typography>
					<br />
					<Typography variant="body1">
						Ostifie de ciarge de bâtard de torvisse de saintes fesses de charogne de calvinouche de saint-ciarge de
						mosus de Jésus de plâtre de câline de bine de sapristi de viarge d'enfant d'chienne de torrieux de charrue
						de boswell de viande à chien de marde de bout d'ciarge de crime de patente à gosse de maudit de verrat de
						colon de Jésus Marie Joseph de crisse de cul de crucifix de batince de p'tit Jésus.
					</Typography>
					<br />
					<Typography variant="body1">
						Ostifie de ciarge de bâtard de torvisse de saintes fesses de charogne de calvinouche de saint-ciarge de
						mosus de Jésus de plâtre de câline de bine de sapristi de viarge d'enfant d'chienne de torrieux de charrue
						de boswell de viande à chien de marde de bout d'ciarge de crime de patente à gosse de maudit de verrat de
						colon de Jésus Marie Joseph de crisse de cul de crucifix de batince de p'tit Jésus.
					</Typography>
				</Box>
			</MuiDrawer>
		</>
	)
})
