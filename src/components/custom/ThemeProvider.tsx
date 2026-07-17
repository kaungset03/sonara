import { createContext, use, useEffect, useState } from "react";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKeyMode?: string;
  defaultColor?: string;
  storageKeyColor?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  color: string;
  setColor: (color: string) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  color: "green",
  setColor: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKeyMode = "vite-ui-theme",
  defaultColor = "green",
  storageKeyColor = "vite-ui-color",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKeyMode) as Theme) || defaultTheme,
  );

  const [color, setColor] = useState<string>(
    () => (localStorage.getItem(storageKeyColor) as string) || defaultColor,
  );

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    root.setAttribute("data-theme", color);
  }, [theme, color]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKeyMode, theme);
      setTheme(theme);
    },
    color,
    setColor: (color: string) => {
      localStorage.setItem(storageKeyColor, color);
      setColor(color);
    },
  };

  return (
    <ThemeProviderContext {...props} value={value}>
      {children}
    </ThemeProviderContext>
  );
}

export const useTheme = () => {
  const context = use(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
