import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Page() {
  return (
    <div className={'flex flex-col items-center justify-center bg-sidebar-primary/10 rounded-lg p-4'}>
      <Avatar className={'size-10 md:size-12 lg:size-14'}>
        <AvatarImage src="https://github.com/shadcn.png"/>
        <AvatarFallback>RE</AvatarFallback>
      </Avatar>
      <p className={'text-center text-sm mt-1'}>{'Rednaxela'.length > 10 ? 'Rednaxela'.slice(0, 10) + '…' : 'Rednaxela'}</p>
    </div>
  );
}
