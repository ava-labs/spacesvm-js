import { Twemoji } from 'react-emoji-render'
import { GiCardboardBox } from 'react-icons/gi'
import { IoLink } from 'react-icons/io5'
import { IoConstructOutline, IoInformationCircleOutline, IoTrashOutline } from 'react-icons/io5'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
	Box,
	Button,
	Card,
	CardContent,
	CircularProgress,
	Grid,
	Grow,
	IconButton,
	LinearProgress,
	Link as MuiLink,
	Table,
	TableBody,
	TableCell,
	TableRow,
	Tooltip,
	Typography,
	useTheme,
} from '@mui/material'
import { formatDistanceToNow } from 'date-fns'
import { useSnackbar } from 'notistack'

import { ClaimButton } from '../Home/Home'

import NothingHere from '@/assets/nothing-here.jpg'
import { AddressChip } from '@/components/AddressChip/AddressChip'
import { DeleteKeyValueDialog } from '@/components/DeleteKeyValueDialog'
import { KeyValueInput } from '@/components/KeyValueInput'
import { LifelineDialog } from '@/components/LifelineDialog'
import { LinkPreview } from '@/components/LinkPreview'
import { MoveSpaceDialog } from '@/components/MoveSpaceDialog'
import { Page } from '@/components/Page'
import { PageTitle } from '@/components/PageTitle'
import { IMAGE_REGEX, URL_REGEX, USERNAME_REGEX_QUERY } from '@/constants'
import { useMetaMask } from '@/providers/MetaMaskProvider'
import { rainbowText } from '@/theming/rainbowText'
import { SpaceKeyValue } from '@/types'
import { setClipboard } from '@/utils/setClipboard'
import { querySpace } from '@/utils/spacesVM'

const isImgLink = (url: string): boolean => {
	if (typeof url !== 'string') return false
	return url.match(IMAGE_REGEX) != null
}

