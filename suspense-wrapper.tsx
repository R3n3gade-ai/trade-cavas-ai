import { Suspense, type ReactNode } from "react";

export const SuspenseWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen w-full bg-background">
        <div className="text-xl text-primary animate-pulse">Loading...</div>
      </div>
    }>
      {children}
    </Suspense>
  );
};
