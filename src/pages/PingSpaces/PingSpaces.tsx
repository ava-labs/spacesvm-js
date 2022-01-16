import { CircularProgress, Typography } from '@mui/material'

import { Page } from '@/components/Page'
import { isConnectedToSpacesVM } from '@/utils/quarkvm'

export const PingSpaces = () => {
	const [pingSuccess, setPingSuccess] = useState<boolean | null>(null)
	useEffect(() => {
		const doPingThing = async () => {
			const isConnected = await isConnectedToSpacesVM()
			setPingSuccess(isConnected)
		}
		doPingThing()
		setInterval(doPingThing, 3000)
	}, [])

	return (
		<Page>
			<Typography align="center" variant="h2" color={pingSuccess ? 'green' : 'red'} sx={{ mt: 4 }}>
				{pingSuccess === null ? 'Checking connection to Spaces VM...' : pingSuccess ? 'PING SUCCESSFUL' : 'PING FAILED'}
			</Typography>
			{pingSuccess === undefined && <CircularProgress sx={{ margin: '0 auto', mt: 1 }} />}
		</Page>
	)
}
