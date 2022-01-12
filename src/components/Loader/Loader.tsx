import { memo } from 'react'
import { Box, BoxProps, CircularProgress, CircularProgressProps, Fade } from '@mui/material'

type LoaderProps = {
	loading?: boolean
	noDelay?: boolean
	circularProgressProps?: CircularProgressProps
} & BoxProps

export const Loader = memo(({ loading = true, noDelay = false, circularProgressProps, ...rest }: LoaderProps) => (
	<Fade
		in={!!loading}
		style={{
			transitionDelay: loading && !noDelay ? '1000ms' : '0ms',
		}}
		unmountOnExit
	>
		<Box
			sx={{
				height: 428,
				width: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
			{...rest}
		>
			<CircularProgress {...circularProgressProps} />
		</Box>
	</Fade>
))
