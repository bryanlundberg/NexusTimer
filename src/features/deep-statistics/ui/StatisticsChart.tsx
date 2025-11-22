import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { useTranslations } from 'next-intl'
import formatTime from '@/shared/lib/formatTime'
import { DeepStatistics } from '@/shared/types/statistics'

interface StatisticsChartProps {
  statistics: DeepStatistics
}

export default function StatisticsChart({ statistics }: StatisticsChartProps) {
  const t = useTranslations('Index')

  return (
    <Table className="rounded-md backdrop-blur-lg mb-5">
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={'inline-flex items-center gap-2'}>
                    {t('StatsPage.global')}
                    <InformationCircleIcon className={'size-5'} />
                  </div>
                </TooltipTrigger>
                <TooltipContent side={'bottom'} className={'max-w-xs'}>
                  <p>{t('StatsPage.global-tooltip')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableHead>
          <TableHead>
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={'inline-flex items-center gap-2'}>
                    {t('StatsPage.sessions')}
                    <InformationCircleIcon className={'size-5'} />
                  </div>
                </TooltipTrigger>
                <TooltipContent side={'bottom'} className={'max-w-xs'}>
                  <p>{t('StatsPage.sessions-tooltip')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableHead>
          <TableHead>
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={'inline-flex items-center gap-2'}>
                    C {t('SolvesPage.all')}
                    <InformationCircleIcon className={'size-5'} />
                  </div>
                </TooltipTrigger>
                <TooltipContent side={'bottom'} className={'max-w-xs'}>
                  <p>{t('StatsPage.cube-all-tooltip')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableHead>
          <TableHead>
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={'inline-flex items-center gap-2'}>
                    C {t('SolvesPage.session')}
                    <InformationCircleIcon className={'size-5'} />
                  </div>
                </TooltipTrigger>
                <TooltipContent side={'bottom'} className={'max-w-xs'}>
                  <p>{t('StatsPage.cube-session-tooltip')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>{t('HomePage.deviation')}</TableCell>
          <TableCell>{statistics.deviation.global === 0 ? '--' : formatTime(statistics.deviation.global)}</TableCell>
          <TableCell>{statistics.deviation.session === 0 ? '--' : formatTime(statistics.deviation.session)}</TableCell>
          <TableCell>{statistics.deviation.cubeAll === 0 ? '--' : formatTime(statistics.deviation.cubeAll)}</TableCell>
          <TableCell>
            {statistics.deviation.cubeSession === 0 ? '--' : formatTime(statistics.deviation.cubeSession)}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Ao5</TableCell>
          <TableCell>{statistics.stats.global.ao5 === 0 ? '--' : formatTime(statistics.stats.global.ao5)}</TableCell>
          <TableCell>{statistics.stats.session.ao5 === 0 ? '--' : formatTime(statistics.stats.session.ao5)}</TableCell>
          <TableCell>{statistics.stats.cubeAll.ao5 === 0 ? '--' : formatTime(statistics.stats.cubeAll.ao5)}</TableCell>
          <TableCell>
            {statistics.stats.cubeSession.ao5 === 0 ? '--' : formatTime(statistics.stats.cubeSession.ao5)}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Ao12</TableCell>
          <TableCell>{statistics.stats.global.ao12 === 0 ? '--' : formatTime(statistics.stats.global.ao12)}</TableCell>
          <TableCell>
            {statistics.stats.session.ao12 === 0 ? '--' : formatTime(statistics.stats.session.ao12)}
          </TableCell>
          <TableCell>
            {statistics.stats.cubeAll.ao12 === 0 ? '--' : formatTime(statistics.stats.cubeAll.ao12)}
          </TableCell>
          <TableCell>
            {statistics.stats.cubeSession.ao12 === 0 ? '--' : formatTime(statistics.stats.cubeSession.ao12)}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Ao50</TableCell>
          <TableCell>{statistics.stats.global.ao50 === 0 ? '--' : formatTime(statistics.stats.global.ao50)}</TableCell>
          <TableCell>
            {statistics.stats.session.ao50 === 0 ? '--' : formatTime(statistics.stats.session.ao50)}
          </TableCell>
          <TableCell>
            {statistics.stats.cubeAll.ao50 === 0 ? '--' : formatTime(statistics.stats.cubeAll.ao50)}
          </TableCell>
          <TableCell>
            {statistics.stats.cubeSession.ao50 === 0 ? '--' : formatTime(statistics.stats.cubeSession.ao50)}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Ao100</TableCell>
          <TableCell>
            {statistics.stats.global.ao100 === 0 ? '--' : formatTime(statistics.stats.global.ao100)}
          </TableCell>
          <TableCell>
            {statistics.stats.session.ao100 === 0 ? '--' : formatTime(statistics.stats.session.ao100)}
          </TableCell>
          <TableCell>
            {statistics.stats.cubeAll.ao100 === 0 ? '--' : formatTime(statistics.stats.cubeAll.ao100)}
          </TableCell>
          <TableCell>
            {statistics.stats.cubeSession.ao100 === 0 ? '--' : formatTime(statistics.stats.cubeSession.ao100)}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Ao1000</TableCell>
          <TableCell>
            {statistics.stats.global.ao1000 === 0 ? '--' : formatTime(statistics.stats.global.ao1000)}
          </TableCell>
          <TableCell>
            {statistics.stats.session.ao1000 === 0 ? '--' : formatTime(statistics.stats.session.ao1000)}
          </TableCell>
          <TableCell>
            {statistics.stats.cubeAll.ao1000 === 0 ? '--' : formatTime(statistics.stats.cubeAll.ao1000)}
          </TableCell>
          <TableCell>
            {statistics.stats.cubeSession.ao1000 === 0 ? '--' : formatTime(statistics.stats.cubeSession.ao1000)}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>{t('StatsPage.best-time')}</TableCell>
          <TableCell>{statistics.best.global > 0 ? formatTime(statistics.best.global) : '--'}</TableCell>
          <TableCell>{statistics.best.session > 0 ? formatTime(statistics.best.session) : '--'}</TableCell>
          <TableCell>{statistics.best.cubeAll > 0 ? formatTime(statistics.best.cubeAll) : '--'}</TableCell>
          <TableCell>{statistics.best.cubeSession > 0 ? formatTime(statistics.best.cubeSession) : '--'}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell>{t('StatsPage.average')}</TableCell>
          <TableCell>{statistics.average.global === 0 ? '--' : formatTime(statistics.average.global)}</TableCell>
          <TableCell>{statistics.average.session === 0 ? '--' : formatTime(statistics.average.session)}</TableCell>
          <TableCell>{statistics.average.cubeAll === 0 ? '--' : formatTime(statistics.average.cubeAll)}</TableCell>
          <TableCell>
            {statistics.average.cubeSession === 0 ? '--' : formatTime(statistics.average.cubeSession)}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>{t('StatsPage.time-spent')}</TableCell>
          <TableCell>{statistics.timeSpent.global}</TableCell>
          <TableCell>{statistics.timeSpent.session}</TableCell>
          <TableCell>{statistics.timeSpent.cubeAll}</TableCell>
          <TableCell>{statistics.timeSpent.cubeSession}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell>{t('StatsPage.success-rate')}</TableCell>
          <TableCell>{statistics.successRate.global === '' ? '--' : statistics.successRate.global + '%'}</TableCell>
          <TableCell>{statistics.successRate.session === '' ? '--' : statistics.successRate.session + '%'}</TableCell>
          <TableCell>{statistics.successRate.cubeAll === '' ? '--' : statistics.successRate.cubeAll + '%'}</TableCell>
          <TableCell>
            {statistics.successRate.cubeSession === '' ? '--' : statistics.successRate.cubeSession + '%'}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>{t('StatsPage.counter')}</TableCell>
          <TableCell>{statistics.counter.global === 0 ? '--' : statistics.counter.global}</TableCell>
          <TableCell>{statistics.counter.session === 0 ? '--' : statistics.counter.session}</TableCell>
          <TableCell>{statistics.counter.cubeAll === 0 ? '--' : statistics.counter.cubeAll}</TableCell>
          <TableCell>{statistics.counter.cubeSession === 0 ? '--' : statistics.counter.cubeSession}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
