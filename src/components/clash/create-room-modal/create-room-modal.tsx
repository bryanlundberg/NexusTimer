import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Globe2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RoomType } from '@/enums/RoomType';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Controller, useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select'
import { FirestoreCollections } from '@/constants/FirestoreCollections';
import { RoomStatus } from '@/enums/RoomStatus';
import moment from 'moment';
import { useFirestoreCache } from '@/hooks/useFirebaseCache';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export function CreateRoomModalContent({ mode }: { mode: RoomType; }) {
  const { addDocument, updateDocument } = useFirestoreCache();
  const { data: session } = useSession();
  const router = useRouter();
  const { handleSubmit, control, formState: { isSubmitting, errors }, register } = useForm({
    defaultValues: {
      name: '',
      event: '3x3',
      password: '',
      maxRoundTime: '30',
      totalRounds: '5',
      type: mode,
      status: RoomStatus.IDLE
    }
  })

  const submitForm = async (data: any) => {
    const now = Date.now();
    const roomDefaults = await addDocument(FirestoreCollections.CLASH_ROOMS, {
      ...data,
      preparationFinalizationTime: moment(now).add(2, 'minutes').valueOf(),
      matchFinalizationTime: moment(now).add(parseInt(data.totalRounds, 10) * parseInt(data.maxRoundTime, 10) + 2, 'minutes').valueOf(),
      createdAt: Date.now(),
      createdBy: session?.user?.id || '',

      authority: {
        leaderId: session?.user?.id || '',
        term: 1
      }
    });

    await updateDocument(`${FirestoreCollections.CLASH_ROOMS}/${roomDefaults.id}`, roomDefaults)
    router.push(`/clash/${roomDefaults.id}`);
  }

  return (
    <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>
          {mode === RoomType.PUBLIC ? (
            <span className="inline-flex items-center gap-2"><Globe2 className="size-4"/> New public room</span>
          ) : (
            <span className="inline-flex items-center gap-2"><Lock className="size-4"/> New private room</span>
          )}
        </DialogTitle>
        <DialogDescription>
          Create a new room for your Clash event. Set the rules, requirements, and more.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-2">
        <div className="grid gap-2">
          <Label htmlFor="room-name" className="text-sm font-medium">Room name</Label>
          <Input
            autoComplete={'off'}
            {...register('name', { required: 'Room name is required' })}
            id="room-name"
            placeholder="e.g. Night of cubing"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="room-event" className="text-sm font-medium">Event</Label>
            <Controller
              name={'event'}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select value={value} onValueChange={onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2x2">2x2</SelectItem>
                    <SelectItem value="3x3">3x3</SelectItem>
                    <SelectItem value="4x4">4x4</SelectItem>
                    <SelectItem value="5x5">5x5</SelectItem>
                    <SelectItem value="6x6">6x6</SelectItem>
                    <SelectItem value="7x7">7x7</SelectItem>
                    <SelectItem value="3x3 OH">3x3 OH</SelectItem>
                    <SelectItem value="Clock">Clock</SelectItem>
                    <SelectItem value="Megaminx">Megaminx</SelectItem>
                    <SelectItem value="Pyraminx">Pyraminx</SelectItem>
                    <SelectItem value="Skewb">Skewb</SelectItem>
                    <SelectItem value="square1">Square-1</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label htmlFor="rounds" className="text-sm font-medium">Rounds</Label>
            <Controller
              name={'totalRounds'}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select value={value} onValueChange={onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">Normal (5)</SelectItem>
                    <SelectItem value="12">Extended (12)</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {mode === RoomType.PRIVATE && (
          <div className="grid gap-2">
            <Label htmlFor="room-pass" className="text-sm font-medium">Password</Label>
            <Input
              id="room-pass"
              autoComplete="off"
              {...register('password', {
                validate: (value) => {
                  if (mode === RoomType.PRIVATE) {
                    if (!value || value.trim().length === 0) return 'Password is required';
                    const len = value.trim().length;
                    if (len < 4) return 'Minimum password length is 4 characters';
                    if (len > 10) return 'Maximum password length is 10 characters';
                  }
                  return true;
                },
              })}
              type="password"
              placeholder="••••••"
              aria-invalid={errors?.password ? 'true' : 'false'}
            />
            {errors?.password && (
              <p className="text-xs text-red-500">{String(errors.password.message)}</p>
            )}
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="insp" className="text-sm font-medium">
            Maximum round time
          </Label>
          <Controller
            name={'maxRoundTime'}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select value={value} onValueChange={onChange}>
                <SelectTrigger className={'w-full'}>
                  <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 sec</SelectItem>
                  <SelectItem value="20">20 sec</SelectItem>
                  <SelectItem value="30">30 sec</SelectItem>
                  <SelectItem value="40">40 sec</SelectItem>
                  <SelectItem value="50">50 sec</SelectItem>
                  <SelectItem value="60">60 sec</SelectItem>
                  <SelectItem value="70">1:10 min</SelectItem>
                  <SelectItem value="80">1:20 min</SelectItem>
                  <SelectItem value="90">1:30 min</SelectItem>
                  <SelectItem value="100">1:40 min</SelectItem>
                  <SelectItem value="110">1:50 min</SelectItem>
                  <SelectItem value="120">2:00 min</SelectItem>
                  <SelectItem value="150">2:30 min</SelectItem>
                  <SelectItem value="180">3:00 min</SelectItem>
                  <SelectItem value="210">3:30 min</SelectItem>
                  <SelectItem value="240">4:00 min</SelectItem>
                  <SelectItem value="270">4:30 min</SelectItem>
                  <SelectItem value="300">5:00 min</SelectItem>
                  <SelectItem value="330">5:30 min</SelectItem>
                  <SelectItem value="360">6:00 min</SelectItem>
                  <SelectItem value="390">6:30 min</SelectItem>
                  <SelectItem value="420">7:00 min</SelectItem>
                  <SelectItem value="450">7:30 min</SelectItem>
                  <SelectItem value="480">8:00 min</SelectItem>
                  <SelectItem value="510">8:30 min</SelectItem>
                  <SelectItem value="540">9:00 min</SelectItem>
                  <SelectItem value="570">9:30 min</SelectItem>
                  <SelectItem value="600">10:00 min</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          <p className="text-xs text-muted-foreground">
            Time limit for scrambling + inspection + solving (per solve)
          </p>
        </div>
      </div>

      <DialogFooter className="mt-2">
        <Button onClick={handleSubmit(submitForm)} disabled={isSubmitting}>Continue</Button>
      </DialogFooter>
    </DialogContent>
  );
}
