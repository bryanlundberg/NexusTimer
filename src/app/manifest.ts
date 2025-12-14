import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: 'nexus-timer-app',
    name: 'Nexus Timer',
    short_name: 'NXTimer',
    description: 'An end to end highly customizable speedcubing application.',
    start_url: '/app',
    scope: '/',
    display: 'fullscreen',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon512_rounded.png',
        sizes: '512x512',
        type: 'image/png',
      }
    ],
    screenshots: [
      {
        src: '/app-mobile-view.png',
        sizes: '595x1173',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Mobile timer interface'
      },
      {
        src: '/app-desktop-view.png',
        sizes: '2052x1179',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Timer Interface'
      }
    ],
    categories: [
      "entertainment",
      "games",
      "productivity",
      "utilities"
    ],
    orientation: 'portrait',
    launch_handler: {
      client_mode: 'focus-existing'
    }
  }
}
