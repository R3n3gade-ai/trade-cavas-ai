import React, { lazy, Suspense, useState, useTransition } from "react";
import { createBrowserRouter, RouterProvider, useNavigate } from "react-router-dom";
import LoadingFallback from "./components/LoadingFallback";
import SimpleLanding from "./simple-landing";

// Create a wrapper component for lazy-loaded routes
const LazyRoute = ({ component: Component, ...props }: { component: React.ComponentType<any>, [key: string]: any }) => {
  const [isPending, startTransition] = useTransition();
  const [isLoaded, setIsLoaded] = useState(false);

  // Use startTransition to wrap the initial render
  React.useEffect(() => {
    startTransition(() => {
      setIsLoaded(true);
    });
  }, [startTransition]);

  if (!isLoaded || isPending) {
    return <LoadingFallback />;
  }

  return <Component {...props} />;
};

// Lazy load pages
const BasicDashboard = lazy(() => import("./pages/BasicDashboard"));
const Canvas = lazy(() => import("./pages/Canvas"));
const Charts = lazy(() => import("./pages/Charts"));
const Screeners = lazy(() => import("./pages/Screeners"));
const Options = lazy(() => import("./pages/Options"));
const DarkPool = lazy(() => import("./pages/DarkPool"));
const DarkPoolSimple = lazy(() => import("./pages/DarkPoolSimple"));
const DarkPoolGradual = lazy(() => import("./pages/DarkPoolGradual"));
const TestPage = lazy(() => import("./pages/TestPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// Error component
const ErrorPage = () => (
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
);

// Create routes
const routes = [
  {
    path: "/",
    element: <SimpleLanding />,
    errorElement: <ErrorPage />
  },
  {
    path: "/dashboard",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LazyRoute component={BasicDashboard} />
      </Suspense>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: "/canvas",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LazyRoute component={Canvas} />
      </Suspense>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: "/charts",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LazyRoute component={Charts} />
      </Suspense>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: "/screeners",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LazyRoute component={Screeners} />
      </Suspense>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: "/options",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LazyRoute component={Options} />
      </Suspense>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: "/darkpool",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LazyRoute component={DarkPoolGradual} />
      </Suspense>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: "/test",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LazyRoute component={TestPage} />
      </Suspense>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LazyRoute component={NotFoundPage} />
      </Suspense>
    ),
    errorElement: <ErrorPage />
  }
];

// Create router
export const router = createBrowserRouter(routes);

// Router provider component
export const RouterProviderWithTransition = () => {
  const [isPending, startTransition] = useTransition();

  return (
    <Suspense fallback={<LoadingFallback />}>
      {isPending ? (
        <LoadingFallback />
      ) : (
        <RouterProvider router={router} />
      )}
    </Suspense>
  );
};

export default router;
