import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { useTheme } from "@/components/custom/ThemeProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { colorOptions, themeOptions } from "@/constants/constants";
import LibraryManagement from "@/features/settings/components/LibraryManagement";
import useGetAppStatsQuery from "@/features/settings/api/useGetAppStatsQuery";
import useAppStore from "@/store/app-store";

export const Route = createFileRoute("/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { setTheme, theme, color, setColor } = useTheme();
  const isShuffleConfig = useAppStore((state) => state.isShuffleConfig);
  const setShuffleConfig = useAppStore((state) => state.setShuffleConfig);

  const repeatModeConfig = useAppStore((state) => state.repeatModeConfig);
  const setRepeatModeConfig = useAppStore((state) => state.setRepeatModeConfig);

  const { data } = useGetAppStatsQuery();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-heading flex items-center gap-3 mb-2">
        <Settings size={24} />
        Settings
      </h1>
      <p className="text-sm text-muted-foreground">
        Customize your music player experience
      </p>
      <div className="space-y-7">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Theme</CardTitle>
            <CardDescription>Choose your preferred theme</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-8 mt-2">
            {themeOptions.map((option) => (
              <div key={option} className="flex items-center gap-2">
                <Input
                  id={option}
                  type="radio"
                  name="theme"
                  value={option}
                  className="size-5 checked:bg-primary"
                  checked={theme === option}
                  onChange={() => setTheme(option)}
                />
                <Label htmlFor={option} className="capitalize">
                  {option}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Accent Color</CardTitle>
            <CardDescription>
              Choose your preferred accent color
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4 mt-2">
            {colorOptions.map((c) => (
              <button
                key={c.name}
                style={{ backgroundColor: c.hex }}
                className={`size-8 rounded-full ${color === c.name ? "ring-2 ring-muted-foreground ring-offset-2" : ""}`}
                onClick={() => setColor(c.name)}
              />
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Playback Behavior</CardTitle>
            <CardDescription>
              Configure default playback settings. Changes take effect on next
              launch.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 mt-2">
            <div className="flex items-center justify-between w-full">
              <div className="space-y-1">
                <Label className="text-sm font-medium">
                  Default Shuffle On
                </Label>
                <p className="text-xs text-muted-foreground">
                  Start playback with shuffle enabled by default.
                </p>
              </div>
              <Input
                type="checkbox"
                className="size-5"
                checked={isShuffleConfig}
                onChange={(e) => setShuffleConfig(e.target.checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between w-full">
              <div className="space-y-1">
                <Label className="text-sm font-medium">
                  Default Repeat Mode
                </Label>
                <p className="text-xs text-muted-foreground">
                  Choose how tracks repeat
                </p>
              </div>
              <select
                className="bg-popover border border-border rounded-md h-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                value={repeatModeConfig}
                onChange={(e) =>
                  setRepeatModeConfig(e.target.value as "off" | "one" | "all")
                }
              >
                <option value="off">Off</option>
                <option value="one">One</option>
                <option value="all">All</option>
              </select>
            </div>
          </CardContent>
        </Card>
        <LibraryManagement />
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">About Sonara</CardTitle>
            <CardDescription>
              Information about the application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-4">
              <img
                src="/128x128@2x.png"
                alt="Sonara"
                className="size-16 rounded-xl"
              />
              <div>
                <h3 className="font-semibold text-lg">Sonara</h3>
                <p className="text-sm text-muted-foreground">
                  Sonara is a lightweight desktop music player focused on speed,
                  simplicity, and your local music library.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Version {data?.app_version}
                </p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <span className="text-muted-foreground">🎵 Songs</span>
              <span className="text-right">{data?.total_songs}</span>
              <span className="text-muted-foreground">👤 Artists</span>
              <span className="text-right">{data?.total_artists}</span>
              <span className="text-muted-foreground">💿 Albums</span>
              <span className="text-right">{data?.total_albums}</span>
              <span className="text-muted-foreground">📁 Folders</span>
              <span className="text-right">{data?.total_folders}</span>
            </div>
            <Separator />
            <p className="text-xs text-muted-foreground text-center">
              © 2026 Sonara • Made with Rust, Tauri and React
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
