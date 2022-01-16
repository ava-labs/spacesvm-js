import { Twemoji } from 'react-emoji-render'
import { IoConstructOutline, IoInformationCircleOutline, IoTrashOutline } from 'react-icons/io5'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	Grid,
	Grow,
	IconButton,
	LinearProgress,
	Table,
	TableBody,
	TableCell,
	TableRow,
	Tooltip,
	Typography,
} from '@mui/material'
import { format, formatDistanceToNow } from 'date-fns'

import { ClaimButton } from '../Home/Home'

import { DeleteKeyValueDialog } from '@/components/DeleteKeyValueDialog'
import { KeyValueInput } from '@/components/KeyValueInput'
import { LifelineDialog } from '@/components/LifelineDialog'
import { Page } from '@/components/Page'
import { PageTitle } from '@/components/PageTitle'
import { USERNAME_REGEX_QUERY } from '@/constants'
import { useMetaMask } from '@/providers/MetaMaskProvider'
import { rainbowText } from '@/theming/rainbowText'
import { SpaceKeyValue } from '@/types'
import { querySpace } from '@/utils/spacesVM'

export const SpaceDetails = memo(() => {
	const navigate = useNavigate()
	const { spaceId } = useParams()
	const { currentAddress } = useMetaMask()
	const [details, setDetails] = useState<any>()
	const [showDetailsTable, setShowDetailsTable] = useState<boolean>(false)
	const [spaceValues, setSpaceValues] = useState<any>()
	const [loading, setLoading] = useState<boolean>(true)
	const spaceIdTrimmed = spaceId?.toLowerCase().replace(USERNAME_REGEX_QUERY, '')
	const [lifelineDialogOpen, setLifelineDialogOpen] = useState<boolean>(false)
	const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
	const [focusedKeyIndex, setFocusedKeyIndex] = useState<number>()

	const refreshSpaceDetails = useCallback(async () => {
		const spaceData = await querySpace(spaceId || '')
		console.log(spaceData)
		setDetails(spaceData?.info)
		setSpaceValues(spaceData?.values)
		setLoading(false)
	}, [spaceId])

	useEffect(() => {
		// Give the api a second to update
		setTimeout(refreshSpaceDetails, 1000)
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
									md: 'calc(100vh - 128px)',
								},
								p: 2,
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<PageTitle align="center" variant="h2" sx={{ mb: 2 }}>
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
										<Table sx={{ mt: 2 }}>
											<TableBody>
												<TableRow>
													<TableCell>Owner</TableCell>
													<TableCell>
														<Chip sx={{ ml: -1 }} label={details.owner} />
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
								borderTopLeftRadius: 24,
								borderBottomLeftRadius: 24,
								boxShadow: '-90px 0 200px 0 rgb(82 61 241 / 6%)',
								overflow: 'auto',
								height: 'calc(100vh - 64px)',
							}}
						>
							{spaceId && isSpaceOwner && <KeyValueInput spaceId={spaceId} refreshSpaceDetails={refreshSpaceDetails} />}
							{spaceValues ? (
								spaceValues.map(({ key, value }: SpaceKeyValue, i: number) => (
									<Card
										key={key}
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
										<Avatar sx={{ mr: 2 }}>{i + 1}</Avatar>
										<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
											<CardContent sx={{ pt: 0 }}>
												<Typography variant="h4">
													{key} - {value}
												</Typography>
											</CardContent>
										</Box>
										<Box className="actions">
											<Grid container spacing={1} wrap="nowrap">
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
																onClick={() => {
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
		</Page>
	)
})
