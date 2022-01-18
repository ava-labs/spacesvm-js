import styled from '@emotion/styled'
import { Button } from '@mui/material'

import { rainbowButton } from '@/theming/rainbowButton'

export const SignButton = styled(Button)(() => ({
	...rainbowButton,
}))
