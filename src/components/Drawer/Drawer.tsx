import { Twemoji } from 'react-emoji-render'
import { IoMenu } from 'react-icons/io5'
import { NavLink } from 'react-router-dom'
import {
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	SwipeableDrawer,
	Tooltip,
	Typography,
} from '@mui/material'

import { ThemeToggle } from '../ThemeToggle'

import Javascript from '@/assets/javascript.png'
import Logo from '@/assets/spaces-logo.png'
import Terminal from '@/assets/terminal.png'

export const Drawer = memo(() => {
	const [open, setOpen] = useState<boolean>(false)

	return (
		<>
			<Tooltip title="Menu">
				<IconButton onClick={() => setOpen(true)} edge="end">
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
				<Grid container justifyContent="space-between" alignItems="end">
					<Grid item>
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

				<List sx={{ mt: 4, ml: -2 }}>
					{[
						{ label: 'Home', emoji: <Twemoji svg text="🏠" className="emoji" />, url: '/' },
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
						{
							label: 'SubnetVM',
							emoji: <Twemoji svg text="👨‍💻" className="emoji" />,
							url: 'https://subnetvm.xyz/',
							isExternal: true,
						},
						{
							label: 'SubnetVM JS',
							emoji: <img src={Javascript} width={32} height={32} alt="Javascript logo" style={{ borderRadius: 4 }} />,
							url: 'https://github.com/ava-labs/spacesvm-js',
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
							sx={{ mb: 2, borderRadius: 4 }}
							onClick={() => setOpen(false)}
						>
							<ListItemIcon sx={{ fontSize: 32 }}>{emoji}</ListItemIcon>
							<ListItemText primary={<Typography variant="h5">{label}</Typography>} />
						</ListItem>
					))}
				</List>
			</SwipeableDrawer>
		</>
	)
})
