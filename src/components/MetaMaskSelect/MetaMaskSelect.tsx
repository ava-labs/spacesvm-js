import { useEffect, useState } from 'react'
import { Button, Grid, keyframes, Tooltip, Typography, useTheme } from '@mui/material'
import { useSnackbar } from 'notistack'

import MetaMaskFoxLogo from '@/assets/metamask-fox.svg'
import { useMetaMask } from '@/providers/MetaMaskProvider'

const obfuscateAddress = (str: string): string => {
	const firstChars = str.substr(0, 5)
	const lastChars = str.substr(-4)
	return `${firstChars}...${lastChars}`
}

const growWidth = keyframes`
	0% {
		max-width: 0;
	}
	100% {
		max-width: 300px;
	}
`

const shrinkWidth = keyframes`
	0% {
		max-width: 300px;
	}
	100% {
		max-width: 0;
	}
`

const GrowingGrid = ({ sx, children, ...rest }: any) => (
	<Grid
		sx={{
			...sx,
			animation: `0.3s ${growWidth} ease-in-out`,
			animationDirection: 'forwards',
		}}
		{...rest}
	>
		{children}
	</Grid>
)

const ShrinkingGrid = ({ sx, children, ...rest }: any) => (
	<Grid
		sx={{
			...sx,
			animation: `0.3s ${shrinkWidth} ease-in-out`,
			animationDirection: 'backwards',
			animationFillMode: 'forwards',
		}}
		{...rest}
	>
		{children}
	</Grid>
)

export const MetaMaskSelect = () => {
	const { enqueueSnackbar } = useSnackbar()
	const theme = useTheme()

	const { currentAddress, connectToMetaMask, balance } = useMetaMask()
	const [displayBalance, setDisplayBalance] = useState(balance)

	useEffect(() => {
		if (balance !== null) setDisplayBalance(balance)
	}, [balance, setDisplayBalance])

	const handleMetaMaskClick = () => {
		if (!currentAddress) {
			connectToMetaMask()
			return
		}
		setClipboard()
	}

	const setClipboard = async () => {
		const type = 'text/plain'
		const blob = new Blob([currentAddress], { type })
		const data = [new ClipboardItem({ [type]: blob })]

		navigator.clipboard.write(data).then(
			() => {
				enqueueSnackbar('MetaMask address copied!')
			},
			() => {
				enqueueSnackbar("Can't copy!", { variant: 'error' })
			},
		)
	}

	const AnimatedGrid = balance ? GrowingGrid : ShrinkingGrid

	return (
		<Grid
			container
			sx={{
				backgroundColor: 'hsla(0,0%,100%,0.05)',
				borderRadius: 99999,
			}}
		>
			<Grid item>
				<Tooltip title={currentAddress ? 'Copy address' : 'Connect to MetaMask'}>
					<Button
						startIcon={<img src={MetaMaskFoxLogo} height={24} width={24} alt="Metamask Logo" />}
						variant="outlined"
						color="secondary"
						onClick={handleMetaMaskClick}
						sx={{
							background: theme.customPalette.customBackground,
							'&:hover': { background: theme.customPalette.customBackground },
						}}
					>
						{currentAddress ? obfuscateAddress(currentAddress) : 'Connect'}
					</Button>
				</Tooltip>
			</Grid>
			<AnimatedGrid item>
				<Typography
					noWrap
					variant="h6"
					align="center"
					sx={{ height: '100%', mx: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
				>
					{displayBalance?.toFixed(2)}
					<Typography component="span" color="textSecondary" sx={{ ml: 1 }}>
						SPC
					</Typography>
				</Typography>
			</AnimatedGrid>
		</Grid>
	)
}
