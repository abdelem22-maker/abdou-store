import {
  Tv,
  Sparkles,
  Palette,
  Bot,
  SquarePlay,
  Music2,
  Clapperboard,
  Castle,
  Play,
  Film,
  Compass,
  LayoutGrid,
  Gamepad2,
  MonitorPlay,
  Bird,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";

export type BrandDef = {
  gradient: string;
  icon: LucideIcon;
  soft: string;
};

export const BRANDS: Record<string, BrandDef> = {
  netflix: {
    gradient: "linear-gradient(140deg,#E50914 0%,#7a0612 100%)",
    icon: Tv,
    soft: "#E50914",
  },
  gemini: {
    gradient: "linear-gradient(140deg,#4E86F7 0%,#A855F7 100%)",
    icon: Sparkles,
    soft: "#7c6cf9",
  },
  canva: {
    gradient: "linear-gradient(140deg,#00C4CC 0%,#7D2AE8 100%)",
    icon: Palette,
    soft: "#00C4CC",
  },
  openai: {
    gradient: "linear-gradient(140deg,#10A37F 0%,#065f46 100%)",
    icon: Bot,
    soft: "#10A37F",
  },
  youtube: {
    gradient: "linear-gradient(140deg,#FF0033 0%,#8a0018 100%)",
    icon: SquarePlay,
    soft: "#FF0033",
  },
  spotify: {
    gradient: "linear-gradient(140deg,#1DB954 0%,#145a2e 100%)",
    icon: Music2,
    soft: "#1DB954",
  },
  shahid: {
    gradient: "linear-gradient(140deg,#13C2B9 0%,#0b4f57 100%)",
    icon: Clapperboard,
    soft: "#13C2B9",
  },
  disney: {
    gradient: "linear-gradient(140deg,#113CCF 0%,#060f4d 100%)",
    icon: Castle,
    soft: "#3b5bfd",
  },
  prime: {
    gradient: "linear-gradient(140deg,#00A8E1 0%,#043d6b 100%)",
    icon: Play,
    soft: "#00A8E1",
  },
  capcut: {
    gradient: "linear-gradient(140deg,#3b3b45 0%,#000000 100%)",
    icon: Film,
    soft: "#8b8b98",
  },
  perplexity: {
    gradient: "linear-gradient(140deg,#20B8CD 0%,#0b5560 100%)",
    icon: Compass,
    soft: "#20B8CD",
  },
  microsoft: {
    gradient: "linear-gradient(140deg,#3f94f0 0%,#D83B01 130%)",
    icon: LayoutGrid,
    soft: "#3f94f0",
  },
  playstation: {
    gradient: "linear-gradient(140deg,#0070D1 0%,#021b3f 100%)",
    icon: Gamepad2,
    soft: "#0070D1",
  },
  iptv: {
    gradient: "linear-gradient(140deg,#F59E0B 0%,#86198f 130%)",
    icon: MonitorPlay,
    soft: "#F59E0B",
  },
  duolingo: {
    gradient: "linear-gradient(140deg,#58CC02 0%,#166b15 100%)",
    icon: Bird,
    soft: "#58CC02",
  },
  generic: {
    gradient: "linear-gradient(140deg,#8b5cf6 0%,#312e81 100%)",
    icon: Zap,
    soft: "#8b5cf6",
  },
};

export function brandOf(key: string): BrandDef {
  return BRANDS[key] ?? BRANDS.generic;
}

export function BrandMark({
  brand,
  className,
  iconClassName,
}: {
  brand: string;
  className?: string;
  iconClassName?: string;
}) {
  const b = brandOf(brand);
  const Icon = b.icon;
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-2xl text-white shadow-lg ring-1 ring-white/20",
        className
      )}
      style={{ background: b.gradient }}
    >
      <Icon className={cn("h-1/2 w-1/2", iconClassName)} strokeWidth={1.8} />
    </div>
  );
}
