import { Colors } from "@/interfaces/types/colors";
import { useTheme } from "next-themes";
import { useCallback, useEffect } from "react";
import loadSettings from "@/lib/loadSettings";

export default function useWebsiteColors() {
  const { resolvedTheme } = useTheme();

  const generateDarkTheme = (lightTheme: Record<string, any>) => {
    const primaryColor = lightTheme.primary;
    const match = primaryColor.match(/oklch\(([0-9.]+) ([0-9.]+) ([0-9.]+)\)/);

    if (!match) {
      return {
        background: "oklch(0.141 0.005 285.823)",
        foreground: "oklch(0.985 0 0)",
        card: "oklch(0.21 0.006 285.885)",
        "card-foreground": "oklch(0.985 0 0)",
        popover: "oklch(0.21 0.006 285.885)",
        "popover-foreground": "oklch(0.985 0 0)",
        primary: lightTheme.primary,
        "primary-foreground": lightTheme["primary-foreground"],
        secondary: "oklch(0.274 0.006 286.033)",
        "secondary-foreground": "oklch(0.985 0 0)",
        muted: "oklch(0.274 0.006 286.033)",
        "muted-foreground": "oklch(0.705 0.015 286.067)",
        accent: "oklch(0.274 0.006 286.033)",
        "accent-foreground": "oklch(0.985 0 0)",
        destructive: "oklch(0.704 0.191 22.216)",
        "destructive-foreground": "oklch(0.985 0 0)",
        border: "oklch(1 0 0 / 10%)",
        input: "oklch(1 0 0 / 15%)",
        ring: lightTheme.ring,
        "chart-1": "oklch(0.488 0.243 264.376)",
        "chart-2": "oklch(0.696 0.17 162.48)",
        "chart-3": "oklch(0.769 0.188 70.08)",
        "chart-4": "oklch(0.627 0.265 303.9)",
        "chart-5": "oklch(0.645 0.246 16.439)",
        sidebar: "oklch(0.21 0.006 285.885)",
        "sidebar-foreground": "oklch(0.985 0 0)",
        "sidebar-primary": lightTheme["sidebar-primary"],
        "sidebar-primary-foreground": lightTheme["sidebar-primary-foreground"],
        "sidebar-accent": "oklch(0.274 0.006 286.033)",
        "sidebar-accent-foreground": "oklch(0.985 0 0)",
        "sidebar-border": "oklch(1 0 0 / 10%)",
        "sidebar-ring": lightTheme["sidebar-ring"]
      };
    }

    const [_, lightness, chroma, hue] = match;

    const veryDarkChroma = Math.min(parseFloat(chroma) * 0.15, 0.03);
    const darkChroma = Math.min(parseFloat(chroma) * 0.25, 0.05);
    const mediumChroma = Math.min(parseFloat(chroma) * 0.35, 0.07);

    return {
      background: `oklch(0.141 ${veryDarkChroma} ${hue})`,
      foreground: "oklch(0.985 0 0)",
      card: `oklch(0.21 ${darkChroma} ${hue})`,
      "card-foreground": "oklch(0.985 0 0)",
      popover: `oklch(0.21 ${darkChroma} ${hue})`,
      "popover-foreground": "oklch(0.985 0 0)",
      primary: lightTheme.primary,
      "primary-foreground": lightTheme["primary-foreground"],
      secondary: `oklch(0.274 ${mediumChroma} ${hue})`,
      "secondary-foreground": "oklch(0.985 0 0)",
      muted: `oklch(0.274 ${mediumChroma} ${hue})`,
      "muted-foreground": `oklch(0.705 ${mediumChroma} ${hue})`,
      accent: `oklch(0.274 ${mediumChroma} ${hue})`,
      "accent-foreground": "oklch(0.985 0 0)",
      destructive: "oklch(0.704 0.191 22.216)",
      "destructive-foreground": "oklch(0.985 0 0)",
      border: `oklch(0.7 ${veryDarkChroma} ${hue} / 20%)`,
      input: `oklch(0.6 ${veryDarkChroma} ${hue} / 25%)`,
      ring: lightTheme.ring,
      "chart-1": "oklch(0.488 0.243 264.376)",
      "chart-2": "oklch(0.696 0.17 162.48)",
      "chart-3": "oklch(0.769 0.188 70.08)",
      "chart-4": "oklch(0.627 0.265 303.9)",
      "chart-5": "oklch(0.645 0.246 16.439)",
      sidebar: `oklch(0.21 ${darkChroma} ${hue})`,
      "sidebar-foreground": "oklch(0.985 0 0)",
      "sidebar-primary": lightTheme["sidebar-primary"],
      "sidebar-primary-foreground": lightTheme["sidebar-primary-foreground"],
      "sidebar-accent": `oklch(0.274 ${mediumChroma} ${hue})`,
      "sidebar-accent-foreground": "oklch(0.985 0 0)",
      "sidebar-border": `oklch(0.3 ${veryDarkChroma} ${hue} / 20%)`,
      "sidebar-ring": lightTheme["sidebar-ring"]
    };
  };

  const applyColorTheme = useCallback((color: Colors) => {
    const colors = {
      yellow: {
        base: {
          ":root": {
            background: "oklch(1 0 0)",
            foreground: "oklch(0.141 0.005 285.823)",
            card: "oklch(1 0 0)",
            "card-foreground": "oklch(0.141 0.005 285.823)",
            popover: "oklch(1 0 0)",
            "popover-foreground": "oklch(0.141 0.005 285.823)",
            primary: "oklch(0.795 0.184 86.047)",
            "primary-foreground": "oklch(0.421 0.095 57.708)",
            secondary: "oklch(0.967 0.001 286.375)",
            "secondary-foreground": "oklch(0.21 0.006 285.885)",
            muted: "oklch(0.967 0.001 286.375)",
            "muted-foreground": "oklch(0.552 0.016 285.938)",
            accent: "oklch(0.967 0.001 286.375)",
            "accent-foreground": "oklch(0.21 0.006 285.885)",
            destructive: "oklch(0.577 0.245 27.325)",
            "destructive-foreground": "oklch(0.421 0.095 57.708)",
            border: "oklch(0.92 0.004 286.32)",
            input: "oklch(0.92 0.004 286.32)",
            ring: "oklch(0.795 0.184 86.047)",
            radius: "0.65rem",
            "chart-1": "oklch(0.646 0.222 41.116)",
            "chart-2": "oklch(0.6 0.118 184.704)",
            "chart-3": "oklch(0.398 0.07 227.392)",
            "chart-4": "oklch(0.828 0.189 84.429)",
            "chart-5": "oklch(0.769 0.188 70.08)",
            sidebar: "oklch(0.985 0 0)",
            "sidebar-foreground": "oklch(0.141 0.005 285.823)",
            "sidebar-primary": "oklch(0.795 0.184 86.047)",
            "sidebar-primary-foreground": "oklch(0.421 0.095 57.708)",
            "sidebar-accent": "oklch(0.967 0.001 286.375)",
            "sidebar-accent-foreground": "oklch(0.21 0.006 285.885)",
            "sidebar-border": "oklch(0.92 0.004 286.32)",
            "sidebar-ring": "oklch(0.795 0.184 86.047)"
          },
          ".dark": generateDarkTheme({
            primary: "oklch(0.795 0.184 86.047)",
            "primary-foreground": "oklch(0.421 0.095 57.708)",
            ring: "oklch(0.554 0.135 66.442)",
            "sidebar-primary": "oklch(0.795 0.184 86.047)",
            "sidebar-primary-foreground": "oklch(0.421 0.095 57.708)",
            "sidebar-ring": "oklch(0.554 0.135 66.442)"
          })
        }
      },
      blue: {
        "base": {
          ":root": {
            background: "oklch(1 0 0)",
            foreground: "oklch(0.141 0.005 285.823)",
            card: "oklch(1 0 0)",
            "card-foreground": "oklch(0.141 0.005 285.823)",
            popover: "oklch(1 0 0)",
            "popover-foreground": "oklch(0.141 0.005 285.823)",
            primary: "oklch(0.623 0.214 259.815)",
            "primary-foreground": "oklch(0.97 0.014 254.604)",
            secondary: "oklch(0.967 0.001 286.375)",
            "secondary-foreground": "oklch(0.21 0.006 285.885)",
            muted: "oklch(0.967 0.001 286.375)",
            "muted-foreground": "oklch(0.552 0.016 285.938)",
            accent: "oklch(0.967 0.001 286.375)",
            "accent-foreground": "oklch(0.21 0.006 285.885)",
            destructive: "oklch(0.577 0.245 27.325)",
            "destructive-foreground": "oklch(0.97 0.014 254.604)",
            border: "oklch(0.92 0.004 286.32)",
            input: "oklch(0.92 0.004 286.32)",
            ring: "oklch(0.623 0.214 259.815)",
            radius: "0.65rem",
            "chart-1": "oklch(0.646 0.222 41.116)",
            "chart-2": "oklch(0.6 0.118 184.704)",
            "chart-3": "oklch(0.398 0.07 227.392)",
            "chart-4": "oklch(0.828 0.189 84.429)",
            "chart-5": "oklch(0.769 0.188 70.08)",
            sidebar: "oklch(0.985 0 0)",
            "sidebar-foreground": "oklch(0.141 0.005 285.823)",
            "sidebar-primary": "oklch(0.623 0.214 259.815)",
            "sidebar-primary-foreground": "oklch(0.97 0.014 254.604)",
            "sidebar-accent": "oklch(0.967 0.001 286.375)",
            "sidebar-accent-foreground": "oklch(0.21 0.006 285.885)",
            "sidebar-border": "oklch(0.92 0.004 286.32)",
            "sidebar-ring": "oklch(0.623 0.214 259.815)"
          },
          ".dark": generateDarkTheme({
            primary: "oklch(0.546 0.245 262.881)",
            "primary-foreground": "oklch(0.985 0 0)",
            ring: "oklch(0.488 0.243 264.376)",
            "sidebar-primary": "oklch(0.546 0.245 262.881)",
            "sidebar-primary-foreground": "oklch(0.379 0.146 265.522)",
            "sidebar-ring": "oklch(0.488 0.243 264.376)"
          })
        }
      },
      green: {
        base: {
          ":root": {
            background: "oklch(1 0 0)",
            foreground: "oklch(0.141 0.005 285.823)",
            card: "oklch(1 0 0)",
            "card-foreground": "oklch(0.141 0.005 285.823)",
            popover: "oklch(1 0 0)",
            "popover-foreground": "oklch(0.141 0.005 285.823)",
            primary: "oklch(0.723 0.219 149.579)",
            "primary-foreground": "oklch(0.982 0.018 155.826)",
            secondary: "oklch(0.967 0.001 286.375)",
            "secondary-foreground": "oklch(0.21 0.006 285.885)",
            muted: "oklch(0.967 0.001 286.375)",
            "muted-foreground": "oklch(0.552 0.016 285.938)",
            accent: "oklch(0.967 0.001 286.375)",
            "accent-foreground": "oklch(0.21 0.006 285.885)",
            destructive: "oklch(0.577 0.245 27.325)",
            "destructive-foreground": "oklch(0.982 0.018 155.826)",
            border: "oklch(0.92 0.004 286.32)",
            input: "oklch(0.92 0.004 286.32)",
            ring: "oklch(0.723 0.219 149.579)",
            radius: "0.65rem",
            "chart-1": "oklch(0.646 0.222 41.116)",
            "chart-2": "oklch(0.6 0.118 184.704)",
            "chart-3": "oklch(0.398 0.07 227.392)",
            "chart-4": "oklch(0.828 0.189 84.429)",
            "chart-5": "oklch(0.769 0.188 70.08)",
            sidebar: "oklch(0.985 0 0)",
            "sidebar-foreground": "oklch(0.141 0.005 285.823)",
            "sidebar-primary": "oklch(0.723 0.219 149.579)",
            "sidebar-primary-foreground": "oklch(0.982 0.018 155.826)",
            "sidebar-accent": "oklch(0.967 0.001 286.375)",
            "sidebar-accent-foreground": "oklch(0.21 0.006 285.885)",
            "sidebar-border": "oklch(0.92 0.004 286.32)",
            "sidebar-ring": "oklch(0.723 0.219 149.579)"
          },
          ".dark": generateDarkTheme({
            primary: "oklch(0.696 0.17 162.48)",
            "primary-foreground": "oklch(0.974 0.036 174.767)",
            ring: "oklch(0.527 0.154 150.069)",
            "sidebar-primary": "oklch(0.696 0.17 162.48)",
            "sidebar-primary-foreground": "oklch(0.393 0.095 152.535)",
            "sidebar-ring": "oklch(0.527 0.154 150.069)"
          })
        }
      },
      violet: {
        base: {
          ":root": {
            background: "oklch(1 0 0)",
            foreground: "oklch(0.141 0.005 285.823)",
            card: "oklch(1 0 0)",
            "card-foreground": "oklch(0.141 0.005 285.823)",
            popover: "oklch(1 0 0)",
            "popover-foreground": "oklch(0.141 0.005 285.823)",
            primary: "oklch(0.606 0.25 292.717)",
            "primary-foreground": "oklch(0.969 0.016 293.756)",
            secondary: "oklch(0.967 0.001 286.375)",
            "secondary-foreground": "oklch(0.21 0.006 285.885)",
            muted: "oklch(0.967 0.001 286.375)",
            "muted-foreground": "oklch(0.552 0.016 285.938)",
            accent: "oklch(0.967 0.001 286.375)",
            "accent-foreground": "oklch(0.21 0.006 285.885)",
            destructive: "oklch(0.577 0.245 27.325)",
            "destructive-foreground": "oklch(0.969 0.016 293.756)",
            border: "oklch(0.92 0.004 286.32)",
            input: "oklch(0.92 0.004 286.32)",
            ring: "oklch(0.606 0.25 292.717)",
            radius: "0.65rem",
            "chart-1": "oklch(0.646 0.222 41.116)",
            "chart-2": "oklch(0.6 0.118 184.704)",
            "chart-3": "oklch(0.398 0.07 227.392)",
            "chart-4": "oklch(0.828 0.189 84.429)",
            "chart-5": "oklch(0.769 0.188 70.08)",
            sidebar: "oklch(0.985 0 0)",
            "sidebar-foreground": "oklch(0.141 0.005 285.823)",
            "sidebar-primary": "oklch(0.606 0.25 292.717)",
            "sidebar-primary-foreground": "oklch(0.969 0.016 293.756)",
            "sidebar-accent": "oklch(0.967 0.001 286.375)",
            "sidebar-accent-foreground": "oklch(0.21 0.006 285.885)",
            "sidebar-border": "oklch(0.92 0.004 286.32)",
            "sidebar-ring": "oklch(0.606 0.25 292.717)"
          },
          ".dark": generateDarkTheme({
            primary: "oklch(0.541 0.281 293.009)",
            "primary-foreground": "oklch(0.985 0 0)",
            ring: "oklch(0.541 0.281 293.009)",
            "sidebar-primary": "oklch(0.541 0.281 293.009)",
            "sidebar-primary-foreground": "oklch(0.969 0.016 293.756)",
            "sidebar-ring": "oklch(0.541 0.281 293.009)"
          })
        }
      },
      orange: {
        base: {
          ":root": {
            background: "oklch(1 0 0)",
            foreground: "oklch(0.141 0.005 285.823)",
            card: "oklch(1 0 0)",
            "card-foreground": "oklch(0.141 0.005 285.823)",
            popover: "oklch(1 0 0)",
            "popover-foreground": "oklch(0.141 0.005 285.823)",
            primary: "oklch(0.705 0.213 47.604)",
            "primary-foreground": "oklch(0.98 0.016 73.684)",
            secondary: "oklch(0.967 0.001 286.375)",
            "secondary-foreground": "oklch(0.21 0.006 285.885)",
            muted: "oklch(0.967 0.001 286.375)",
            "muted-foreground": "oklch(0.552 0.016 285.938)",
            accent: "oklch(0.967 0.001 286.375)",
            "accent-foreground": "oklch(0.21 0.006 285.885)",
            destructive: "oklch(0.577 0.245 27.325)",
            "destructive-foreground": "oklch(0.98 0.016 73.684)",
            border: "oklch(0.92 0.004 286.32)",
            input: "oklch(0.92 0.004 286.32)",
            ring: "oklch(0.705 0.213 47.604)",
            radius: "0.65rem",
            "chart-1": "oklch(0.646 0.222 41.116)",
            "chart-2": "oklch(0.6 0.118 184.704)",
            "chart-3": "oklch(0.398 0.07 227.392)",
            "chart-4": "oklch(0.828 0.189 84.429)",
            "chart-5": "oklch(0.769 0.188 70.08)",
            sidebar: "oklch(0.985 0 0)",
            "sidebar-foreground": "oklch(0.141 0.005 285.823)",
            "sidebar-primary": "oklch(0.705 0.213 47.604)",
            "sidebar-primary-foreground": "oklch(0.98 0.016 73.684)",
            "sidebar-accent": "oklch(0.967 0.001 286.375)",
            "sidebar-accent-foreground": "oklch(0.21 0.006 285.885)",
            "sidebar-border": "oklch(0.92 0.004 286.32)",
            "sidebar-ring": "oklch(0.705 0.213 47.604)"
          },
          ".dark": generateDarkTheme({
            primary: "oklch(0.646 0.222 41.116)",
            "primary-foreground": "oklch(0.985 0 0)",
            ring: "oklch(0.646 0.222 41.116)",
            "sidebar-primary": "oklch(0.646 0.222 41.116)",
            "sidebar-primary-foreground": "oklch(0.98 0.016 73.684)",
            "sidebar-ring": "oklch(0.646 0.222 41.116)"
          })

        }
      },
      rose: {
        base: {
          ":root": {
            background: "oklch(1 0 0)",
            foreground: "oklch(0.141 0.005 285.823)",
            card: "oklch(1 0 0)",
            "card-foreground": "oklch(0.141 0.005 285.823)",
            popover: "oklch(1 0 0)",
            "popover-foreground": "oklch(0.141 0.005 285.823)",
            primary: "oklch(0.645 0.246 16.439)",
            "primary-foreground": "oklch(0.969 0.015 12.422)",
            secondary: "oklch(0.967 0.001 286.375)",
            "secondary-foreground": "oklch(0.21 0.006 285.885)",
            muted: "oklch(0.967 0.001 286.375)",
            "muted-foreground": "oklch(0.552 0.016 285.938)",
            accent: "oklch(0.967 0.001 286.375)",
            "accent-foreground": "oklch(0.21 0.006 285.885)",
            destructive: "oklch(0.577 0.245 27.325)",
            "destructive-foreground": "oklch(0.969 0.015 12.422)",
            border: "oklch(0.92 0.004 286.32)",
            input: "oklch(0.92 0.004 286.32)",
            ring: "oklch(0.645 0.246 16.439)",
            radius: "0.65rem",
            "chart-1": "oklch(0.646 0.222 41.116)",
            "chart-2": "oklch(0.6 0.118 184.704)",
            "chart-3": "oklch(0.398 0.07 227.392)",
            "chart-4": "oklch(0.828 0.189 84.429)",
            "chart-5": "oklch(0.769 0.188 70.08)",
            sidebar: "oklch(0.985 0 0)",
            "sidebar-foreground": "oklch(0.141 0.005 285.823)",
            "sidebar-primary": "oklch(0.645 0.246 16.439)",
            "sidebar-primary-foreground": "oklch(0.969 0.015 12.422)",
            "sidebar-accent": "oklch(0.967 0.001 286.375)",
            "sidebar-accent-foreground": "oklch(0.21 0.006 285.885)",
            "sidebar-border": "oklch(0.92 0.004 286.32)",
            "sidebar-ring": "oklch(0.645 0.246 16.439)"
          },
          ".dark": generateDarkTheme({
            primary: "oklch(0.645 0.246 16.439)",
            "primary-foreground": "oklch(0.985 0 0)",
            ring: "oklch(0.645 0.246 16.439)",
            "sidebar-primary": "oklch(0.645 0.246 16.439)",
            "sidebar-primary-foreground": "oklch(0.969 0.015 12.422)",
            "sidebar-ring": "oklch(0.645 0.246 16.439)"
          })
        }
      },
      neutral: {
        base: {
          ":root": {
            background: "oklch(1 0 0)",
            foreground: "oklch(0.145 0 0)",
            card: "oklch(1 0 0)",
            "card-foreground": "oklch(0.145 0 0)",
            popover: "oklch(1 0 0)",
            "popover-foreground": "oklch(0.145 0 0)",
            primary: "oklch(0.205 0 0)",
            "primary-foreground": "oklch(0.985 0 0)",
            secondary: "oklch(0.97 0 0)",
            "secondary-foreground": "oklch(0.205 0 0)",
            muted: "oklch(0.97 0 0)",
            "muted-foreground": "oklch(0.556 0 0)",
            accent: "oklch(0.97 0 0)",
            "accent-foreground": "oklch(0.205 0 0)",
            destructive: "oklch(0.577 0.245 27.325)",
            border: "oklch(0.922 0 0)",
            input: "oklch(0.922 0 0)",
            ring: "oklch(0.708 0 0)",
            radius: "0.625rem",
            "chart-1": "oklch(0.646 0.222 41.116)",
            "chart-2": "oklch(0.6 0.118 184.704)",
            "chart-3": "oklch(0.398 0.07 227.392)",
            "chart-4": "oklch(0.828 0.189 84.429)",
            "chart-5": "oklch(0.769 0.188 70.08)",
            sidebar: "oklch(0.985 0 0)",
            "sidebar-foreground": "oklch(0.145 0 0)",
            "sidebar-primary": "oklch(0.205 0 0)",
            "sidebar-primary-foreground": "oklch(0.985 0 0)",
            "sidebar-accent": "oklch(0.97 0 0)",
            "sidebar-accent-foreground": "oklch(0.205 0 0)",
            "sidebar-border": "oklch(0.922 0 0)",
            "sidebar-ring": "oklch(0.708 0 0)"
          },
          ".dark": {
            background: "oklch(0.145 0 0)",
            foreground: "oklch(0.985 0 0)",
            card: "oklch(0.205 0 0)",
            "card-foreground": "oklch(0.985 0 0)",
            popover: "oklch(0.205 0 0)",
            "popover-foreground": "oklch(0.985 0 0)",
            primary: "oklch(0.922 0 0)",
            "primary-foreground": "oklch(0.205 0 0)",
            secondary: "oklch(0.269 0 0)",
            "secondary-foreground": "oklch(0.985 0 0)",
            muted: "oklch(0.269 0 0)",
            "muted-foreground": "oklch(0.708 0 0)",
            accent: "oklch(0.269 0 0)",
            "accent-foreground": "oklch(0.985 0 0)",
            destructive: "oklch(0.704 0.191 22.216)",
            border: "oklch(1 0 0 / 10%)",
            input: "oklch(1 0 0 / 15%)",
            ring: "oklch(0.556 0 0)",
            "chart-1": "oklch(0.488 0.243 264.376)",
            "chart-2": "oklch(0.696 0.17 162.48)",
            "chart-3": "oklch(0.769 0.188 70.08)",
            "chart-4": "oklch(0.627 0.265 303.9)",
            "chart-5": "oklch(0.645 0.246 16.439)",
            sidebar: "oklch(0.205 0 0)",
            "sidebar-foreground": "oklch(0.985 0 0)",
            "sidebar-primary": "oklch(0.488 0.243 264.376)",
            "sidebar-primary-foreground": "oklch(0.985 0 0)",
            "sidebar-accent": "oklch(0.269 0 0)",
            "sidebar-accent-foreground": "oklch(0.985 0 0)",
            "sidebar-border": "oklch(1 0 0 / 10%)",
            "sidebar-ring": "oklch(0.556 0 0)"
          }
        }
      },
      red: {
        base: {
          ":root": {
            background: "oklch(1 0 0)",
            foreground: "oklch(0.141 0.005 285.823)",
            card: "oklch(1 0 0)",
            "card-foreground": "oklch(0.141 0.005 285.823)",
            popover: "oklch(1 0 0)",
            "popover-foreground": "oklch(0.141 0.005 285.823)",
            primary: "oklch(0.637 0.237 25.331)",
            "primary-foreground": "oklch(0.971 0.013 17.38)",
            secondary: "oklch(0.967 0.001 286.375)",
            "secondary-foreground": "oklch(0.21 0.006 285.885)",
            muted: "oklch(0.967 0.001 286.375)",
            "muted-foreground": "oklch(0.552 0.016 285.938)",
            accent: "oklch(0.967 0.001 286.375)",
            "accent-foreground": "oklch(0.21 0.006 285.885)",
            destructive: "oklch(0.577 0.245 27.325)",
            "destructive-foreground": "oklch(0.971 0.013 17.38)",
            border: "oklch(0.92 0.004 286.32)",
            input: "oklch(0.92 0.004 286.32)",
            ring: "oklch(0.637 0.237 25.331)",
            radius: "0.65rem",
            "chart-1": "oklch(0.646 0.222 41.116)",
            "chart-2": "oklch(0.6 0.118 184.704)",
            "chart-3": "oklch(0.398 0.07 227.392)",
            "chart-4": "oklch(0.828 0.189 84.429)",
            "chart-5": "oklch(0.769 0.188 70.08)",
            sidebar: "oklch(0.985 0 0)",
            "sidebar-foreground": "oklch(0.141 0.005 285.823)",
            "sidebar-primary": "oklch(0.637 0.237 25.331)",
            "sidebar-primary-foreground": "oklch(0.971 0.013 17.38)",
            "sidebar-accent": "oklch(0.967 0.001 286.375)",
            "sidebar-accent-foreground": "oklch(0.21 0.006 285.885)",
            "sidebar-border": "oklch(0.92 0.004 286.32)",
            "sidebar-ring": "oklch(0.637 0.237 25.331)"
          },
          ".dark": generateDarkTheme({
            primary: "oklch(0.637 0.237 25.331)",
            "primary-foreground": "oklch(0.985 0 0)",
            ring: "oklch(0.637 0.237 25.331)",
            "sidebar-primary": "oklch(0.637 0.237 25.331)",
            "sidebar-primary-foreground": "oklch(0.971 0.013 17.38)",
            "sidebar-ring": "oklch(0.637 0.237 25.331)"
          })
        }
      }
    };

    const colorConfig = colors[color as keyof typeof colors]?.base;
    if (!colorConfig) return;

    if (resolvedTheme === "light") {
      Object.entries(colorConfig[":root"] || {}).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${key}`, value as string);
      });
    } else if (resolvedTheme === "dark") {
      Object.entries(colorConfig[".dark"] || {}).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${key}`, value as string);
      });
    }
  }, [resolvedTheme]);

  useEffect(() => {
    applyColorTheme(loadSettings().preferences.colorTheme);
  }, [applyColorTheme, resolvedTheme]);

  return { applyColorTheme };
}
