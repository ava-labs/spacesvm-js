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

export const Routes = () => (
	<Suspense fallback={<></>}>
		<Switch>
			<Route path="/" element={<Home />} />
			<Route path="/spaces/:spaceId/:key" element={<KeyDetails />} />
			<Route path="/spaces/:spaceId" element={<SpaceDetails />} />
			<Route path="/spaces/" element={<SpaceDetails />} />
			<Route path="/custom-signature" element={<CustomSignature />} />
			<Route path="/404" element={<Page404 />} />
			<Route path="*" element={<Navigate replace to="/404" />} />
		</Switch>
	</Suspense>
)

export default Routes
