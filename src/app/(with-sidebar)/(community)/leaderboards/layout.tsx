import React from 'react'

const leaderboardsSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': 'https://nexustimer.com/leaderboards/#itemlist',
  name: 'Nexus Timer Leaderboards',
  description: 'Top speedcubers ranked by their best solve times across different puzzle categories.',
  url: 'https://nexustimer.com/leaderboards',
  numberOfItems: 2,
  itemListOrder: 'https://schema.org/ItemListOrderAscending',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: '3x3x3 Leaderboard',
      description: "Top solve times for the 3x3x3 Rubik's Cube",
      url: 'https://nexustimer.com/leaderboards'
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: '2x2x2 Leaderboard',
      description: 'Top solve times for the 2x2x2 Pocket Cube',
      url: 'https://nexustimer.com/leaderboards'
    }
  ]
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://nexustimer.com'
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Leaderboards',
      item: 'https://nexustimer.com/leaderboards'
    }
  ]
}

export default function LeaderboardsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(leaderboardsSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {children}
    </>
  )
}
