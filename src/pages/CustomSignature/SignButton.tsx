import styled from '@emotion/styled'
import { Button, Theme } from '@mui/material'

import { rainbowButton } from '@/theming/rainbowButton'

export const SignButton: any = styled(Button)((theme: Theme) => ({
	...rainbowButton(theme),
}))
