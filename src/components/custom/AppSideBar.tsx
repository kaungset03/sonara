import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Music, PlusCircle } from "lucide-react";
import { homeRoutes, playlistRoutes } from "@/constants/constants";
import { Link } from "@tanstack/react-router";

const AppSidebar = () => {
  return (
    <Sidebar variant="floating" className="pb-25">
      <SidebarHeader className="h-16 flex justify-center items-center">
        <div className="flex items-center gap-3 text-primary">
          <div className="flex h-8 w-8 justify-center items-center">
            <Music />
          </div>
          <h2 className="text-lg font-semibold font-heading">Tauri Player</h2>
        </div>
      </SidebarHeader>
      <SidebarContent className="overscroll-contain w-full h-full">
        <SidebarGroup className="space-y-1">
          <SidebarGroupLabel className="font-semibold font-heading">
            Your Library
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="space-y-1">
          <SidebarGroupLabel className="font-semibold font-heading">
            Your Playlists
            <Button size="icon" variant="ghost" className="ml-auto">
              <PlusCircle size={14} />
            </Button>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {playlistRoutes.map((route) => (
                <SidebarMenuItem key={route.id}>
                  <SidebarMenuButton className="w-full h-12 p-0">
                    <Link
                      to={"/playlists/$id"}
                      params={{ id: route.id.toString() }}
                      className="w-full h-full text-xs px-6 flex items-center gap-3"
                      activeProps={{ className: "bg-secondary" }}
                    >
                      {route.name}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
