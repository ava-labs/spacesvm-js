import { Link } from 'react-router-dom'
import { Box, Link as MuiLink, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'

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
		}[]
	>()

	useEffect(() => {
		const fetchRecentActivity = async () => {
			const activity = await getLatestActivity()
			setRecentActivity(activity.activity)
		}
		fetchRecentActivity()
	}, [])

	return recentActivity ? (
		<Table>
			<TableHead>
				<TableRow>
					<TableCell>
						<Typography fontFamily="DM Serif Display" variant="h6">
							Type
						</Typography>
					</TableCell>
					<TableCell>
						<Typography fontFamily="DM Serif Display" variant="h6">
							Space
						</Typography>
					</TableCell>
					<TableCell>
						<Typography fontFamily="DM Serif Display" variant="h6">
							Sender
						</Typography>
					</TableCell>
					<TableCell>
						<Typography fontFamily="DM Serif Display" variant="h6">
							To
						</Typography>
					</TableCell>
					<TableCell>
						<Typography fontFamily="DM Serif Display" variant="h6">
							Transaction ID
						</Typography>
					</TableCell>
					<TableCell>
						<Typography fontFamily="DM Serif Display" variant="h6">
							Time
						</Typography>
					</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{recentActivity?.map(
					({ timestamp, to, txId, sender, space, type }, i) =>
						i <= 10 && (
							<TableRow key={`${txId}-${i}`}>
								<TableCell>
									<Typography noWrap variant="body2">
										{type || '-'}
									</Typography>
								</TableCell>
								<TableCell>
									<Typography noWrap variant="body2">
										{space ? (
											<MuiLink component={Link} to={`/spaces/${space}/`}>
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
										{new Date(Number(timestamp) * 1000).toLocaleString() || '-'}
									</Typography>
								</TableCell>
							</TableRow>
						),
				)}
			</TableBody>
		</Table>
	) : (
		<Box height={400} />
	)
})
