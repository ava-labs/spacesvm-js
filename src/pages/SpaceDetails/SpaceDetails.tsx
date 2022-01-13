import { memo, useCallback, useEffect, useState } from 'react'
import { IoConstructOutline, IoTrashOutline } from 'react-icons/io5'
import { Link, useParams } from 'react-router-dom'
import {
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	Grid,
	IconButton,
	LinearProgress,
	Tooltip,
	Typography,
	useTheme,
} from '@mui/material'

import { ClaimButton } from '../Home/Home'

import { Page } from '@/components/Page'
import { PageTitle } from '@/components/PageTitle'
import { isAlreadyClaimed } from '@/utils/quarkvm'

export const SpaceDetails = memo(() => {
	const [isClaimed, setIsClaimed] = useState<boolean>(false)
	const [loading, setLoading] = useState<boolean>(true)
	const { spaceId } = useParams()
	const theme = useTheme()

	const onVerify = useCallback(async () => {
		const isClaimed = await isAlreadyClaimed(spaceId || '')

		setLoading(false)
		setIsClaimed(isClaimed)
	}, [spaceId])

	useEffect(() => {
		onVerify()
	}, [onVerify])

	return (
		<Page showFooter={false} noPadding>
			<Box style={{ paddingTop: 64 }}>
				{loading ? (
					<LinearProgress color="secondary" />
				) : (
					<Grid container>
						<Grid
							item
							xs={12}
							sm={5}
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
							<PageTitle align="center" variant="h2" sx={{ mb: 0 }}>
								✨🔭
							</PageTitle>
							<PageTitle
								align="center"
								variant="h1"
								sx={{
									mb: 0,
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
							{isClaimed && (
								<>
									<Typography variant="caption" component="p" align="center" color="textSecondary">
										Expires on: 21/12/2034
									</Typography>
									<Button sx={{ mt: 4 }} variant="outlined" color="secondary">
										Extend expiration date
									</Button>
								</>
							)}
						</Grid>
						<Grid
							item
							xs={12}
							sm={7}
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
							{isClaimed ? (
								[0, 1, 2, 3, 4, 5, 6, 7].map((el) => (
									<Card
										key={el}
										elevation={0}
										sx={{
											display: 'flex',
											mb: 4,
											p: 4,
											backgroundColor: 'transparent',
											border: '1px solid transparent',
											'&:hover': {
												border: (theme) => `1px solid ${theme.palette.divider}`,
												'.actions': {
													opacity: 1,
												},
											},
										}}
									>
										<Avatar sx={{ mr: 2 }}>{el}</Avatar>
										<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
											<CardContent sx={{ pt: 0 }}>
												<Typography variant="h4">
													Key{el} - Value{el}
												</Typography>
											</CardContent>
										</Box>
										<Box className="actions">
											<Grid container spacing={1} wrap="nowrap">
												<Grid item>
													<Tooltip placement="top" title="Edit">
														<IconButton>
															<IoConstructOutline />
														</IconButton>
													</Tooltip>
												</Grid>
												<Grid item>
													<Tooltip placement="top" title="Delete">
														<IconButton color="primary">
															<IoTrashOutline />
														</IconButton>
													</Tooltip>
												</Grid>
											</Grid>
										</Box>
									</Card>
								))
							) : (
								<Box display="flex" height="100%" flexDirection="column" justifyContent="center" alignItems="center">
									<Typography sx={{ mb: 4 }} variant="h3" align="center" fontFamily="DM Serif Display">
										This space hasn't been claimed yet!
									</Typography>
									<ClaimButton
										//@ts-ignore
										component={Link}
										to="/"
										fullWidth
										variant="contained"
										size="large"
									>
										Claim it now!
									</ClaimButton>
								</Box>
							)}
						</Grid>
					</Grid>
				)}
			</Box>
		</Page>
	)
})
