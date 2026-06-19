import {
  BookImage,
  Heart,
  Home,
  Music,
  User,
  type LucideProps,
} from "lucide-react";

type HomeRoute = {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
};

const homeRoutes: HomeRoute[] = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Songs",
    href: "/songs",
    icon: Music,
  },
  {
    name: "Artists",
    href: "/artists",
    icon: User,
  },
  {
    name: "Albums",
    href: "/albums",
    icon: BookImage,
  },
  {
    name: "Favorites",
    href: "/favorites",
    icon: Heart,
  },
];

const themeOptions: Theme[] = ["light", "dark", "system"];

const colorOptions: Color[] = [
  {
    name: "purple",
    hex: "#9264ef",
  },
  {
    name: "red",
    hex: "#e11421",
  },
  {
    name: "green",
    hex: "#00a884",
  },
  {
    name: "blue",
    hex: "#3280ff",
  },
  {
    name: "yellow",
    hex: "#f3bc16",
  },
];

export { homeRoutes, themeOptions, colorOptions };
