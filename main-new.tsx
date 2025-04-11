import React, { Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import './index.css'
import './styles/gemini-studio.css'

// Import components
import SimpleLanding from './simple-landing'

// Lazy load components
const BasicDashboard = lazy(() => import('./pages/BasicDashboard'))
const Canvas = lazy(() => import('./pages/Canvas'))
const Charts = lazy(() => import('./pages/Charts'))
const Screeners = lazy(() => import('./pages/Screeners'))
const Options = lazy(() => import('./pages/Options'))
const Settings = lazy(() => import('./pages/Settings'))
const TedAI = lazy(() => import('./pages/TedAI'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// Loading component
const LoadingComponent = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-foreground">Loading...</p>
    </div>
  </div>
)

// Error component
const ErrorComponent = () => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <div className="bg-card p-6 rounded-lg shadow-md max-w-md w-full">
      <h2 className="text-xl font-bold mb-4 text-red-500">Something went wrong</h2>
      <p className="text-muted-foreground mb-4">
        The application encountered an error. Please try refreshing the page.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
      >
        Refresh Page
      </button>
    </div>
  </div>
)

// Create router
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/ted-ai" replace />,
    errorElement: <ErrorComponent />
  },
  {
    path: '/dashboard',
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <BasicDashboard />
      </Suspense>
    ),
    errorElement: <ErrorComponent />
  },
  {
    path: '/canvas',
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <Canvas />
      </Suspense>
    ),
    errorElement: <ErrorComponent />
  },
  {
    path: '/charts',
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <Charts />
      </Suspense>
    ),
    errorElement: <ErrorComponent />
  },
  {
    path: '/screeners',
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <Screeners />
      </Suspense>
    ),
    errorElement: <ErrorComponent />
  },
  {
    path: '/options',
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <Options />
      </Suspense>
    ),
    errorElement: <ErrorComponent />
  },
  {
    path: '/settings',
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <Settings />
      </Suspense>
    ),
    errorElement: <ErrorComponent />
  },
  {
    path: '/ted-ai',
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <TedAI />
      </Suspense>
    ),
    errorElement: <ErrorComponent />
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <NotFoundPage />
      </Suspense>
    ),
    errorElement: <ErrorComponent />
  }
])

// Render app
createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
