import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: 'nexus-timer-app',
    name: 'Nexus Timer',
    short_name: 'NXTimer',
    description: 'An end-to-end, highly customizable speedcubing application.',
    start_url: '/app',
    scope: '/',
    display: 'standalone',
    display_override: ['standalone', 'minimal-ui'],
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/android/mipmap-ldpi/ic_launcher.webp',
        sizes: '36x36',
        type: 'image/webp'
      },
      {
        src: '/android/mipmap-mdpi/ic_launcher.webp',
        sizes: '48x48',
        type: 'image/webp'
      },
      {
        src: '/android/mipmap-hdpi/ic_launcher.webp',
        sizes: '72x72',
        type: 'image/webp'
      },
      {
        src: '/android/mipmap-xhdpi/ic_launcher.webp',
        sizes: '96x96',
        type: 'image/webp'
      },
      {
        src: '/android/mipmap-xxhdpi/ic_launcher.webp',
        sizes: '144x144',
        type: 'image/webp'
      },
      {
        src: '/android/mipmap-xxxhdpi/ic_launcher.webp',
        sizes: '192x192',
        type: 'image/webp'
      },
      {
        src: '/android/ic_launcher-web.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/android/playstore-icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ],
    screenshots: [
      {
        src: '/app-mobile-view.webp',
        sizes: '595x1173',
        type: 'image/webp',
        form_factor: 'narrow',
        label: 'Mobile timer interface'
      },
      {
        src: '/app-desktop-view.webp',
        sizes: '2052x1179',
        type: 'image/webp',
        form_factor: 'wide',
        label: 'Timer Interface'
      }
    ],
    categories: ['entertainment', 'games', 'productivity', 'utilities'],
    orientation: 'portrait',
    launch_handler: {
      client_mode: 'focus-existing'
    },
    related_applications: [
      {
        platform: 'play',
        id: 'com.nexustimer',
        url: 'https://play.google.com/store/apps/details?id=com.nexustimer'
      }
    ],
    prefer_related_applications: true
  }
}
