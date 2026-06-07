import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSideBar from "@/components/custom/AppSideBar";

const RootLayout = () => (
  <>
    <SidebarProvider>
      <AppSideBar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
