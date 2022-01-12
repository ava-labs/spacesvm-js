/* istanbul ignore file */

import { FC, memo, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/**
 * This is the main thing you need to use to adapt the react-router v6
 * API to what use-query-params expects.
 *
 * Pass this as the `ReactRouterRoute` prop to QueryParamProvider.
 * Taken from https://github.com/pbeshai/use-query-params/issues/108#issuecomment-785209454
 */
export const RouteAdapter: FC<any> = memo(({ children }) => {
	const navigate = useNavigate()
	const location: any = useLocation()

	const adaptedHistory = useMemo(
		() => ({
			replace(location: any) {
				navigate(location, { replace: true, state: location.state })
			},
			push(location: any) {
				navigate(location, { replace: false, state: location.state })
			},
		}),
		[navigate],
	)

	return children({ history: adaptedHistory, location })
})
