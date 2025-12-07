import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import LeaderboardTableRow from '@/features/leaderboards-table/ui/LeaderboardTableRow'
import { SolveServer } from '@/entities/solve/model/types'

interface LeaderboardTableProps {
  solves: SolveServer[]
}

export default function LeaderboardTable({ solves }: LeaderboardTableProps) {
  return (
    <Table containerClassName={'overflow-hidden'}>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">#</TableHead>
          <TableHead className="w-full md:w-auto">User</TableHead>
          <TableHead className="hidden sm:table-cell">Category</TableHead>
          <TableHead className="hidden md:table-cell">Scramble</TableHead>
          <TableHead>Time</TableHead>
          <TableHead className="hidden sm:table-cell">Image</TableHead>
          <TableHead className="hidden sm:table-cell">Date</TableHead>
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
