import { useEffect, useState } from 'react'
import { Box, Button, Grid, keyframes, Tooltip, Typography, useTheme } from '@mui/material'
import { useSnackbar } from 'notistack'

import { TransferFundsDialog } from '../TransferFundsDialog'

import MetaMaskFoxLogo from '@/assets/metamask-fox.svg'
import { useMetaMask } from '@/providers/MetaMaskProvider'
import { numberWithCommas } from '@/utils/numberUtils'
import { obfuscateAddress } from '@/utils/obfuscateAddress'

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
			animation: `1s ${growWidth} ease`,
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
			animation: `1s ${shrinkWidth} ease`,
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
	const [transferOpen, setTransferOpen] = useState(false)

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
		<>
			<Grid
				container
				sx={{
					backgroundColor: (theme) => theme.palette.background.paper,
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
					<Tooltip title="Send SPC">
						<Box display="flex" alignItems="center" height="100%" onClick={() => setTransferOpen(true)}>
							{displayBalance && (
								<Typography
									noWrap
									variant="h6"
									display="flex"
									sx={{
										mx: 2,
										'&:hover': {
											cursor: 'pointer',
										},
									}}
								>
									{numberWithCommas(displayBalance)}
									<Typography
										component="span"
										color="textSecondary"
										sx={{ ml: 1, display: 'flex', alignItems: 'center' }}
									>
										SPC
									</Typography>
								</Typography>
							)}
						</Box>
					</Tooltip>
				</AnimatedGrid>
			</Grid>
			<TransferFundsDialog open={transferOpen} close={() => setTransferOpen(false)} />
		</>
	)
}