export const SpaceDetails = memo(() => {
	const navigate = useNavigate()
	const { spaceId } = useParams()
	const { currentAddress } = useMetaMask()
	const theme = useTheme()
	const [details, setDetails] = useState<any>()
	const [showDetailsTable, setShowDetailsTable] = useState<boolean>(false)
	const [spaceValues, setSpaceValues] = useState<any>()
	const [focusedKeyIndex, setFocusedKeyIndex] = useState<number>()
	const [loading, setLoading] = useState<boolean>(true)
	const spaceIdTrimmed = spaceId?.toLowerCase().replace(USERNAME_REGEX_QUERY, '')
	const [lifelineDialogOpen, setLifelineDialogOpen] = useState<boolean>(false)
	const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
	const [moveDialogOpen, setMoveDialogOpen] = useState<boolean>(false)
	const { enqueueSnackbar } = useSnackbar()

	const refreshSpaceDetails = useCallback(async () => {
		const spaceData = await querySpace(spaceId || '')
		setDetails(spaceData?.info)
		setSpaceValues(spaceData?.values)
		setLoading(false)
	}, [spaceId])

	useEffect(() => {
		refreshSpaceDetails()
	}, [refreshSpaceDetails])

	useEffect(() => {
		!spaceId?.length && navigate('/')
	}, [spaceId, navigate])

	const isSpaceOwner = useMemo(() => details?.owner === currentAddress, [details, currentAddress])

	return (
		<Page title={spaceIdTrimmed} showFooter={false} noPadding>
			<Box style={{ paddingTop: 64 }}>
				{loading ? (
					<LinearProgress color="secondary" />
				) : (
					<Grid container>
						<Grid
							item
							xs={12}
							md={5}
							sx={{
								height: {
									xs: 'unset',
									md: 'calc(100vh - 64px)',
								},
								p: 2,
								pb: 4,
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<PageTitle align="center" variant="h2" sx={{ mb: 0 }}>
								<Twemoji svg text="✨🔭" />
							</PageTitle>
							<PageTitle
								align="center"
								variant="h1"
								sx={{
									...rainbowText,
									mb: 0,
								}}
							>
								{spaceIdTrimmed}
							</PageTitle>
							{details && (
								<>
									<Tooltip title={new Date(details.expiry * 1000).toLocaleString()} placement="right">
										<Typography
											sx={{
												py: 1,
												'&:hover': {
													cursor: 'help',
												},
											}}
											variant="caption"
											component="div"
											display="block"
											align="center"
											color="textSecondary"
										>
											<Grid container alignItems="center" spacing={1}>
												{isSpaceOwner && (
													<>
														<Grid item>Owned by you</Grid>
														<Grid item>—</Grid>
													</>
												)}
												<Grid item>
													Expires {formatDistanceToNow(new Date(details.expiry * 1000), { addSuffix: true })}
												</Grid>
												<Grid item sx={{ display: 'flex', mt: '0px' }}>
													<IoInformationCircleOutline size={14} />
												</Grid>
											</Grid>
										</Typography>
									</Tooltip>

									<Grid container sx={{ mt: 2 }} alignItems="center" justifyContent="center" spacing={1}>
										<Grid item>
											<Button variant="outlined" color="secondary" onClick={() => setLifelineDialogOpen(true)}>
												Extend expiration date
											</Button>
										</Grid>
										<Grid item>
											<Button color="secondary" onClick={() => setShowDetailsTable(!showDetailsTable)}>
												{showDetailsTable ? 'Hide' : 'Show'} details
											</Button>
										</Grid>
									</Grid>

									<Grow in={showDetailsTable} mountOnEnter unmountOnExit>
										<div>
											<Table sx={{ mt: 2 }}>
												<TableBody>
													<TableRow>
														<TableCell>Owner</TableCell>
														<TableCell>
															<AddressChip sx={{ ml: -1 }} address={details.owner} />
														</TableCell>
													</TableRow>
													<TableRow>
														<TableCell sx={{ whiteSpace: 'nowrap' }}>Created on</TableCell>
														<TableCell>{new Date(details.created * 1000).toLocaleString()}</TableCell>
													</TableRow>
													<TableRow>
														<TableCell sx={{ whiteSpace: 'nowrap' }}>Last updated on</TableCell>
														<TableCell>{new Date(details.lastUpdated * 1000).toLocaleString()}</TableCell>
													</TableRow>
												</TableBody>
											</Table>
											{isSpaceOwner && (
												<Box sx={{ display: 'flex', justifyContent: 'end', mt: 2 }}>
													<Button
														startIcon={<GiCardboardBox />}
														variant="outlined"
														color="secondary"
														size="small"
														sx={{
															background: theme.customPalette.customBackground,
															'&:hover': { background: theme.customPalette.customBackground },
														}}
														onClick={() => setMoveDialogOpen(true)}
													>
														Move space
													</Button>
												</Box>
											)}
										</div>
									</Grow>
								</>
							)}
						</Grid>
						<Grid
							item
							xs={12}
							md={7}
							sx={{
								p: {
									xs: 2,
									md: 8,
								},
								background: (theme) => theme.palette.background.paper,
								backgroundImage: (theme) =>
									theme.palette.mode === 'dark' && spaceValues?.length === 0 ? `url(${NothingHere})` : 'unset',
								backgroundSize: 'cover',
								backgroundRepeat: 'no-repeat',
								backgroundPosition: 'center',
								borderTopLeftRadius: 24,
								borderBottomLeftRadius: 24,
								boxShadow: '-90px 0 200px 0 rgb(82 61 241 / 6%)',
								overflow: 'auto',
								height: 'calc(100vh - 64px)',
							}}
						>
							{spaceValues && (
								<Typography variant="h3" fontFamily="DM Serif Display" align="center" gutterBottom>
									Space contents
								</Typography>
							)}

							{spaceValues && (
								<Typography
									variant="body1"
									component="div"
									color="textSecondary"
									align="center"
									gutterBottom
									sx={{ mb: 3 }}
								>
									{spaceValues?.length === 0 ? (
										`There's nothing in ${isSpaceOwner ? 'your' : 'this'} space right now.`
									) : (
										<Typography variant="body2" color="textSecondary">
											The{' '}
											<Typography component="b" fontWeight={900} variant="body2" color="textPrimary">
												more
											</Typography>{' '}
											items in {isSpaceOwner ? 'your' : 'a'} space, the{' '}
											<Typography component="b" fontWeight={900} variant="body2" color="textPrimary">
												faster
											</Typography>{' '}
											it will expire.
										</Typography>
									)}
								</Typography>
							)}

							{spaceId && isSpaceOwner && (
								<KeyValueInput
									empty={spaceValues?.length === 0 || !spaceValues}
									spaceId={spaceId}
									refreshSpaceDetails={refreshSpaceDetails}
								/>
							)}

							{spaceValues ? (
								spaceValues.map(({ key, value }: SpaceKeyValue, i: number) => {
									const valueIsUrl = URL_REGEX.test(value)

									return (
										<Card
											key={key}
											component={valueIsUrl ? MuiLink : 'div'}
											href={value}
											target="_blank"
											rel="noreferrer"
											elevation={0}
											sx={{
												textDecoration: 'none',
												position: 'relative',
												display: 'flex',
												mb: 1,
												px: 2,
												py: 3,
												//backgroundColor: 'transparent',
												border: '1px solid transparent',
												'&:hover': {
													h4: {
														textDecoration: valueIsUrl ? 'underline' : 'unset',
													},
													border: (theme) => `1px solid ${theme.palette.divider}`,
													'.actions': {
														opacity: 1,
													},
												},
											}}
										>
											<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
												<CardContent sx={{ pt: 0, pb: '8px!important' }}>
													<Typography variant="h4" gutterBottom>
														{key}
													</Typography>
													{valueIsUrl ? (
														isImgLink(value) ? (
															<img width="100%" src={value} alt="" style={{ borderRadius: 4 }} />
														) : (
															<LinkPreview
																url={value || ''}
																render={({ loading, preview }: any) => {
																	if (loading) {
																		return <CircularProgress />
																	}
																	return (
																		<>
																			{(preview['og:title'] || preview.title) && (
																				<Typography variant="body2" gutterBottom>
																					{preview['og:title'] || preview.title}
																				</Typography>
																			)}
																			<img
																				width="100%"
																				src={preview['og:image'] || ''}
																				alt={preview['og:description'] || ''}
																				style={{ borderRadius: 4 }}
																			/>
																			{(preview['og:description'] || preview.description) && (
																				<Typography color="textSecondary" variant="body2">
																					{preview['og:description'] || preview.description}
																				</Typography>
																			)}
																		</>
																	)
																}}
															/>
														)
													) : (
														value
													)}
												</CardContent>
											</Box>

											<Box className="actions" sx={{ position: 'absolute', right: 32, top: 32 }}>
												<Grid container spacing={1} wrap="nowrap">
													<Grid item>
														<Tooltip placement="top" title="Copy direct link">
															<div>
																<IconButton
																	onClick={(e) => {
																		e.preventDefault()
																		e.stopPropagation()
																		setClipboard({
																			value: `${window.location.origin}/spaces/${spaceId}/${key}`,
																			onSuccess: () => enqueueSnackbar('Copied!'),
																			onFailure: () => enqueueSnackbar("Can't copy!", { variant: 'error' }),
																		})
																	}}
																>
																	<IoLink />
																</IconButton>
															</div>
														</Tooltip>
													</Grid>
													{isSpaceOwner && (
														<>
															<Grid item>
																<Tooltip placement="top" title="Edit">
																	<div>
																		<IconButton disabled>
																			<IoConstructOutline />
																		</IconButton>
																	</div>
																</Tooltip>
															</Grid>
															<Grid item>
																<Tooltip placement="top" title="Delete">
																	<div>
																		<IconButton
																			disabled={!isSpaceOwner}
																			onClick={(e) => {
																				e.preventDefault()
																				e.stopPropagation()
																				setFocusedKeyIndex(i)
																				setDeleteDialogOpen(true)
																			}}
																			color="primary"
																		>
																			<IoTrashOutline />
																		</IconButton>
																	</div>
																</Tooltip>
															</Grid>
														</>
													)}
												</Grid>
											</Box>
										</Card>
									)
								})
							) : (
								<Box display="flex" height="100%" flexDirection="column" justifyContent="center" alignItems="center">
									<Typography sx={{ mb: 4 }} variant="h3" align="center" fontFamily="DM Serif Display">
										This space hasn't been claimed yet!
									</Typography>
									<ClaimButton
										//@ts-ignore
										component={Link}
										to={`/?ref=${spaceId}`}
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
			{details?.expiry && (
				<LifelineDialog
					open={lifelineDialogOpen}
					close={() => setLifelineDialogOpen(false)}
					existingExpiry={details.expiry}
					spaceUnits={details.units}
					refreshSpaceDetails={refreshSpaceDetails}
				/>
			)}

			{focusedKeyIndex !== undefined && spaceValues[focusedKeyIndex] && (
				<DeleteKeyValueDialog
					open={deleteDialogOpen}
					close={() => setDeleteDialogOpen(false)}
					refreshSpaceDetails={refreshSpaceDetails}
					spaceKey={spaceValues[focusedKeyIndex]?.key}
				/>
			)}
			<MoveSpaceDialog
				open={moveDialogOpen}
				onClose={() => setMoveDialogOpen(false)}
				refreshSpaceDetails={refreshSpaceDetails}
			/>
		</Page>
	)
})
