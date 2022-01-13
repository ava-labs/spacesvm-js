import { memo } from 'react'
import { useParams } from 'react-router-dom'
import { Avatar, Box, Card, CardContent, Grid, Typography, useTheme } from '@mui/material'

import { Page } from '@/components/Page'
import { PageTitle } from '@/components/PageTitle'

export const SpaceDetails = memo(() => {
	const { spaceId } = useParams()
	const theme = useTheme()

	return (
		<Page showFooter={false} noPadding>
			<Box style={{ paddingTop: 64 }}>
				<Grid container>
					<Grid
						item
						xs={12}
						sm={6}
						sx={{
							height: {
								xs: 'unset',
								sm: 'calc(100vh - 128px)',
							},
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<PageTitle align="center" variant="h2">
							✨🔭
						</PageTitle>
						<PageTitle
							align="center"
							variant="h1"
							sx={{
								wordBreak: 'break-all',
								backgroundSize: '400% 100%',
								backgroundClip: 'text',
								textFillColor: 'transparent',
								backgroundColor: theme.palette.mode === 'dark' ? 'white' : 'unset',
								animation: 'hue 5s infinite alternate',
								caretColor: '#523df1',
								backgroundImage:
									'linear-gradient(60deg,rgba(239,0,143,.5),rgba(110,195,244,.5),rgba(112,56,255,.5),rgba(255,186,39,.5))',
							}}
						>
							{spaceId}
						</PageTitle>
						<Typography variant="caption" component="p" align="center" color="textSecondary">
							Expires on: 21/12/2034
						</Typography>
					</Grid>
					<Grid
						item
						xs={12}
						sm={6}
						sx={{
							p: 8,
							background: (theme) => theme.palette.background.default,
							borderTopLeftRadius: 24,
							borderBottomLeftRadius: 24,
							boxShadow: '-90px 0 200px 0 rgb(82 61 241 / 6%)',
							overflow: 'auto',
							height: 'calc(100vh - 64px)',
						}}
					>
						{[0, 1, 2, 3, 4, 5, 6, 7].map((el) => (
							<Card
								key={el}
								elevation={0}
								sx={{ display: 'flex', mb: 4, alignItems: 'center', backgroundColor: 'transparent' }}
							>
								<Avatar sx={{ mr: 2 }}>{el}</Avatar>
								<Box sx={{ display: 'flex', flexDirection: 'column' }}>
									<CardContent>
										<Typography variant="h4">Key</Typography>
										<Typography variant="subtitle1" color="textSecondary">
											Value
										</Typography>
									</CardContent>
								</Box>
							</Card>
						))}
					</Grid>
				</Grid>
			</Box>
		</Page>
	)
})
