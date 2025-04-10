import React, { Suspense, useState, useTransition } from 'react';
import LoadingFallback from './LoadingFallback';

interface LazyWrapperProps {
  children: React.ReactNode;
}

/**
 * A wrapper component that uses startTransition to handle lazy loading
 * This prevents the "A component suspended while responding to synchronous input" error
 */
const LazyWrapper: React.FC<LazyWrapperProps> = ({ children }) => {
  const [isPending, startTransition] = useTransition();
  const [isLoaded, setIsLoaded] = useState(false);

  // Use startTransition to wrap the initial render
  React.useEffect(() => {
    startTransition(() => {
      setIsLoaded(true);
    });
  }, [startTransition]);

  if (!isLoaded) {
    return <LoadingFallback />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      {children}
    </Suspense>
  );
};

export default LazyWrapper;
