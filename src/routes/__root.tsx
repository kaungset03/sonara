import { useEffect } from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSideBar from "@/components/custom/AppSideBar";
import AppHeader from "@/components/custom/AppHeader";
import AppFooter from "@/components/custom/AppFooter";
import { checkForAppUpdates } from "@/utils/updater";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 2,
      networkMode: "always",
    },
    mutations: {
      retry: 2,
      networkMode: "always",
    },
  },
});

const RootLayout = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      void checkForAppUpdates();
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Backspace") return;

      const target = e.target as HTMLElement;

      const isEditable =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable;

      if (!isEditable) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <AppSideBar />
        <SidebarInset>
          <div className="w-full h-screen overflow-auto custom-scrollbar">
            <AppHeader />
            <main className="p-2 mt-18 pb-25 w-full">
              <Outlet />
            </main>
          </div>
        </SidebarInset>
        <AppFooter />
      </SidebarProvider>
      <TanStackRouterDevtools />
    </QueryClientProvider>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
});
