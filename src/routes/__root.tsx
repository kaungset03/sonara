import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSideBar from "@/components/custom/AppSideBar";
import AppHeader from "@/components/custom/AppHeader";
import AppFooter from "@/components/custom/AppFooter";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
    },
  },
});

const RootLayout = () => (
  <QueryClientProvider client={queryClient}>
    <SidebarProvider>
      <AppSideBar />
      <SidebarInset>
        <div className="w-full h-screen">
          <AppHeader />
          <main className="p-2 pr-3 pb-25 w-full">
            <Outlet />
          </main>
        </div>
      </SidebarInset>
      <AppFooter />
    </SidebarProvider>
    <Toaster
      position="top-right"
      richColors
      toastOptions={{
        duration: 2000,
      }}
    />
    <TanStackRouterDevtools />
  </QueryClientProvider>
);

export const Route = createRootRoute({
  component: RootLayout,
});
