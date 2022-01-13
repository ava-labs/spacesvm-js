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

export const Routes = () => (
	<Suspense fallback={<></>}>
		<Switch>
			<Route path="/" element={<Home />} />
			<Route path="/spaces/:spaceId" element={<SpaceDetails />} />
			<Route path="*" element={<Navigate replace to="/404" />} />
		</Switch>
	</Suspense>
)

export default Routes
