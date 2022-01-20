import { Twemoji } from 'react-emoji-render'
import { IoCloseCircleOutline, IoInformationCircleOutline } from 'react-icons/io5'
import { Box, Button, Drawer, IconButton, Link, Tooltip, Typography } from '@mui/material'

import WhatsASpaceBg from '@/assets/whats-a-space.jpg'

export const WhatIsASpace = memo(() => {
	const [open, setOpen] = useState<boolean>(false)

	return (
		<>
			<Box display="flex" justifyContent="center" sx={{ mt: 1 }}>
				<Button
					onClick={() => setOpen(true)}
					color="secondary"
					size="small"
					startIcon={
						<Box display="flex" position="relative" top={1}>
							<IoInformationCircleOutline />
						</Box>
					}
				>
					What's a space?
				</Button>
			</Box>
			<Drawer
				PaperProps={{
					sx: {
						borderLeft: (theme) => (theme.palette.mode === 'dark' ? '2px solid hsla(0, 0%, 100%, 0.2)' : 'unset'),
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
					<Box sx={{ color: (theme) => theme.palette.grey[400], position: 'absolute', top: 8, left: 8, zIndex: 1 }}>
						<IconButton onClick={() => setOpen(false)} color="inherit">
							<IoCloseCircleOutline />
						</IconButton>
					</Box>
				</Tooltip>
				<Box
					sx={{
						backgroundColor: (theme) => theme.customPalette.customBackground,
						backgroundImage: `url(${WhatsASpaceBg})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						backgroundRepeat: 'no-repeat',
						height: 180,
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						position: 'absolute',
						top: 0,
						right: 0,
						left: 0,
					}}
				>
					<Typography variant="h4" color="#fff" sx={{ fontFamily: 'DM Serif Display' }}>
						What's a space?
					</Typography>
				</Box>
				<Box pt={'180px'}>
					<Typography variant="body1" gutterBottom>
						A space is your digital home. A place to store and share links, images, and files. Instead of living in a
						private server somewhere, your space is stored on a blockchain running in an Avalanche Subnet on the Fuji
						Network (this is only a demo for now 😉).
					</Typography>
					<br />
					<Typography variant="body1">
						Just like a home, the only one who can make changes to a space is the owner (the person who claims the
						space). Not just whoever we say the owner is, no no no. The owner is an EVM-formatted address that is backed
						by a private key in any <Link href="https://eips.ethereum.org/EIPS/eip-712">EIP-712</Link> compatible
						wallet. Only actions signed by this private key can modify a space.
					</Typography>
					<br />
					<Typography variant="body1">
						EIP-712 compliance in this case, however, does not mean that{' '}
						<Link href="https://github.com/ava-labs/spacesvm">SpacesVM</Link> is an EVM or even an EVM derivative.
						SpacesVM is a new Avalanche-native VM written from scratch to optimize for storage-related operations.
					</Typography>
					<br />
					<Typography variant="body1">
						In this demo, the ~970k addresses that have interacted with the{' '}
						<Link href="https://docs.avax.network/learn/platform-overview/#contract-chain-c-chain">
							Avalanche C-Chain
						</Link>{' '}
						more than twice have received an airdrop of <span style={{ fontWeight: 600 }}> 10,000 SPC </span> tokens
						that can be used to claim spaces and store items in them.
					</Typography>
					<br />
					<Typography variant="body1">
						Anyone can run their own SpacesVM instance to store spaces data and/or validate that any modifications that
						occur to spaces are only done by the owner. If you'd like to get involved, check us out on{' '}
						<Link href="https://github.com/ava-labs/spacesvm">Github</Link>!
					</Typography>
					<br />
					<Typography variant="body1">
						Lastly, a short disclaimer. SpacesVM is new, unaudited code and should be treated as such. For this reason,
						the Spaces Chain may be restarted to rollout new features and/or repair any incorrect state. This site
						exists <span style={{ fontWeight: 600 }}> solely </span> to demonstrate the coolness of Avalanche Subnets
						and the VMs you could build on them. If you have any suggestions for what could be improved, open an
						issue/PR on <Link href="https://github.com/ava-labs/spacesvm">SpacesVM</Link> or{' '}
						<Link href="https://github.com/ava-labs/spacesvm-js">SpacesVM JS</Link>.
					</Typography>
					<br />
					<Typography variant="h6" sx={{ fontFamily: 'DM Serif Display' }}>
						- the spaces team <Twemoji svg text="❤️" />
					</Typography>
				</Box>
			</Drawer>
		</>
	)
})
