import Image from 'next/image'
import RatedIcon from '@/shared/ui/rate-icon/RateIcon'

const TABLES_DATA = [
  {
    title: 'Built-in Core Features',
    description: 'Essential timer capabilities',
    features: [
      {
        name: 'Random State Scrambles',
        description: 'Instead of random moves, get scrambles that put your cube in a random state.',
        nxTimer: 'check',
        csTimer: 'check',
        cubeDesk: 'check',
        twistyTimer: 'check'
      },
      {
        name: 'Cross-platform support',
        description: 'Access the application on multiple devices and operating systems.',
        nxTimer: 'check',
        csTimer: 'check',
        cubeDesk: 'check',
        twistyTimer: 'cross'
      },
      {
        name: 'Import other timers',
        description: 'Easily import and export your data to and from other popular timers.',
        nxTimer: 'check',
        csTimer: 'cross',
        cubeDesk: 'partial',
        twistyTimer: 'cross'
      },
      {
        name: 'Offline Mode',
        description: 'Use the timer without an internet connection.',
        nxTimer: 'check',
        csTimer: 'check',
        cubeDesk: 'cross',
        twistyTimer: 'check'
      },
      {
        name: 'Statistics per cube',
        description: 'Analyze your performance for each individual cube.',
        nxTimer: 'check',
        csTimer: 'cross',
        cubeDesk: 'cross',
        twistyTimer: 'cross'
      },
      {
        name: 'Cloud Sync',
        description: 'Sync your data across multiple devices via the cloud.',
        nxTimer: 'check',
        csTimer: 'partial',
        cubeDesk: 'check',
        twistyTimer: 'cross'
      },
      {
        name: 'Online Mode',
        description: 'Create rooms and coordinate matches in real time with other users.',
        nxTimer: 'check',
        csTimer: 'partial',
        cubeDesk: 'partial',
        twistyTimer: 'cross'
      }
    ]
  },
  {
    title: 'Statistics & Analysis',
    description: 'In-depth performance insights',
    features: [
      {
        name: 'Global Statistics',
        description: 'Overall stats including averages, best/worst times, and more.',
        nxTimer: 'check',
        csTimer: 'cross',
        cubeDesk: 'check',
        twistyTimer: 'check'
      },
      {
        name: 'Session Statistics',
        description: 'Detailed session stats including averages, best/worst times, and more.',
        nxTimer: 'check',
        csTimer: 'check',
        cubeDesk: 'check',
        twistyTimer: 'check'
      },
      {
        name: 'Cube-specific Stats',
        description: 'Detailed statistics for each individual cube.',
        nxTimer: 'check',
        csTimer: 'cross',
        cubeDesk: 'cross',
        twistyTimer: 'cross'
      },
      {
        name: 'Performance Graphs',
        description: 'Visualize your solving times and trends over time.',
        nxTimer: 'check',
        csTimer: 'check',
        cubeDesk: 'partial',
        twistyTimer: 'partial'
      }
    ]
  },
  {
    title: 'Social & Community',
    description: 'User engagement and social features',
    features: [
      {
        name: 'Profile System',
        description: 'Create and customize your user profile.',
        nxTimer: 'check',
        csTimer: 'cross',
        cubeDesk: 'check',
        twistyTimer: 'cross'
      },
      {
        name: 'Compare Profiles',
        description: 'View and compare profiles of other users.',
        nxTimer: 'check',
        csTimer: 'cross',
        cubeDesk: 'cross',
        twistyTimer: 'cross'
      },
      {
        name: 'Display Personal Bests',
        description: 'Showcase your best times on your profile including averages.',
        nxTimer: 'check',
        csTimer: 'cross',
        cubeDesk: 'partial',
        twistyTimer: 'cross'
      },
      {
        name: 'Display Cubes Owned',
        description: 'Show the cubes you own on your profile.',
        nxTimer: 'check',
        csTimer: 'cross',
        cubeDesk: 'cross',
        twistyTimer: 'cross'
      },
      {
        name: 'Display Trajectory Progress',
        description: 'Show your full solve history and progress over time.',
        nxTimer: 'check',
        csTimer: 'cross',
        cubeDesk: 'cross',
        twistyTimer: 'cross'
      }
    ]
  }
]

export default function LandingFeatureTable() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">Comparison</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">More than just a timer</h2>
          <p className="text-sm md:text-base text-gray-500 mt-5">
            See how NexusTimer compares to other popular cubing timers.
          </p>
        </div>

        <div>
          {TABLES_DATA.map((table, index) => (
            <table key={index} className="w-full table-auto border-collapse max-w-4xl mx-auto mb-2 last:mb-0">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-4 text-left text-gray-700 ps-4 w-full">
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold">{table.title}</p>
                      <p className="text-xs font-normal text-gray-400">{table.description}</p>
                    </div>
                  </th>
                  <th className="py-4 text-gray-700 px-3">
                    <div className="flex flex-col items-center gap-1.5">
                      <Image
                        src="/logo.png"
                        alt="Nexus Timer logo"
                        width={64}
                        height={64}
                        className="size-5"
                        unoptimized
                      />
                      <span className="text-xs font-semibold text-gray-900">NXTimer</span>
                    </div>
                  </th>
                  <th className="py-4 text-xs text-gray-400 align-bottom px-3 font-medium">csTimer</th>
                  <th className="py-4 text-xs text-gray-400 align-bottom text-nowrap px-3 hidden md:table-cell font-medium">
                    Cube Desk
                  </th>
                  <th className="py-4 text-xs text-gray-400 align-bottom text-nowrap px-3 hidden md:table-cell font-medium">
                    Twisty Timer
                  </th>
                </tr>
              </thead>
              <tbody>
                {table.features.map((feature, fIndex) => (
                  <tr key={fIndex} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-5 text-sm text-gray-700 ps-4">
                      <div className="font-medium">{feature.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{feature.description}</div>
                    </td>
                    <td>
                      <RatedIcon type={feature.nxTimer as 'check' | 'cross' | 'partial'} />
                    </td>
                    <td>
                      <RatedIcon type={feature.csTimer as 'check' | 'cross' | 'partial'} />
                    </td>
                    <td className="hidden md:table-cell">
                      <RatedIcon type={feature.cubeDesk as 'check' | 'cross' | 'partial'} />
                    </td>
                    <td className="hidden md:table-cell">
                      <RatedIcon type={feature.twistyTimer as 'check' | 'cross' | 'partial'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
      </div>
    </section>
  )
}
