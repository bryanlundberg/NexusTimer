import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { useTranslations } from 'next-intl'
import formatTime from '@/shared/lib/formatTime'
import { DeepStatistics, StatisticScope } from '@/shared/types/statistics'
import { Loader2 } from 'lucide-react'
import React from 'react'
import { motion } from 'framer-motion'

interface StatisticsChartProps {
  statistics: DeepStatistics
  loadingProps: Record<string, boolean>
}

export default function StatisticsChart({ statistics, loadingProps }: StatisticsChartProps) {
  const t = useTranslations('Index')

  const columns = [
    { key: 'global', label: t('StatsPage.global'), tooltip: t('StatsPage.global-tooltip') },
    { key: 'sessions', label: t('StatsPage.sessions'), tooltip: t('StatsPage.sessions-tooltip') },
    { key: 'cube-all', label: t('StatsPage.cube-all'), tooltip: t('StatsPage.cube-all-tooltip') },
    { key: 'cube-session', label: t('StatsPage.cube-session'), tooltip: t('StatsPage.cube-session-tooltip') }
  ] as const

  const rowGroups = [
    {
      label: t('HomePage.deviation'),
      loadingKey: 'deviation',
      getValue: (scope: StatisticScope) =>
        statistics.deviation[scope] === 0 ? '--' : formatTime(statistics.deviation[scope])
    },
    {
      label: 'Ao5',
      loadingKey: 'stats',
      getValue: (scope: StatisticScope) =>
        statistics.stats[scope].ao5 === 0 ? '--' : formatTime(statistics.stats[scope].ao5)
    },
    {
      label: 'Ao12',
      loadingKey: 'stats',
      getValue: (scope: StatisticScope) =>
        statistics.stats[scope].ao12 === 0 ? '--' : formatTime(statistics.stats[scope].ao12)
    },
    {
      label: 'Ao50',
      loadingKey: 'stats',
      getValue: (scope: StatisticScope) =>
        statistics.stats[scope].ao50 === 0 ? '--' : formatTime(statistics.stats[scope].ao50)
    },
    {
      label: 'Ao100',
      loadingKey: 'stats',
      getValue: (scope: StatisticScope) =>
        statistics.stats[scope].ao100 === 0 ? '--' : formatTime(statistics.stats[scope].ao100)
    },
    {
      label: 'Ao1000',
      loadingKey: 'stats',
      getValue: (scope: StatisticScope) =>
        statistics.stats[scope].ao1000 === 0 ? '--' : formatTime(statistics.stats[scope].ao1000)
    },
    {
      label: t('StatsPage.best-time'),
      loadingKey: 'best',
      highlight: true,
      getValue: (scope: StatisticScope) => (statistics.best[scope] > 0 ? formatTime(statistics.best[scope]) : '--')
    },
    {
      label: t('StatsPage.average'),
      loadingKey: 'average',
      getValue: (scope: StatisticScope) =>
        statistics.average[scope] === 0 ? '--' : formatTime(statistics.average[scope])
    },
    {
      label: t('StatsPage.time-spent'),
      loadingKey: 'timeSpent',
      getValue: (scope: StatisticScope) => statistics.timeSpent[scope]
    },
    {
      label: t('StatsPage.success-rate'),
      loadingKey: 'successRate',
      getValue: (scope: StatisticScope) =>
        statistics.successRate[scope] === '' ? '--' : statistics.successRate[scope] + '%'
    },
    {
      label: t('StatsPage.counter'),
      loadingKey: 'counter',
      getValue: (scope: StatisticScope) => (statistics.counter[scope] === 0 ? '--' : statistics.counter[scope])
    }
  ]

  const scopes: StatisticScope[] = ['global', 'session', 'cubeAll', 'cubeSession']

  const renderCell = (isLoading: boolean, value: string | number, highlight?: boolean) => {
    if (isLoading) {
      return (
        <TableCell className="text-center">
          <Loader2 className="size-4 animate-spin text-muted-foreground/50 mx-auto" />
        </TableCell>
      )
    }
    return (
      <TableCell
        className={`text-center tabular-nums ${highlight && value !== '--' ? 'text-primary font-semibold' : ''}`}
      >
        {value}
      </TableCell>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4 }}
      className="border border-border/50 rounded-2xl bg-background/80 backdrop-blur-xl overflow-hidden shadow-sm mb-2"
    >
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border/50 bg-muted/30">
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground w-[120px]"></TableHead>
            {columns.map((column) => (
              <TableHead key={column.key} className="text-center">
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                        {column.label}
                        <InformationCircleIcon className="size-3.5 opacity-50" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs">
                      <p>{column.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rowGroups.map((row, index) => (
            <TableRow
              key={row.label}
              className={`border-b border-border/30 transition-colors hover:bg-muted/20 ${index % 2 === 0 ? 'bg-muted/5' : ''}`}
            >
              <TableCell className="font-medium text-sm">{row.label}</TableCell>
              {scopes.map((scope) => (
                <React.Fragment key={scope}>
                  {renderCell(loadingProps[row.loadingKey], row.getValue(scope), 'highlight' in row && !!row.highlight)}
                </React.Fragment>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  )
}
