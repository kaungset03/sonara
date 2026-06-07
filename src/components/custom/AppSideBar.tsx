import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Music } from "lucide-react";
import { homeRoutes } from "@/constants/constants";
import { Link } from "@tanstack/react-router";

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border h-16 flex justify-center items-center">
        <div className="flex items-center gap-3 text-primary">
          <div className="flex h-8 w-8 justify-center items-center">
            <Music />
          </div>
          <h2 className="text-lg font-semibold">Tauri Player</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarGroup>
            <SidebarGroupLabel className="font-semibold">
              Your Library
            </SidebarGroupLabel>
            {homeRoutes.map((route) => (
              <SidebarMenuItem key={route.name}>
                <SidebarMenuButton className="rounded-sm w-full h-12 p-0">
                  <Link
                    to={route.href}
                    className="rounded-sm w-full h-full text-xs px-6 flex items-center gap-3"
                    activeProps={{ className: "bg-secondary" }}
                  >
                    <route.icon />
                    {route.name}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel className="font-semibold">
              Playlists
            </SidebarGroupLabel>
            <SidebarMenuItem>
              <SidebarMenuButton className="rounded-none w-full h-12 text-xs px-6">
                Jazz Classics
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="rounded-none w-full h-12 text-xs px-6">
                Nujabes Special
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
