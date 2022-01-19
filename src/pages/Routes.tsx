/* istanbul ignore file */

import { lazy, LazyExoticComponent, Suspense } from 'react'
import { Navigate, Route, Routes as Switch } from 'react-router-dom'

// Shortcut method for lazy page imports
// Only to reduce boilerplate
const pageLazyLoader = (key: string): LazyExoticComponent<any> =>
	lazy(() => import(/* @vite-ignore */ `./${key}/${key}.tsx`).then((m) => ({ default: m[key] })))

// Lazy loading all pages
const Home = pageLazyLoader('Home')
const SpaceDetails = pageLazyLoader('SpaceDetails')
const KeyDetails = pageLazyLoader('KeyDetails')
const Page404 = pageLazyLoader('Page404')
const CustomSignature = pageLazyLoader('CustomSignature')
const PingSpaces = pageLazyLoader('PingSpaces')

export const Routes = () => (
	<Suspense fallback={<></>}>
		<Switch>
			<Route path="/" element={<Home />} />

			<Route path="/:spaceId/:key" element={<KeyDetails />} />
			<Route path="/:spaceId" element={<SpaceDetails />} />

			<Route path={`/custom.transaction/`} element={<CustomSignature />} />
			<Route path={`/ping.spaces/`} element={<PingSpaces />} />
			<Route path={`/page.404/`} element={<Page404 />} />

			<Route path="*" element={<Navigate replace to={`/page.404/`} />} />
		</Switch>
	</Suspense>
)

export default Routes
