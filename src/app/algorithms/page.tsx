import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Algorithms',
  description:
    'Explore a wide range of algorithm sets for various puzzles, complete with interactive 3D visualizations to enhance your learning experience.',
  openGraph: {
    title: 'Algorithms',
    description:
      'Explore a wide range of algorithm sets for various puzzles, complete with interactive 3D visualizations to enhance your learning experience.',
    siteName: 'Nexus Timer',
    locale: 'en_US',
    type: 'website'
  }
}

export { default } from '@/pages/algorithms-methods/ui/AlgorithmsMethodsPage'
