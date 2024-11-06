"use client";
import { Button } from "@/components/ui/button";

import * as React from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import {
  BarChartIcon,
  CircleIcon,
  CubeIcon,
  DesktopIcon,
  FileIcon,
  GearIcon,
  MoonIcon,
  PersonIcon,
  SunIcon,
  TokensIcon,
} from "@radix-ui/react-icons";

import { Swords } from "lucide-react"; // Online mode

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import genId from "@/lib/genId";

interface ListItem {
  icon: React.ReactNode;
  name: string;
  url: string;
  disabled?: boolean;
}

interface List {
  [group: string]: ListItem[];
}

export default function ButtonNavbar() {
  const [open, setOpen] = React.useState(false);
  const { setTheme } = useTheme();
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const list: List = {
    suggestions: [
      {
        icon: (
          <Image
            src="/logo.png"
            alt="logo"
            width={16}
            height={16}
            className="border rounded-full size-5 invert p-0.5 bg-white"
          />
        ),
        name: "Play",
        url: "/",
      },
      {
        icon: <TokensIcon />,
        name: "Solves",
        url: "/solves",
      },
      {
        icon: <BarChartIcon />,
        name: "Stats",
        url: "/stats",
      },
      {
        icon: <CubeIcon />,
        name: "Cubes",
        url: "/cubes",
      },
      {
        icon: <GearIcon />,
        name: "Options",
        url: "/settings/options",
      },
    ],
    account: [
      {
        icon: <PersonIcon />,
        name: "Profile",
        url: "/settings/account",
      },
      {
        icon: <CircleIcon />,
        name: "Save",
        url: "/settings/account/save",
      },
      {
        icon: <CircleIcon />,
        name: "Load",
        url: "/settings/account/load",
      },
    ],

    links: [
      {
        icon: <FileIcon />,
        name: "Terms and conditions",
        url: "/settings/help/terms-and-conditions",
      },
      {
        icon: <FileIcon />,
        name: "Policy privacy",
        url: "/settings/help/privacy-policy",
      },
    ],

    options: [
      {
        icon: <GearIcon />,
        name: "Options",
        url: "/settings/options",
      },
      {
        icon: <CircleIcon />,
        name: "Region",
        url: "/settings/options#region",
      },
      {
        icon: <CircleIcon />,
        name: "Timer",
        url: "/settings/options#timer",
      },
      {
        icon: <CircleIcon />,
        name: "Features",
        url: "/settings/options#features",
      },
      {
        icon: <CircleIcon />,
        name: "Alerts",
        url: "/settings/options#alerts",
      },
      {
        icon: <CircleIcon />,
        name: "Colors",
        url: "/settings/options#colors",
      },
      {
        icon: <CircleIcon />,
        name: "App data",
        url: "/settings/options#app-data",
      },
      {
        icon: <CircleIcon />,
        name: "Preferences",
        url: "/settings/options#preferences",
      },
    ],

    cubes: [
      {
        icon: <CubeIcon />,
        name: "Cubes",
        url: "/cubes",
      },
      {
        icon: <CircleIcon />,
        name: "Create collection",
        url: "/cubes",
      },
    ],
  };

  return (
    <>
      <Button
        variant={"ghost"}
        className="py-0 px-3"
        onClick={() => setOpen((open) => !open)}
      >
        <p className="text-sm text-muted-foreground">
          Menu{" "}
          <kbd className="hidden pointer-events-none sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </p>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <VisuallyHidden.Root>
          <DialogTitle>NexusTimer Navigation</DialogTitle>
        </VisuallyHidden.Root>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {list.suggestions.map((c) => {
              return (
                <CommandLink
                  url={c.url}
                  label={c.name}
                  icon={c.icon}
                  key={c.url}
                  disabled={c.disabled}
                />
              );
            })}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Account">
            {list.account.map((c) => {
              return (
                <CommandLink
                  url={c.url}
                  label={c.name}
                  icon={c.icon}
                  key={genId()}
                />
              );
            })}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Options">
            {list.options.map((c) => {
              return (
                <CommandLink
                  url={c.url}
                  label={c.name}
                  icon={c.icon}
                  key={c.url}
                />
              );
            })}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Cubes page">
            {list.cubes.map((c) => {
              return (
                <CommandLink
                  url={c.url}
                  label={c.name}
                  icon={c.icon}
                  key={genId()}
                />
              );
            })}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Theme">
            <CommandItem onPointerDown={() => setTheme("light")}>
              <SunIcon />
              Light
            </CommandItem>
            <CommandItem onPointerDown={() => setTheme("dark")}>
              <MoonIcon />
              Dark
            </CommandItem>
            <CommandItem onPointerDown={() => setTheme("system")}>
              <DesktopIcon />
              System
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

function CommandLink({
  url,
  label,
  icon,
  disabled = false,
}: {
  url: string;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
}) {
  const router = useRouter();
  return (
    <Link href={url} aria-disabled={disabled}>
      <CommandItem onSelect={() => router.push(url)} disabled={disabled}>
        {icon}
        {label}
      </CommandItem>
    </Link>
  );
}
