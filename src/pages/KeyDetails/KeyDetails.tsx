import { Navigate, useParams } from 'react-router-dom'
import { Box, Typography } from '@mui/material'

import { Page } from '@/components/Page'
import { URL_REGEX } from '@/constants'
import { rainbowText } from '@/theming/rainbowText'
import { querySpaceKey } from '@/utils/spacesVM'

export const KeyDetails = () => {
	const { spaceId, key } = useParams()
	const [redirecting, setRedirecting] = useState<boolean>(false)
	const [value, setValue] = useState<string | null>(null)
	const [isInvalidPage, setIsInvalidPage] = useState<boolean>(false)

	useEffect(() => {
		const getValue = async () => {
			if (!spaceId || !key) return
			const value = await querySpaceKey(spaceId, key)
			if (value === undefined) {
				setIsInvalidPage(true)
				return
			}

			const valueIsUrl = URL_REGEX.test(value)

			if (valueIsUrl) {
				setRedirecting(true)
				// redirect
				window.location.replace(value)
			}

			setValue(value)
		}
		getValue()
	}, [spaceId, key])

	if (isInvalidPage) return <Navigate replace to="/404" />

	if (redirecting)
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

	return (
		<Page>
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
