import { Suspense, useTransition, useEffect } from "react";
import { router } from "./router-new";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { useThemeStore } from "./utils/themeStore";

export const AppWrapper = () => {
  const { applyTheme } = useThemeStore();

  // Apply theme on component mount
  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  return (
    <>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      }>
        <RouterProvider router={router} />
      </Suspense>
      <Toaster position="top-center" richColors />
    </>
  );
};
