import { ReactNode, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import LoadingFallback from "../components/LoadingFallback";

interface Props {
  children: ReactNode;
}

export const OuterErrorBoundary = ({ children }: Props) => {
  return (
    <ErrorBoundary
      fallback={
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
      }
      onError={(error) => {
        console.error("Caught error in AppWrapper", error.message, error.stack);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
