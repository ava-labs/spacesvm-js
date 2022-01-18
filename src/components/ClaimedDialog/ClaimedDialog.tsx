import { Twemoji } from 'react-emoji-render'
import { Link } from 'react-router-dom'
import { Box, Button, Dialog, DialogContent, DialogTitle, styled, Typography } from '@mui/material'

import { purpleButton } from '@/theming/purpleButton'
import { rainbowText } from '@/theming/rainbowText'

const SeeItLiveButton = styled(Button)(({ theme }: any) => ({
	...purpleButton(theme),
}))

export const ClaimedDialog = memo(({ spaceId, ...rest }: any) => (
	<Dialog maxWidth="xs" {...rest}>
		<DialogTitle>
			<Typography
				gutterBottom
				variant="h5"
				component="p"
				fontFamily="DM Serif Display"
				align="center"
				sx={{ position: 'relative' }}
			>
				You have successfully claimed your space!{' '}
				<span style={{ position: 'absolute', fontSize: 36, transform: 'translateX(10px) translateY(-4px)' }}>
					<Twemoji svg text="🥳" />
				</span>
			</Typography>
		</DialogTitle>
		<DialogContent>
			<Typography
				gutterBottom
				variant="h3"
				align="center"
				fontFamily="DM Serif Display"
				sx={{
					...rainbowText,
				}}
			>
				{spaceId}
			</Typography>
			<Box display="flex" justifyContent="center" mt={6}>
				<SeeItLiveButton
					variant="contained"
					size="large"
					endIcon={<Twemoji svg text="🔭👀" />}
					fullWidth
					// @ts-ignore
					component={Link}
					to={`/spaces/${spaceId}/`}
				>
					See it live
				</SeeItLiveButton>
			</Box>
		</DialogContent>
	</Dialog>
))
