import { LazyLoadComponent } from 'react-lazy-load-image-component'
import { Box, Button, styled } from '@mui/material'

import ActivityBg from '@/assets/activity.jpg'
import { rainbowButton } from '@/theming/rainbowButton'

const ClaimButton = styled(Button)(({ theme }: any) => ({
	...rainbowButton(theme),
}))

export const ClaimBanner = memo(() => (
	<LazyLoadComponent threshold={300}>
		<Box
			sx={{
				height: '30vh',
				minHeight: 220,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				mt: 8,
				borderRadius: 4,
				backgroundImage: `url(${ActivityBg})`,
				backgroundSize: 'cover',
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'center',
			}}
		>
			<ClaimButton
				onClick={() => {
					// @ts-ignore
					document.querySelector('#layout').scrollTo({ top: 0, left: 0, behavior: 'smooth' })
				}}
				variant="contained"
				size="large"
			>
				Claim your space
			</ClaimButton>
		</Box>
	</LazyLoadComponent>
))
