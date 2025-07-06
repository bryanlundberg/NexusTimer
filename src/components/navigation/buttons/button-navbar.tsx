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
  EnterFullScreenIcon, GitHubLogoIcon,
  MixerHorizontalIcon,
  MoonIcon,
  PersonIcon,
  SunIcon,
  TokensIcon
} from '@radix-ui/react-icons';

import { ArrowRightLeftIcon } from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useFullScreen } from "@/hooks/useFullScreen";
import useWebsiteColors from "@/hooks/useWebsiteColors";
import loadSettings from "@/lib/loadSettings";

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
        icon: <ArrowRightLeftIcon/>,
        name: t("TransferSolvesPage.title"),
        url: "/transfer-solves"
      }
    ],
    settings: [
      {
        icon: <MixerHorizontalIcon/>,
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
    applyColorTheme(loadSettings().preferences.colorTheme);
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
                href="https://discord.gg/cUECp4fr"
                target="_blank"
                rel="noopener noreferrer"
                className={"flex items-center gap-2 w-full"}>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1"
              >
                <path
                  d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
                  fill="currentColor"
                />
              </svg>
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
