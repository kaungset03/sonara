import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSideBar from "@/components/custom/AppSideBar";
import AppHeader from "@/components/custom/AppHeader";
import AppFooter from "../components/custom/AppFooter";

const RootLayout = () => (
  <>
    <SidebarProvider>
      <AppSideBar />
      <SidebarInset>
        <AppHeader />
        <main className="p-4 w-full">
          <Outlet />
        </main>
        <AppFooter />
      </SidebarInset>
    </SidebarProvider>

    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
