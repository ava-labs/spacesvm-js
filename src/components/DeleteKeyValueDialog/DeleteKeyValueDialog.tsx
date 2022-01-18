import { Twemoji } from 'react-emoji-render'
import { useParams } from 'react-router-dom'
import { Button, Dialog, DialogContent, Fade, styled, Theme, Typography, useTheme } from '@mui/material'

import { DialogTitle } from '../DialogTitle'

import MetaMaskFoxLogo from '@/assets/metamask-fox.svg'
import { useMetaMask } from '@/providers/MetaMaskProvider'
import { rainbowButton } from '@/theming/rainbowButton'
import { TxType } from '@/types'
import { getSuggestedFee } from '@/utils/spacesVM'

export const DeleteButton: any = styled(Button)((theme: Theme) => ({
	...rainbowButton(theme),
}))

type DeleteKeyValueDialogProps = {
	open: boolean
	close(): void
	refreshSpaceDetails(): void
	spaceKey?: string
}

export const DeleteKeyValueDialog = ({ open, close, spaceKey, refreshSpaceDetails }: DeleteKeyValueDialogProps) => {
	const theme = useTheme()
	const { signWithMetaMask, issueTx } = useMetaMask()
	const { spaceId } = useParams()
	const [isSigning, setIsSigning] = useState<boolean>(false)

	const handleClose = () => {
		setTimeout(refreshSpaceDetails, 1000)
		close()
	}

	const deleteKeyValue = async () => {
		if (!spaceKey || !spaceId) return
		const { typedData } = await getSuggestedFee({ type: TxType.Delete, space: spaceId, key: spaceKey })
		setIsSigning(true)
		const signature = await signWithMetaMask(typedData)
		setIsSigning(false)
		if (!signature) return
		const success = await issueTx(typedData, signature)
		if (!success) {
			// show some sort of failure dialog
			return
		}
		refreshSpaceDetails()
		handleClose()
	}

	if (spaceKey === undefined) return null

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="xs">
			<DialogTitle onClose={handleClose}>
				<Typography variant="h4" component="p" fontFamily="DM Serif Display" align="center">
					Are you <strong>SURE</strong> you want to delete this item? <Twemoji svg text="🧨" />
				</Typography>
			</DialogTitle>
			<DialogContent sx={{ mt: 3, overflowY: 'hidden' }}>
				<Typography
					variant="h3"
					fontFamily="DM Serif Display"
					align="center"
					sx={{
						backgroundSize: '400% 100%',
						backgroundClip: 'text',
						textFillColor: 'transparent',
						backgroundColor: theme.palette.mode === 'dark' ? 'white' : 'unset',
						animation: 'hue 5s infinite alternate',
						backgroundImage:
							'linear-gradient(60deg,rgba(239,0,143,.5),rgba(110,195,244,.5),rgba(112,56,255,.5),rgba(255,186,39,.5))',
					}}
				>
					{spaceKey}
				</Typography>
				<DeleteButton onClick={deleteKeyValue} fullWidth variant="contained" size="large" sx={{ mt: 6 }}>
					{isSigning ? (
						<Fade in={isSigning}>
							<img src={MetaMaskFoxLogo} alt="metamask-fox" style={{ height: '100%' }} />
						</Fade>
					) : (
						'Delete'
					)}
				</DeleteButton>
			</DialogContent>
		</Dialog>
	)
}
