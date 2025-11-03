import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Layout from '@/components/organisms/Layout'
import NotFound from '@/components/pages/NotFound'

// Lazy load all page components
const HomePage = lazy(() => import('@/components/pages/HomePage'))
const TrendingPage = lazy(() => import('@/components/pages/TrendingPage'))
const SearchPage = lazy(() => import('@/components/pages/SearchPage'))
const EditorPage = lazy(() => import('@/components/pages/EditorPage'))
const PenDetailPage = lazy(() => import('@/components/pages/PenDetailPage'))
const Login = lazy(() => import('@/components/pages/Login'))
const Signup = lazy(() => import('@/components/pages/Signup'))
const Callback = lazy(() => import('@/components/pages/Callback'))
const ErrorPage = lazy(() => import('@/components/pages/ErrorPage'))
const ResetPassword = lazy(() => import('@/components/pages/ResetPassword'))
const PromptPassword = lazy(() => import('@/components/pages/PromptPassword'))

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-primary-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>
)

// Wrap components in Suspense
const withSuspense = (Component) => (props) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component {...props} />
  </Suspense>
)

// Define main routes
const mainRoutes = [
  { path: "", element: withSuspense(HomePage)(), index: true },
  { path: "trending", element: withSuspense(TrendingPage)() },
  { path: "search", element: withSuspense(SearchPage)() },
  { path: "editor", element: withSuspense(EditorPage)() },
  { path: "editor/:id", element: withSuspense(EditorPage)() },
  { path: "pen/:id", element: withSuspense(PenDetailPage)() },
  { path: "login", element: withSuspense(Login)() },
  { path: "signup", element: withSuspense(Signup)() },
  { path: "callback", element: withSuspense(Callback)() },
  { path: "error", element: withSuspense(ErrorPage)() },
  { path: "prompt-password/:appId/:emailAddress/:provider", element: withSuspense(PromptPassword)() },
  { path: "reset-password/:appId/:fields", element: withSuspense(ResetPassword)() },
  { path: "*", element: <NotFound /> }
]

// Create routes array
const routes = [
  {
    path: "/",
    element: <Layout />,
    children: mainRoutes
  }
]

export const router = createBrowserRouter(routes)