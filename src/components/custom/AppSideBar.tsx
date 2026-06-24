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
import { Settings } from "lucide-react";
import { homeRoutes } from "@/constants/constants";
import CreatePlaylistDialog from "@/features/playlists/components/CreatePlaylistDialog";
import useGetAllPlaylistsQuery from "@/features/playlists/api/useGetAllPlaylistsQuery";

const AppSidebar = () => {
  const { data: playlists } = useGetAllPlaylistsQuery();

  return (
    <Sidebar variant="floating" className="pb-25">
      <SidebarHeader
        data-tauri-drag-region
        className="flex justify-center items-center h-10"
      >
        {/* <WindowControlButtons /> */}
      </SidebarHeader>
      <SidebarContent className="overscroll-contain w-full h-full">
        <SidebarGroup className="space-y-1">
          <SidebarGroupLabel className="font-semibold font-heading">
            Your Library
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {homeRoutes.map((route) => (
                <SidebarMenuItem key={route.name}>
                  <SidebarMenuButton className="w-full h-10 p-0">
                    <Link
                      to={route.href}
                      className="w-full h-full text-xs font-medium px-6 flex items-center gap-3"
                      activeProps={{
                        className: "text-primary-foreground bg-primary",
                      }}
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
            <SidebarMenu className="space-y-1">
              {playlists?.map((playlist) => (
                <SidebarMenuItem key={playlist.id}>
                  <SidebarMenuButton className="w-full h-10 p-0">
                    <Link
                      to={"/playlists/$id"}
                      params={{ id: playlist.id.toString() }}
                      className="w-full h-full text-xs font-medium px-6 flex items-center"
                      activeProps={{
                        className: "text-primary-foreground bg-primary",
                      }}
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
      <SidebarFooter className="border-t border-muted-foreground/20">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full p-0">
              <Link
                to={"/settings"}
                className="w-full h-full text-xs px-6 flex items-center gap-3"
                activeProps={{
                  className: "text-primary-foreground bg-primary",
                }}
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
