import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { Music, Settings } from "lucide-react";
import { homeRoutes } from "@/constants/constants";
import CreatePlaylistDialog from "@/components/custom/CreatePlaylistDialog";
import useGetAllPlaylistsQuery from "@/features/playlists/useGetAllPlaylistsQuery";

const AppSidebar = () => {
  const { data: playlists } = useGetAllPlaylistsQuery();

  return (
    <Sidebar variant="floating" className="pb-25">
      <SidebarHeader className="h-18 flex justify-center items-center">
        <div className="flex items-center gap-3 text-primary">
          <Music />
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
                  <SidebarMenuButton className="w-full h-10 p-0">
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
          <SidebarGroupLabel className="font-semibold font-heading flex items-center justify-between">
            Your Playlists
            <CreatePlaylistDialog />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {playlists?.map((playlist) => (
                <SidebarMenuItem key={playlist.id}>
                  <SidebarMenuButton className="w-full h-10 p-0">
                    <Link
                      to={"/playlists/$id"}
                      params={{ id: playlist.id.toString() }}
                      className="w-full h-full text-xs px-6 flex items-center"
                      activeProps={{ className: "bg-secondary" }}
                    >
                      {playlist.name}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-secondary">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full p-0">
              <Link
                to={"/settings"}
                className="w-full h-full text-xs px-6 flex items-center gap-3"
                activeProps={{ className: "bg-secondary" }}
              >
                <Settings />
                Settings
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
