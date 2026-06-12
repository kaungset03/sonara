import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSideBar from "@/components/custom/AppSideBar";
import AppHeader from "@/components/custom/AppHeader";
import AppFooter from "@/components/custom/AppFooter";

const queryClient = new QueryClient();

const RootLayout = () => (
  <html>
    <head>
      <HeadContent />
    </head>
    <body>
      <QueryClientProvider client={queryClient}>
        <SidebarProvider>
          <AppSideBar />
          <SidebarInset>
            <div className="w-full h-screen relative">
              <AppHeader />
              <main className="p-4 w-full">
                <Outlet />
              </main>
              <AppFooter />
            </div>
          </SidebarInset>
        </SidebarProvider>
        <TanStackRouterDevtools />
      </QueryClientProvider>
    </body>
  </html>
);

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        name: "Tauri Player",
        content: "A Tauri-based music player built with React and TypeScript.",
      },
      {
        title: "Tauri Player",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/tauri.svg",
      },
    ],
  }),
  component: RootLayout,
});
