import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import LeaderboardTableRow from '@/features/leaderboards-table/ui/LeaderboardTableRow'
import { SolveServer } from '@/entities/solve/model/types'
import { useTranslations } from 'next-intl'

interface LeaderboardTableProps {
  solves: SolveServer[]
}

export default function LeaderboardTable({ solves }: LeaderboardTableProps) {
  const t = useTranslations('Index.LeaderboardsPage.table')
  return (
    <Table containerClassName={'overflow-hidden'}>
      <TableHeader>
        <TableRow>
          <TableHead className="w-20 text-center">#</TableHead>
          <TableHead className="w-full md:w-auto text-center">{t('user')}</TableHead>
          <TableHead className="hidden sm:table-cell">{t('category')}</TableHead>
          <TableHead className="hidden md:table-cell">{t('scramble')}</TableHead>
          <TableHead>{t('time')}</TableHead>
          <TableHead className="hidden sm:table-cell">{t('image')}</TableHead>
          <TableHead className="hidden sm:table-cell">{t('date')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(solves && solves.length > 0 ? solves : []).map((solve: any, index: number) => {
          return <LeaderboardTableRow key={solve._id} solve={solve} index={index} />
        })}
      </TableBody>
    </Table>
  )
}
