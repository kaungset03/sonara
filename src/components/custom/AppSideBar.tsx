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
import { Button } from "@/components/ui/button";
import { Music, PlusCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { homeRoutes } from "@/constants/constants";

const AppSidebar = () => {
  return (
    <Sidebar variant="floating">
      <SidebarHeader className="h-16 flex justify-center items-center">
        <div className="flex items-center gap-3 text-primary">
          <div className="flex h-8 w-8 justify-center items-center">
            <Music />
          </div>
          <h2 className="text-lg font-semibold font-heading">Tauri Player</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarGroup className="space-y-1 mt-2">
            <SidebarGroupLabel className="font-semibold font-heading">
              Your Library
            </SidebarGroupLabel>
            {homeRoutes.map((route) => (
              <SidebarMenuItem key={route.name}>
                <SidebarMenuButton className="w-full h-12 p-0">
                  <Link
                    to={route.href}
                    className="w-full h-full text-xs px-6 flex items-center gap-3"
                    activeProps={{ className: "bg-secondary" }}
                  >
                    <route.icon />
                    {route.name}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarGroup>
          <SidebarGroup className="space-y-1 mt-2">
            <SidebarGroupLabel className="font-semibold font-heading flex items-center justify-between">
              Playlists
              <Button variant="ghost" size="icon">
                <PlusCircle size={18} />
              </Button>
            </SidebarGroupLabel>
            <SidebarMenuItem>
              <SidebarMenuButton className="w-full h-12 p-0">
                <Link
                  to={"/playlists/$id"}
                  params={{ id: "jazz-classics" }}
                  className="w-full h-full text-xs px-6 flex items-center gap-3"
                  activeProps={{ className: "bg-secondary" }}
                >
                  Jazz Classics
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="w-full h-12 p-0">
                <Link
                  to={"/playlists/$id"}
                  params={{ id: "nujabes-special" }}
                  className="w-full h-full text-xs px-6 flex items-center gap-3"
                  activeProps={{ className: "bg-secondary" }}
                >
                  Nujabes Special
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
