import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import "./App.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/custom/ThemeProvider";
import { Toaster } from "sonner";

// Create a new router instance
const router = createRouter({
  routeTree,
  scrollRestoration: true,
  scrollRestorationBehavior: "smooth",
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <TooltipProvider>
        <ThemeProvider
          defaultTheme="dark"
          storageKeyMode="vite-ui-theme"
          defaultColor="blue"
          storageKeyColor="vite-ui-color"
        >
          <RouterProvider router={router} />
          <Toaster
            position="top-right"
            richColors
            toastOptions={{
              duration: 1500,
            }}
          />
        </ThemeProvider>
      </TooltipProvider>
    </StrictMode>,
  );
}
