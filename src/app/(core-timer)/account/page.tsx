'use client';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import AccountHeader from '@/components/account/account-header/account-header';
import Link from 'next/link';
import AccountNotAuth from '@/components/account/account-not-auth/account-not-auth';
import AccountLastBackup from '@/components/account/account-last-backup/account-last-backup';
import { useTranslations } from 'next-intl';
import uploadFile from '@/utils/uploadFile';
import { toast } from 'sonner';
import loader from '@/utils/loader';

export default function Page() {
  const { data: session, update } = useSession();
  const t = useTranslations('Index');

  const handleUpdateAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      loader.start();
      const urlImage = await uploadFile(file, `/avatars`, session?.user?.id);

      const response = await fetch(`/api/v1/users/${session?.user?.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          image: urlImage.url,
        }),
      });

      if (!response.ok) {
        toast.error('Error updating user image');
        return;
      }

      const updatedUser = await response.json();
      toast.success('User image updated successfully');

      await update({
        user: {
          image: updatedUser.image,
        }
      });

    } finally {
      loader.stop();
    }
  }

  if (!session) return <AccountNotAuth/>;

  return (
    <>
      <AccountHeader back="/app" label={t('SettingsPage.account')}/>
      <div className="flex flex-col gap-3 justify-center items-center">
        <Avatar className="size-20 relative group/item">
          <AvatarImage className={'object-cover'} src={session.user?.image as string}/>
          <AvatarFallback>
            {session.user?.name?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
          <input
            type={'file'}
            accept="image/*"
            className={'absolute z-10 inset-0 w-full h-full bg-neutral-900 hidden group-hover/item:flex justify-center items-center cursor-pointer hover:opacity-50 text-xs'}
            onChange={handleUpdateAvatar}
          />
        </Avatar>

        <div className="font-mono">{session.user?.email}</div>

        <Link href={`/people/${session.user?.id}`} className="w-full">
          <Button className="w-full">
            Open Profile
          </Button>
        </Link>

        <Link href={'/account/save'} className="w-full">
          <Button className="w-full" variant={'secondary'}>
            Save
          </Button>
        </Link>

        <Link href={'/account/load'} className="w-full">
          <Button className="w-full" variant={'secondary'}>
            Load
          </Button>
        </Link>

        <AccountLastBackup session={session}/>
      </div>
    </>
  );
}
