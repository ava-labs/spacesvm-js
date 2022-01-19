import { Navigate, useParams } from 'react-router-dom'
import { Box, LinearProgress, Typography } from '@mui/material'

import { Page } from '@/components/Page'
import { URL_REGEX } from '@/constants'
import { rainbowText } from '@/theming/rainbowText'
import { querySpaceKey } from '@/utils/spacesVM'

export const KeyDetails = () => {
	const { spaceId, key } = useParams()
	const [redirecting, setRedirecting] = useState<boolean>(false)
	const [value, setValue] = useState<string | null>(null)
	const [isInvalidPage, setIsInvalidPage] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const getSpaceValue = useCallback(async () => {
		if (!spaceId || !key) {
			setIsInvalidPage(true)
			return
		}
		setIsLoading(true)
		const { value, exists } = await querySpaceKey(spaceId, key)
		console.log(exists)
		if (!exists || value === undefined) {
			setIsInvalidPage(true)
			return
		}
		// redirect if it's a url
		const valueIsUrl = URL_REGEX.test(value)
		if (valueIsUrl) {
			setRedirecting(true)
			window.location.replace(value)
			return
		}
		setValue(value)
		setIsLoading(false)
	}, [spaceId, key])

	useEffect(() => {
		getSpaceValue()
	}, [spaceId, key, getSpaceValue])

	if (isInvalidPage) return <Navigate replace to="/404" />

	if (redirecting) {
		return (
			<Box
				sx={{
					position: 'fixed',
					top: 0,
					right: 0,
					bottom: 0,
					left: 0,
					zIndex: 999999,
					backgroundColor: (theme) => theme.customPalette.customBackground,
				}}
			>
				{value && (
					<Typography
						variant="h1"
						sx={{
							...rainbowText,
							mt: 8,
							textAlign: 'center',
						}}
					>
						{redirecting ? 'Redirecting...' : value}
					</Typography>
				)}
			</Box>
		)
	}

	return (
		<Page>
			{isLoading && <LinearProgress color="secondary" sx={{ position: 'absolute', left: 0, right: 0 }} />}
			{value && (
				<Typography
					variant="h1"
					sx={{
						...rainbowText,
						mt: 8,
						textAlign: 'center',
					}}
				>
					{value}
				</Typography>
			)}
		</Page>
	)
}
