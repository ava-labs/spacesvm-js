import { IoConstructOutline, IoLink, IoTrashOutline } from 'react-icons/io5'
import {
	Box,
	Card,
	CardContent,
	CircularProgress,
	Grid,
	Grow,
	IconButton,
	LinearProgress,
	Link,
	Link as MuiLink,
	Tooltip,
	Typography,
} from '@mui/material'
import { useSnackbar } from 'notistack'

import { DeleteKeyValueDialog } from '@/components/DeleteKeyValueDialog'
import { LinkPreview } from '@/components/LinkPreview'
import { IMAGE_REGEX, URL_REGEX } from '@/constants'
import { setClipboard } from '@/utils/setClipboard'
import { querySpaceKey } from '@/utils/spacesVM'

const isImgLink = (url: string): boolean => {
	if (typeof url !== 'string') return false
	return url.match(IMAGE_REGEX) != null
}

type SpaceKeyValueRowProps = {
	spaceId: string
	spaceKey: string
	lastTouchTxId: string
	isSpaceOwner: boolean
	onEdit: (key: string, key: string) => void
	refreshSpaceDetails(): void
}

export const SpaceKeyValueRow = ({
	spaceId,
	spaceKey,
	lastTouchTxId,
	isSpaceOwner,
	onEdit,
	refreshSpaceDetails,
}: SpaceKeyValueRowProps) => {
	const { enqueueSnackbar } = useSnackbar()
	const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
	const [valueForKey, setValueForKey] = useState<any>()
	// const [valueMeta, setValueMeta] = useState()
	// const [valueExists, setValueExists] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [loadingImageError, setLoadingImageError] = useState<boolean>(false)

	const getSpaceValue = useCallback(async () => {
		setIsLoading(true)
		const { value } = await querySpaceKey(spaceId, spaceKey)
		setValueForKey(value)
		// setValueMeta(valueMeta)
		// setValueExists(exists)
		setIsLoading(false)
	}, [spaceId, spaceKey])

	// Load space value whenever the value changes, or when there was an update to that key
	useEffect(() => {
		getSpaceValue()
	}, [lastTouchTxId, getSpaceValue])

	const valueIsUrl = URL_REGEX.test(valueForKey)

	return (
		<Grow in>
			<Card
				key={spaceKey}
				component={valueIsUrl ? MuiLink : 'div'}
				href={valueForKey}
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
							{spaceKey}
						</Typography>
						{isLoading && <LinearProgress color="secondary" />}
						{valueIsUrl ? (
							loadingImageError ? (
								<Link component="p">{valueForKey}</Link>
							) : isImgLink(valueForKey) ? (
								<img
									width="100%"
									src={valueForKey}
									alt=""
									style={{ borderRadius: 4 }}
									onError={() => setLoadingImageError(true)}
								/>
							) : (
								<LinkPreview
									url={valueForKey || ''}
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
													onError={() => setLoadingImageError(true)}
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
							valueForKey
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
												value: `${window.location.origin}/spaces/${spaceId}/${spaceKey}/`,
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
											<IconButton
												onClick={(e) => {
													e.preventDefault()
													e.stopPropagation()
													onEdit(spaceKey, valueForKey)
												}}
											>
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
				<DeleteKeyValueDialog
					open={deleteDialogOpen}
					close={() => setDeleteDialogOpen(false)}
					refreshSpaceDetails={refreshSpaceDetails}
					spaceKey={spaceKey}
				/>
			</Card>
		</Grow>
	)
}
