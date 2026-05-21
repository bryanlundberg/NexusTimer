import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: 'nexus-timer-app',
    name: 'Nexus Timer',
    short_name: 'NXTimer',
    description: 'An end-to-end, highly customizable speedcubing application.',
    start_url: '/app',
    scope: '/',
    display: 'fullscreen',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/android/res/mipmap-mdpi/ic_launcher.png',
        sizes: '48x48',
        type: 'image/png'
      },
      {
        src: '/android/res/mipmap-hdpi/ic_launcher.png',
        sizes: '72x72',
        type: 'image/png'
      },
      {
        src: '/android/res/mipmap-xhdpi/ic_launcher.png',
        sizes: '96x96',
        type: 'image/png'
      },
      {
        src: '/android/res/mipmap-xxhdpi/ic_launcher.png',
        sizes: '144x144',
        type: 'image/png'
      },
      {
        src: '/android/res/mipmap-xxxhdpi/ic_launcher.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/android/play_store_512.png',
        sizes: '512x512',
        type: 'image/png'
      },
      {
        src: '/android/play_store_512.png',
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
    }
  }
}
