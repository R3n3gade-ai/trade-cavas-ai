import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { userRoutes } from "./user-routes";
import ErrorBoundary from "./components/ErrorBoundary";
import LazyWrapper from "./components/LazyWrapper";

// Import Canvas component for default route
const Canvas = lazy(() => import("./pages/Canvas"));

const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const SomethingWentWrongPage = lazy(
  () => import("./pages/SomethingWentWrongPage"),
);

// Wrap all routes with LazyWrapper for proper suspense handling
const wrappedRoutes = userRoutes.map(route => ({
  ...route,
  element: (
    <ErrorBoundary>
      <LazyWrapper>
        {route.element}
      </LazyWrapper>
    </ErrorBoundary>
  )
}));

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ErrorBoundary>
        <LazyWrapper>
          <Canvas />
        </LazyWrapper>
      </ErrorBoundary>
    ),
    errorElement: <ErrorBoundary />
  },
  ...wrappedRoutes,
  {
    path: "*",
    element: (
      <ErrorBoundary>
        <LazyWrapper>
          <NotFoundPage />
        </LazyWrapper>
      </ErrorBoundary>
    ),
    errorElement: <ErrorBoundary fallback={<SomethingWentWrongPage />} />
  },
]);