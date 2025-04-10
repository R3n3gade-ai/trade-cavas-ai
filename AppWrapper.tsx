import { Suspense, useTransition } from "react";
import { DEFAULT_THEME } from "./constants/default-theme";
import { Head } from "./internal-components/Head";
import { ThemeProvider } from "./internal-components/ThemeProvider";
import { OuterErrorBoundary } from "./prod-components/OuterErrorBoundary";
import { RouterProviderWithTransition } from "./router-new";
import LoadingFallback from "./components/LoadingFallback";
import { Toaster } from "./components/ui/toaster";

export const AppWrapper = () => {
  const [isPending, startTransition] = useTransition();

  return (
    <OuterErrorBoundary>
      <ThemeProvider defaultTheme={DEFAULT_THEME}>
        <Suspense fallback={<LoadingFallback />}>
          <RouterProviderWithTransition />
        </Suspense>
        <Head />
        <Toaster />
      </ThemeProvider>
    </OuterErrorBoundary>
  );
};
