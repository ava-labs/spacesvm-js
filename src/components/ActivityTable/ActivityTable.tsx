import { Twemoji } from 'react-emoji-render'
import { Link } from 'react-router-dom'
import {
	Box,
	Card,
	CardContent,
	Grid,
	Link as MuiLink,
	Table,
	TableBody,
	//TableBody,
	TableCell,
	//	TableHead,
	TableRow,
	Typography,
} from '@mui/material'

import { AddressChip } from '@/components/AddressChip/AddressChip'
import { getLatestActivity } from '@/utils/spacesVM'

export const ActivityTable = memo(() => {
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

	useEffect(() => {
		const fetchRecentActivity = async () => {
			const activity = await getLatestActivity()
			setRecentActivity(activity.activity)
		}

		fetchRecentActivity()

		setInterval(() => {
			fetchRecentActivity()
		}, 10000) // refresh every 10s
	}, [])

	return recentActivity ? (
		<>
			<Grid container spacing={2}>
				{recentActivity?.map(
					({ timestamp, to, txId, key, sender, space, units, type }, i) =>
						i <= 20 && (
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
										<Table>
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
															<MuiLink component={Link} to={`/s/${space}/`}>
																{space}
															</MuiLink>
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
															{type === 'delete' ? (
																<Typography noWrap variant="body2">
																	{key}
																</Typography>
															) : (
																<MuiLink component={Link} to={`/s/${space}/${key}/`}>
																	{key}
																</MuiLink>
															)}
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

			{/*<Table>
				<TableHead>
					<TableRow>
						<TableCell>
							<Typography fontFamily="DM Serif Display" variant="h6" noWrap>
								Type
							</Typography>
						</TableCell>
						<TableCell>
							<Typography fontFamily="DM Serif Display" variant="h6" noWrap>
								Key
							</Typography>
						</TableCell>
						<TableCell>
							<Typography fontFamily="DM Serif Display" variant="h6" noWrap>
								Space
							</Typography>
						</TableCell>
						<TableCell>
							<Typography fontFamily="DM Serif Display" variant="h6" noWrap>
								Sender
							</Typography>
						</TableCell>
						<TableCell>
							<Typography fontFamily="DM Serif Display" variant="h6" noWrap>
								To
							</Typography>
						</TableCell>
						<TableCell>
							<Typography fontFamily="DM Serif Display" variant="h6" noWrap>
								Transaction ID
							</Typography>
						</TableCell>
						<TableCell>
							<Typography fontFamily="DM Serif Display" variant="h6" noWrap>
								Amount{' '}
								<Typography sx={{ ml: 1 }} variant="body2" component="span" color="textSecondary">
									(SPC)
								</Typography>
							</Typography>
						</TableCell>
						<TableCell>
							<Typography fontFamily="DM Serif Display" variant="h6" noWrap>
								Time
							</Typography>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{recentActivity?.map(
						({ timestamp, to, txId, key, sender, space, units, type }, i) =>
							i <= 20 && (
								<TableRow key={`${txId}-${i}`}>
									<TableCell>
										<Typography noWrap variant="body2" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
											{type ? (
												<>
													{type === 'claim' && (
														<>
															<Box display="inline-flex" mr={1} fontSize={24}>
																<Twemoji svg text="📜" />
															</Box>
															Claim
														</>
													)}

													{type === 'lifeline' && (
														<>
															<Box display="inline-flex" mr={1} fontSize={24}>
																<Twemoji svg text="⌛️" />
															</Box>
															Lifeline
														</>
													)}

													{type === 'delete' && (
														<>
															<Box display="inline-flex" mr={1} fontSize={24}>
																<Twemoji svg text="🚮" />
															</Box>
															Delete
														</>
													)}

													{type === 'reward' && (
														<>
															<Box display="inline-flex" mr={1} fontSize={24} position="relative" top={1}>
																<Twemoji svg text="🤑" />
															</Box>
															Reward
														</>
													)}

													{type === 'move' && (
														<>
															<Box display="inline-flex" mr={1} fontSize={24} position="relative" top={2}>
																<Twemoji svg text="📦" />
															</Box>
															Move
														</>
													)}

													{type === 'set' && (
														<>
															<Box display="inline-flex" mr={1} fontSize={24}>
																<Twemoji svg text="✍️" />
															</Box>
															Set
														</>
													)}

													{type === 'transfer' && (
														<>
															<Box display="inline-flex" mr={1} fontSize={24}>
																<Twemoji svg text="📃" />
															</Box>
															Transfer
														</>
													)}
												</>
											) : (
												'-'
											)}
										</Typography>
									</TableCell>
									<TableCell>
										<Typography noWrap variant="body2">
											{key && space ? (
												<MuiLink component={Link} to={`/s/${space}/${key}/`}>
													{key}
												</MuiLink>
											) : (
												'-'
											)}
										</Typography>
									</TableCell>
									<TableCell>
										<Typography noWrap variant="body2">
											{space ? (
												<MuiLink component={Link} to={`/s/${space}/`}>
													{space}
												</MuiLink>
											) : (
												'-'
											)}
										</Typography>
									</TableCell>
									<TableCell>
										{sender ? <AddressChip address={sender} isObfuscated tooltipPlacement="top" /> : '-'}
									</TableCell>
									<TableCell>{to ? <AddressChip address={to} isObfuscated tooltipPlacement="top" /> : '-'}</TableCell>
									<TableCell>
										{txId ? (
											<AddressChip
												copyText="Copy TxID"
												copySuccessText="TxID copied!"
												address={txId}
												isObfuscated
												tooltipPlacement="top"
											/>
										) : (
											'-'
										)}
									</TableCell>
									<TableCell>
										<Typography noWrap variant="body2">
											{units ? new Intl.NumberFormat('en-US').format(units) : '-'}
										</Typography>
									</TableCell>
									<TableCell>
										<Typography noWrap variant="body2">
											{new Date(Number(timestamp) * 1000).toLocaleString() || '-'}
										</Typography>
									</TableCell>
								</TableRow>
							),
					)}
				</TableBody>
										</Table>*/}
		</>
	) : (
		<Box height={400} />
	)
})
