/* istanbul ignore file */

import { Navigate, Route, Routes as Switch } from 'react-router-dom'

import { CustomSignature } from './CustomSignature/CustomSignature'
import { Home } from './Home/Home'
import { KeyDetails } from './KeyDetails/KeyDetails'
import { Page404 } from './Page404/Page404'
import { PingSpaces } from './PingSpaces/PingSpaces'
import { SpaceDetails } from './SpaceDetails/SpaceDetails'

export const Routes = () => (
	<Switch>
		<Route path="/" element={<Home />} />

		<Route path="/:spaceId/:key" element={<KeyDetails />} />
		<Route path="/:spaceId" element={<SpaceDetails />} />

		<Route path={`/custom.transaction/`} element={<CustomSignature />} />
		<Route path={`/ping.spaces/`} element={<PingSpaces />} />
		<Route path={`/page.404/`} element={<Page404 />} />

		<Route path="*" element={<Navigate replace to={`/page.404/`} />} />
	</Switch>
)

export default Routes
