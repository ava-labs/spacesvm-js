import { Twemoji } from 'react-emoji-render'
import { IoCloseCircleOutline, IoMenu } from 'react-icons/io5'
import { NavLink } from 'react-router-dom'
import {
	Box,
	Divider,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	SwipeableDrawer,
	Tooltip,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material'

import Javascript from '@/assets/javascript.png'
import Logo from '@/assets/spaces-logo.png'
import Terminal from '@/assets/terminal.png'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useMetaMask } from '@/providers/MetaMaskProvider'
import { getOwnedSpaces } from '@/utils/spacesVM'

export const Drawer = memo(() => {
	const [myOwnedSpaces, setOwnedSpaces] = useState<string[]>()
	const [open, setOpen] = useState<boolean>(false)
	const theme = useTheme()
	const { currentAddress } = useMetaMask()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

	useEffect(() => {
		const fetchOwnedSpaces = async () => {
			const ownedSpaces = await getOwnedSpaces(currentAddress)
			setOwnedSpaces(ownedSpaces?.spaces)
		}

		fetchOwnedSpaces()
	}, [currentAddress])

	return (
		<>
			<Tooltip title="Menu">
				<IconButton onClick={() => setOpen(true)} edge={isMobile ? undefined : 'end'}>
					<IoMenu />
				</IconButton>
			</Tooltip>
			<SwipeableDrawer
				onOpen={() => setOpen(true)}
				PaperProps={{
					sx: {
						backgroundColor: (theme) => theme.customPalette.customBackground,
						borderLeft: '2px solid hsla(0, 0%, 100%, 0.2)',
						width: '40vw',
						minWidth: 300,
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
				<Tooltip title="Close" placement="top">
					<Box
						sx={{
							color: (theme) => theme.palette.grey[400],
							position: 'absolute',
							bottom: isMobile ? 12 : 'unset',
							top: isMobile ? 'unset' : 12,
							right: 22,
						}}
					>
						<IconButton onClick={() => setOpen(false)} color="inherit">
							<IoCloseCircleOutline />
						</IconButton>
					</Box>
				</Tooltip>
				<Grid container justifyContent="space-between" alignItems="end" wrap="nowrap">
					<Grid item container>
						<Typography variant="h4" sx={{ fontFamily: 'DM Serif Display' }}>
							Menu
						</Typography>
					</Grid>
					<Grid
						item
						sx={{
							display: {
								sm: 'flex',
								md: 'none',
							},
						}}
					>
						<ThemeToggle />
					</Grid>
				</Grid>

				<List sx={{ mt: 2, ml: -2 }}>
					{[
						{ label: 'Home', emoji: <Twemoji svg text="🏠" className="emoji" />, url: '/' },
						{
							label: 'SpacesVM',
							emoji: <Twemoji svg text="👨‍💻" className="emoji" />,
							url: 'https://subnetvm.xyz/',
							isExternal: true,
						},
						{
							label: 'SpacesVM JS',
							emoji: <img src={Javascript} width={32} height={32} alt="Javascript logo" style={{ borderRadius: 4 }} />,
							url: 'https://github.com/ava-labs/spacesvm-js',
							isExternal: true,
						},
						{
							label: 'Spaces CLI',
							emoji: <img src={Logo} width={32} height={32} alt="Spaces logo" />,
							url: 'https://spaces-cli.xyz/',
							isExternal: true,
						},
						{
							label: 'Subnet CLI',
							emoji: <img src={Terminal} width={32} height={32} alt="Terminal icon" />,
							url: 'https://subnet-cli.xyz/',
							isExternal: true,
						},
					].map(({ label, emoji, url, isExternal }) => (
						<ListItem
							component={isExternal ? 'a' : NavLink}
							// @ts-ignore
							button
							to={url}
							key={label}
							href={isExternal && url}
							target={isExternal && '_blank'}
							sx={{ mb: 1, borderRadius: 4, height: 52 }}
							onClick={() => setOpen(false)}
						>
							<ListItemIcon sx={{ fontSize: 32 }}>{emoji}</ListItemIcon>
							<ListItemText primary={<Typography variant="h5">{label}</Typography>} />
						</ListItem>
					))}
				</List>

				{myOwnedSpaces && (
					<>
						<Divider sx={{ mt: 1 }} />

						<Typography variant="h4" sx={{ fontFamily: 'DM Serif Display', mt: 3 }}>
							Your spaces
						</Typography>

						<List sx={{ mt: 2, ml: -2 }}>
							{myOwnedSpaces.map((space, i) => (
								<ListItem
									component={NavLink}
									// @ts-ignore
									button
									to={`/${space}`}
									key={`${space}-${i}`}
									sx={{ mb: 1, borderRadius: 4, height: 52 }}
									onClick={() => setOpen(false)}
								>
									<ListItemIcon sx={{ fontSize: 32 }}>
										<Twemoji svg text="🔭" className="emoji" />
									</ListItemIcon>

									<ListItemText primary={<Typography variant="h5">{space}</Typography>} />
								</ListItem>
							))}
						</List>
					</>
				)}
			</SwipeableDrawer>
		</>
	)
})
