import { IoCloseCircleOutline } from 'react-icons/io5'
import { DialogTitle as MuiDialogTitle, IconButton, Tooltip } from '@mui/material'

export interface DialogTitleProps {
	children?: React.ReactNode
	onClose: () => void
}

export const DialogTitle = ({ children, onClose, ...other }: DialogTitleProps) => (
	<MuiDialogTitle style={{ paddingRight: 32 }} {...other}>
		{children}
		{onClose ? (
			<Tooltip title="Close" placement="top">
				<IconButton
					aria-label="close"
					onClick={onClose}
					sx={{
						position: 'absolute',
						right: 12,
						top: 12,
						color: (theme) => theme.palette.grey[500],
					}}
				>
					<IoCloseCircleOutline />
				</IconButton>
			</Tooltip>
		) : null}
	</MuiDialogTitle>
)
