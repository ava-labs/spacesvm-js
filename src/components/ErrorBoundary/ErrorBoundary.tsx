import { memo } from 'react'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'
import { FiAlertCircle } from 'react-icons/fi'
import { Alert, AlertTitle, Typography } from '@mui/material'

type ErrorBoundaryFallbackProps = {
	error: Error
	resetErrorBoundary: () => void
}
export const ErrorBoundaryFallback = memo(({ error /*resetErrorBoundary*/ }: ErrorBoundaryFallbackProps) => (
	<Alert
		severity="error"
		icon={<FiAlertCircle />}
		/*action={
			<Button sx={{ whiteSpace: 'nowrap' }} color="error" onClick={() => resetErrorBoundary()}>
				Try again
			</Button>
		}*/
	>
		<AlertTitle>Error</AlertTitle>
		<Typography variant="subtitle2" gutterBottom>
			Something bad happened —{' '}
		</Typography>
		<Typography variant="subtitle2" sx={{ whiteSpace: 'normal' }} component="pre" paragraph>
			{error.message}
		</Typography>
	</Alert>
))

export const ErrorBoundary = memo(({ children }) => (
	<ReactErrorBoundary FallbackComponent={ErrorBoundaryFallback}>{children}</ReactErrorBoundary>
))
