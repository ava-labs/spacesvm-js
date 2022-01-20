import { SyntheticEvent } from 'react'
import { Twemoji } from 'react-emoji-render'
import { Link } from 'react-router-dom'
import {
	Box,
	Card,
	CardContent,
	Grid,
	Link as MuiLink,
	Tab,
	Table,
	TableBody,
	TableCell,
	TableRow,
	Tabs,
	Typography,
} from '@mui/material'
import findIndex from 'lodash/findIndex'

import { AddressChip } from '@/components/AddressChip/AddressChip'
import { ACTIVITY_TABLE_TAB_STORAGE_KEY } from '@/constants'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { getLatestActivity } from '@/utils/spacesVM'

export const ActivityTable = memo(() => {
	const [tps, setTps] = useState<number>()
	const [mostRecentTxId, setMostRecentTxId] = useState<string>()
	const [selectedTabStorage, setSelectedTabStorage] = useLocalStorage(ACTIVITY_TABLE_TAB_STORAGE_KEY, 'all') // track theme in localStorage
	const [selectedTab, setSelectedTab] = useState<string>(selectedTabStorage)
	const [recentActivity, setRecentActivity] = useState<
		{
			timestamp?: number
			to?: string
			txId?: string
			type?: string
			sender?: string
			space?: string
			key?: string
			units?: number
		}[]
	>()
	const [recentActivityFiltered, setRecentActivityFiltered] = useState<
		{
			timestamp?: number
			to?: string
			txId?: string
			type?: string
			sender?: string
			space?: string
			key?: string
			units?: number
		}[]
	>()

	const onActivityFiltered = (val: string) => {
		if (!recentActivity) return

		if (val === 'all') {
			setRecentActivityFiltered(recentActivity)
			return
		}

		const activityFiltered = [...recentActivity].filter(({ type }) => type === val)
		setRecentActivityFiltered(activityFiltered)
	}

	useEffect(() => {
		const latestTxId = recentActivity?.[0].txId
		const index = findIndex(recentActivity, (o) => o.txId == mostRecentTxId)
		const tpsValue = Number(index) / 10

		setTps(tpsValue)
		setMostRecentTxId(latestTxId)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [recentActivity])

	useEffect(() => {
		const fetchRecentActivity = async () => {
			const activity = await getLatestActivity()
			setRecentActivity(activity.activity)
		}

		fetchRecentActivity()

		const fetchInterval = setInterval(() => {
			fetchRecentActivity()
		}, 10000) // refresh every 10s

		return () => clearInterval(fetchInterval)
	}, [])

	useEffect(() => {
		onActivityFiltered(selectedTab)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [recentActivity])

	const handleChange = (event: SyntheticEvent, newValue: string) => {
		setSelectedTab(newValue)
		onActivityFiltered(newValue)
		// setting tab in localStorage to persist refresh
		setSelectedTabStorage(newValue)
	}

	return recentActivity ? (
		<>
			<Typography align="center" variant="body2" sx={{ mb: 2 }} fontWeight={900}>
				Live TPS:{' '}
				<Typography component="span" variant="body2" fontWeight={900} sx={{ ml: '4px' }} fontSize={18} color="primary">
					{tps === 0 ? '-' : tps}
				</Typography>{' '}
				<br />
				<Typography sx={{ ml: 1 }} variant="caption" component="span" color="textSecondary">
					(Updated every 10 seconds)
				</Typography>
			</Typography>
			<Tabs
				value={selectedTab}
				onChange={handleChange}
				variant="scrollable"
				scrollButtons
				indicatorColor="secondary"
				textColor="inherit"
				allowScrollButtonsMobile
				sx={{ mx: -2, mb: 2 }}
			>
				<Tab label="All" value="all" />
				<Tab icon={<Twemoji svg text="📜" />} label="Claim" value="claim" />
				<Tab icon={<Twemoji svg text="⌛" />} label="Lifeline" value="lifeline" />
				<Tab icon={<Twemoji svg text="🚮" />} label="Delete" value="delete" />
				<Tab icon={<Twemoji svg text="🤑" />} label="Reward" value="reward" />
				<Tab icon={<Twemoji svg text="📦" />} label="Move" value="move" />
				<Tab icon={<Twemoji svg text="✍" />} label="Set" value="set" />
				<Tab icon={<Twemoji svg text="📃" />} label="Transfer" value="transfer" />
			</Tabs>

			{recentActivityFiltered?.length === 0 && (
				<Box mb={8} display="flex" flexDirection="column">
					<Typography
						sx={{ mt: 2, mb: 2 }}
						align="center"
						fontFamily="DM Serif Display"
						variant="h5"
						color="textSecondary"
					>
						{`No recent ${selectedTab} activity`}
					</Typography>
					<img
						width={180}
						height={180}
						src="https://media4.giphy.com/media/Wpy9lrAfHCLp4mIT9L/giphy.gif?cid=790b76113442389ba39c4e237e25d83b899276c8cae66345&rid=giphy.gif&ct=g"
						alt="empty gif"
						style={{ borderRadius: 8, margin: 'auto' }}
					/>
				</Box>
			)}

			<Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
				{recentActivityFiltered?.map(
					({ timestamp, to, txId, key, sender, space, units, type }, i) =>
						i <= 25 && (
							<Grid key={`${txId}-${i}`} item sm={12} md={6} lg={4} xl={3} sx={{ width: '100%' }}>
								<Card variant="outlined" sx={{ mb: 1, height: '100%', width: '100%' }}>
									{type && (
										<Box display="flex" justifyContent="center" alignItems="center" mt={2}>
											{type === 'claim' && (
												<>
													<Box display="inline-flex" mr={1} fontSize={24}>
														<Twemoji svg text="📜" />
													</Box>
													<Typography fontFamily="DM Serif Display" variant="h6" noWrap>
														Claim
													</Typography>
												</>
											)}

											{type === 'lifeline' && (
												<>
													<Box display="inline-flex" mr={1} fontSize={24}>
														<Twemoji svg text="⌛️" />
													</Box>
													<Typography fontFamily="DM Serif Display" variant="h6" noWrap>
														Lifeline
													</Typography>
												</>
											)}

											{type === 'delete' && (
												<>
													<Box display="inline-flex" mr={1} fontSize={24}>
														<Twemoji svg text="🚮" />
													</Box>
													<Typography fontFamily="DM Serif Display" variant="h6" noWrap>
														Delete
													</Typography>
												</>
											)}

											{type === 'reward' && (
												<>
													<Box display="inline-flex" mr={1} fontSize={24} position="relative" top={1}>
														<Twemoji svg text="🤑" />
													</Box>
													<Typography fontFamily="DM Serif Display" variant="h6" noWrap>
														Reward
													</Typography>
												</>
											)}

											{type === 'move' && (
												<>
													<Box display="inline-flex" mr={1} fontSize={24} position="relative" top={2}>
														<Twemoji svg text="📦" />
													</Box>
													<Typography fontFamily="DM Serif Display" variant="h6" noWrap>
														Move
													</Typography>
												</>
											)}

											{type === 'set' && (
												<>
													<Box display="inline-flex" mr={1} fontSize={24}>
														<Twemoji svg text="✍️" />
													</Box>
													<Typography fontFamily="DM Serif Display" variant="h6" noWrap>
														Set
													</Typography>
												</>
											)}

											{type === 'transfer' && (
												<>
													<Box display="inline-flex" mr={1} fontSize={24}>
														<Twemoji svg text="📃" />
													</Box>
													<Typography fontFamily="DM Serif Display" variant="h6" noWrap>
														Transfer
													</Typography>
												</>
											)}
										</Box>
									)}
									<CardContent sx={{ pt: 0, pb: '0!important' }}>
										<Table sx={{ tableLayout: 'fixed' }}>
											<TableBody>
												{timestamp && (
													<TableRow>
														<TableCell>
															<Typography variant="body2" fontWeight={900} noWrap>
																Timestamp
															</Typography>
														</TableCell>
														<TableCell>
															<Typography noWrap variant="caption">
																{new Date(Number(timestamp) * 1000).toLocaleString() || '-'}
															</Typography>
														</TableCell>
													</TableRow>
												)}
												{space && (
													<TableRow>
														<TableCell>
															<Typography variant="body2" fontWeight={900} noWrap>
																Space
															</Typography>
														</TableCell>
														<TableCell>
															<Typography noWrap variant="body2">
																<MuiLink component={Link} to={`/${space}/`}>
																	{space}
																</MuiLink>
															</Typography>
														</TableCell>
													</TableRow>
												)}
												{key && space && (
													<TableRow>
														<TableCell>
															<Typography variant="body2" fontWeight={900} noWrap>
																Key
															</Typography>
														</TableCell>
														<TableCell>
															<Typography noWrap variant="body2">
																{type === 'delete' ? (
																	key
																) : (
																	<MuiLink component={Link} to={`/${space}/${key}/`}>
																		{key}
																	</MuiLink>
																)}
															</Typography>
														</TableCell>
													</TableRow>
												)}
												{units && (
													<TableRow>
														<TableCell>
															<Typography variant="body2" fontWeight={900} noWrap>
																Amount{' '}
																<Typography sx={{ ml: 1 }} variant="body2" component="span" color="textSecondary">
																	(SPC)
																</Typography>
															</Typography>
														</TableCell>
														<TableCell>
															<Typography noWrap variant="body2">
																{units ? new Intl.NumberFormat('en-US').format(units) : '-'}
															</Typography>
														</TableCell>
													</TableRow>
												)}
												{txId && (
													<TableRow>
														<TableCell sx={{ width: 0 }}>
															<Typography variant="body2" fontWeight={900} noWrap>
																Transaction ID
															</Typography>
														</TableCell>
														<TableCell>
															<AddressChip
																sx={{ ml: -1 }}
																copyText="Copy TxID"
																copySuccessText="TxID copied!"
																address={txId}
																isObfuscated
																tooltipPlacement="top"
															/>
														</TableCell>
													</TableRow>
												)}

												{sender && (
													<TableRow>
														<TableCell>
															<Typography variant="body2" fontWeight={900} noWrap>
																Sender
															</Typography>
														</TableCell>
														<TableCell>
															<AddressChip sx={{ ml: -1 }} address={sender} isObfuscated tooltipPlacement="top" />
														</TableCell>
													</TableRow>
												)}
												{to && (
													<TableRow>
														<TableCell>
															<Typography variant="body2" fontWeight={900} noWrap>
																To
															</Typography>
														</TableCell>
														<TableCell>
															<AddressChip sx={{ ml: -1 }} address={to} isObfuscated tooltipPlacement="top" />
														</TableCell>
													</TableRow>
												)}
											</TableBody>
										</Table>
									</CardContent>
								</Card>
							</Grid>
						),
				)}
			</Grid>
		</>
	) : (
		<Box height={400} />
	)
})
