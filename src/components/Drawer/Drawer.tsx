import { Twemoji } from 'react-emoji-render'
import { IoMenu } from 'react-icons/io5'
import { NavLink } from 'react-router-dom'
import {
	Drawer as MuiDrawer,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Tooltip,
	Typography,
} from '@mui/material'

import { ThemeToggle } from '../ThemeToggle'

export const Drawer = memo(() => {
	const [open, setOpen] = useState<boolean>(false)

	return (
		<>
			<Tooltip title="Menu">
				<IconButton onClick={() => setOpen(true)}>
					<IoMenu />
				</IconButton>
			</Tooltip>
			<MuiDrawer
				PaperProps={{
					sx: {
						backgroundColor: (theme) => theme.customPalette.customBackground,
						borderLeft: '2px solid hsla(0, 0%, 100%, 0.2)',
						width: '40vw',
						minWidth: 280,
						p: 6,
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
					<Grid item>
						<ThemeToggle />
					</Grid>
				</Grid>
				<List sx={{ mt: 4, ml: -2 }}>
					{[
						{ label: 'Home', emoji: <Twemoji svg text="🏠" />, url: '/' },
						{
							label: 'GitHub',
							emoji: <Twemoji svg text="👨‍💻" />,
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
							sx={{ mb: 4, borderRadius: 4 }}
							onClick={() => setOpen(false)}
						>
							<ListItemIcon sx={{ fontSize: 32 }}>{emoji}</ListItemIcon>
							<ListItemText primary={<Typography variant="h5">{label}</Typography>} />
						</ListItem>
					))}
				</List>
			</MuiDrawer>
		</>
	)
})
