import Image from 'next/image';
import { XIcon } from 'lucide-react';
import { useCompareUsersStore } from '@/store/CompareUsers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import RecordsRadar from '@/components/charts/RecordsRadar';

export default function CompareUsersModal() {
  const closeOverlay = useCompareUsersStore(state => state.closeOverlay);
  const users = useCompareUsersStore(state => state.users);

  return (
    <div className={'bg-background w-full h-full flex flex-col p-4 fixed top-0 left-0 z-50'}>
      <header className={'flex items-center justify-between'}>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-white/10 border border-white/15 flex items-center justify-center">
            <Image src={'/logo.png'} alt={'logo'} width={20} height={20} className={'invert-100'}/>
          </div>
          <span className="text-sm font-semibold tracking-wide text-white/90 hidden sm:block">NexusTimer</span>
        </div>
        <h1 className="text-lg font-semibold text-background-foreground">Comparative</h1>
        <XIcon onClick={closeOverlay}/>
      </header>

      <div>Technical Sheet</div>

      <div>Basics</div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]"></TableHead>
            {users.map((user) => {
              return (
                <TableHead key={user._id} className={"w-[100px]"} >
                  <div  className={"flex flex-col items-center gap-2"}>
                    <Avatar className={'size-24'}>
                      <AvatarImage className={'object-cover'} src={user.image}/>
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                  </div>
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>
      </Table>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">3x3</TableHead>
            <TableHead className="w-[100px]"></TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className={"w-[150px]"}>Best</TableCell>
            <TableCell className={"w-[100px] text-center"}>2.5s</TableCell>
            <TableCell className={"w-[100px] text-center"}>3.2s</TableCell>
          </TableRow>

          <TableRow>
            <TableCell className={"w-[150px]"}>Average</TableCell>
            <TableCell className={"w-[100px] text-center"}>2.5s</TableCell>
            <TableCell className={"w-[100px] text-center"}>3.2s</TableCell>
          </TableRow>

          <TableRow>
            <TableCell className={"w-[150px]"}>Total</TableCell>
            <TableCell className={"w-[100px] text-center"}>1235</TableCell>
            <TableCell className={"w-[100px] text-center"}>9512</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className="mt-6">
        <RecordsRadar users={users} />
      </div>
    </div>
  )
}
