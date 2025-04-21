import React from "react";
import { Suspense, useTransition, useEffect } from "react";
import { router } from "./router";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { useThemeStore } from "./utils/themeStore";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export const AppWrapper = () => {
  const { applyTheme } = useThemeStore();

  // Apply theme on component mount
  useEffect(() => {
    applyTheme();
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
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
    </ThemeProvider>
  );
};
