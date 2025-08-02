'use client';

import * as React from 'react';
import { useMemo } from 'react';
import Navigation from '@/components/navigation/navigation';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useUsers } from '@/hooks/api/useUsers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import moment from 'moment';
import FadeIn from '@/components/fade-in/fade-in';
import { UserDocument } from '@/models/user';
import { useRouter } from 'next/navigation';
import ButtonNavbar from '@/components/navigation/buttons/button-navbar';
import { Input } from '@/components/ui/input';
import { Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TimeZones } from '@/enums/Timezones';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

export default function Page() {
  const { data, isLoading } = useUsers();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredUsers = React.useMemo(() => {
    if (!data?.events?.length) return [];
    return data.events.filter((user: UserDocument) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const regionOptions = useMemo(() => Object.values(TimeZones), []);

  return (
    <FadeIn className="flex flex-col grow overflow-auto">
      <div className="max-w-7xl mx-auto px-2 pt-2 flex flex-col w-full min-h-full">
        <Navigation showMenu={false}>
          <div className={'flex flex-col sm:flex-row items-center justify-between gap-2'}>
            <ButtonNavbar/>
            <div className={'flex items-center gap-3 w-full justify-end'}>
              <Input
                placeholder={'Search by name'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:max-w-sm"
              />
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Region"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {regionOptions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size={'icon'}><MagnifyingGlassIcon/></Button>
            </div>
          </div>
        </Navigation>
        <div className={'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-2 overflow-auto pb-10'}>
          {isLoading && Array(10).fill(0).map((_, index) => (
            <Card key={index} className="overflow-hidden min-h-96">
              <CardHeader className="pb-2 flex flex-col items-center">
                <Skeleton className="size-24 rounded-full mb-2"/>
                <Skeleton className="h-6 w-32 mb-1"/>
                <Skeleton className="h-4 w-40"/>
              </CardHeader>
              <CardContent className="pb-2 pt-0 flex flex-col items-center">
                <Skeleton className="h-4 w-36 mb-2"/>
                <Skeleton className="h-5 w-16"/>
              </CardContent>
              <CardFooter className="pt-2 flex justify-center">
                <Skeleton className="h-8 w-24"/>
              </CardFooter>
            </Card>
          ))}

          {!isLoading && filteredUsers.length === 0 && searchTerm !== '' && (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No users found matching &ldquo;{searchTerm}&rdquo;</p>
            </div>
          )}

          {!isLoading && filteredUsers.length > 0 && filteredUsers.map((user: UserDocument) => (
            <Card
              key={user._id}
              className="transition-all duration-200 animate-fadeIn h-auto"
            >
              <CardHeader className="pb-2 flex flex-col items-center">
                <Avatar className="size-24 mb-2 ring-2 ring-primary/30">
                  <AvatarImage className={'object-cover'} src={user.image} alt={user.name}/>
                  <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold text-center">{user.name}</h2>
              </CardHeader>
              <CardContent className="pb-2 pt-0 flex flex-col items-center">
                <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
                  <Calendar className="size-3.5"/>
                  <span>Joined {moment(user.createdAt).format('MMM Do YYYY')}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-xs"
                  onClick={() => router.push(`/people/${user._id}`)}
                >
                  View Profile <ExternalLink className="size-3.5"/>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </FadeIn>
  );
}


