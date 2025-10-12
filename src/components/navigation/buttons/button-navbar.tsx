"use client";
import { Button } from "@/components/ui/button";

import * as React from "react";
import { useEffect } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@/components/ui/command";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import {
  BarChartIcon,
  CircleIcon,
  CubeIcon,
  DesktopIcon,
  EnterFullScreenIcon,
  GearIcon,
  GitHubLogoIcon,
  DiscordLogoIcon,
  MoonIcon,
  PersonIcon,
  SunIcon,
  TokensIcon
} from '@radix-ui/react-icons';

import { ApertureIcon, ArrowRightLeftIcon } from 'lucide-react';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useFullScreen } from "@/hooks/useFullScreen";
import useWebsiteColors from "@/hooks/useWebsiteColors";
import { useSettingsModalStore } from '@/store/SettingsModalStore';

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
  const t = useTranslations("Index");
  const [open, setOpen] = React.useState(false);
  const { setTheme } = useTheme();
  const { toggleFullScreen } = useFullScreen();
  const { applyColorTheme } = useWebsiteColors();
  const settings = useSettingsModalStore((state => state.settings));

  useEffect(() => {
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
        name: t("HomePage.title"),
        url: "/"
      },
      {
        icon: <TokensIcon/>,
        name: t("SolvesPage.title"),
        url: "/solves"
      },
      {
        icon: <BarChartIcon/>,
        name: t("StatsPage.title"),
        url: "/stats"
      },
      {
        icon: <CubeIcon/>,
        name: t("CubesPage.title"),
        url: "/cubes"
      },
      {
        icon: <ApertureIcon/>,
        name: "Clash Mode",
        url: "/clash"
      },
      {
        icon: <ArrowRightLeftIcon/>,
        name: t("TransferSolvesPage.title"),
        url: "/transfer-solves"
      },
      {
        icon: <PersonIcon/>,
        name: "More people",
        url: "/people",
      }
    ],
    settings: [
      {
        icon: <GearIcon/>,
        name: t("SettingsPage.options"),
        url: "/settings/options"
      },
      {
        icon: <PersonIcon/>,
        name: t("SettingsPage.account"),
        url: "/settings/account"
      },
      {
        icon: <CircleIcon/>,
        name: t("SettingsPage.help"),
        url: "/settings/help"
      }
    ]
  };

  const handleThemeChange = (theme: string) => {
    setTheme(theme);
    applyColorTheme(settings.preferences.colorTheme);
  };

  return (
    <>
      <Button
        variant={"ghost"}
        className="py-0 px-3"
        onClick={() => setOpen((open) => !open)}
      >
        <p className="text-sm text-muted-foreground">
          {t("Inputs.menu")}{" "}
          <kbd className="hidden pointer-events-none sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </p>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <VisuallyHidden.Root>
          <DialogTitle>NexusTimer Navigation</DialogTitle>
        </VisuallyHidden.Root>
        <CommandInput placeholder={t("Inputs.search")}/>
        <CommandList>
          <CommandEmpty>{t("Inputs.no-results")}</CommandEmpty>
          <CommandGroup heading={t("others.suggestions")}>
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
            <CommandItem onSelect={() => toggleFullScreen()}>
              <EnterFullScreenIcon/>
              {t("Settings-menu.fullscreen")}
            </CommandItem>
          </CommandGroup>
          <CommandSeparator/>
          <CommandGroup heading={t("SettingsPage.title")}>
            {list.settings.map((c) => {
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
          <CommandSeparator/>
          <CommandGroup heading={t("Settings-menu.theme")}>
            <CommandItem onPointerDown={() => handleThemeChange("light")}>
              <SunIcon/>
              {t("Settings-menu.light")}
            </CommandItem>
            <CommandItem onPointerDown={() => handleThemeChange("dark")}>
              <MoonIcon/>
              {t("Settings-menu.dark")}
            </CommandItem>
            <CommandItem onPointerDown={() => handleThemeChange("system")}>
              <DesktopIcon/>
              {t("Settings-menu.system")}
            </CommandItem>
          </CommandGroup>
          <CommandSeparator/>
          <CommandGroup heading={"Socials"}>
            <CommandItem>
              <Link
                href="https://discord.gg/eCgTKcavec"
                target="_blank"
                rel="noopener noreferrer"
                className={"flex items-center gap-2 w-full"}>
              <DiscordLogoIcon/>
              Join Discord
              </Link>
            </CommandItem>
            <CommandItem>
              <Link
                href={"https://github.com/bryanlundberg/NexusTimer"}
                target="_blank"
                rel="noopener noreferrer"
                className={"flex items-center gap-2 w-full"}>
                <GitHubLogoIcon className={"mr-2"}/> Github
              </Link>
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
  disabled = false
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
