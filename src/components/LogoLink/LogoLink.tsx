import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Box, Grid, Typography } from '@mui/material'

import Logo from '@/assets/logo.svg'
import { APP_NAME } from '@/constants'

type LogoLinkProps = {
	isSmall?: boolean
}

export const LogoLink = memo(({ isSmall = false }: LogoLinkProps) => (
	<Box
		component={Link}
		to="/"
		sx={[
			{
				display: 'block',
				textDecoration: 'none',
				color: 'inherit',
			},
			{
				'&:hover > *': {
					opacity: 0.8,
				},
			},
		]}
	>
		<Grid container alignItems="center" justifyContent={isSmall ? 'center' : 'inherit'} spacing={'12px'} wrap="nowrap">
			<Grid item style={{ display: 'flex' }}>
				<img width={isSmall ? '32' : '40'} height={isSmall ? '32' : '40'} src={Logo} alt={`${APP_NAME} Logo`} />
			</Grid>
			<Grid container item flexDirection="column" sx={{ width: 'fit-content' }}>
				<Grid item>
					{isSmall ? (
						<Typography variant="h4" color="textPrimary">
							Chain Metrics
						</Typography>
					) : (
						<>
							<span style={{ position: 'relative', bottom: -4 }}>Chain</span>
							<br />
							<span style={{ position: 'relative', top: -4 }}>Metrics</span>
						</>
					)}
				</Grid>
			</Grid>
		</Grid>
	</Box>
))
