import {
  BookImage,
  Clock,
  Heart,
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
    name: "Recents",
    href: "/",
    icon: Clock,
  },
  {
    name: "Songs",
    href: "/songs",
    icon: Music,
  },
  {
    name: "Albums",
    href: "/albums",
    icon: BookImage,
  },
  {
    name: "Artists",
    href: "/artists",
    icon: User,
  },
  {
    name: "Favorites",
    href: "/favorites",
    icon: Heart,
  },
];


export { homeRoutes };
