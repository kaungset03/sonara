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
import { themeOptions } from "@/constants/constants";

export const Route = createFileRoute("/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { setTheme, theme } = useTheme();

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
            <CardTitle>Theme</CardTitle>
            <CardDescription>Choose your preferred theme</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-8 mt-2">
            {themeOptions.map((option) => (
              <div className="flex items-center gap-2">
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
            <CardTitle>Accent Color</CardTitle>
            <CardDescription>
              Choose your preferred accent color
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4 mt-2">
            <div className="size-10 rounded-full bg-blue-500 border-2 border-muted-foreground ring-2 ring-muted-foreground ring-offset-2" />
            <div className="size-10 rounded-full bg-green-500 border border-border hover:scale-105 transition-transform" />
            <div className="size-10 rounded-full bg-yellow-500 border border-border hover:scale-105 transition-transform" />
            <div className="size-10 rounded-full bg-purple-500 border border-border hover:scale-105 transition-transform" />
            <div className="size-10 rounded-full bg-red-500 border border-border hover:scale-105 transition-transform" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Playback Behavior</CardTitle>
            <CardDescription>
              Configure default playback settings
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
              <Input type="checkbox" className="size-5" />
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
              <select className="bg-popover border border-border rounded-md h-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                <option value="off">Off</option>
                <option value="one">One</option>
                <option value="all">All</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
