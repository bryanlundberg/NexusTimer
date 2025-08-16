import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Globe2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RoomType } from '@/enums/RoomType';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Controller, useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select'
import { useFirestoreCache } from '@/hooks/useFirebaseCache';
import { FirestoreCollections } from '@/constants/FirestoreCollections';
import { RoomStatus } from '@/enums/RoomStatus';

export function CreateRoomModalContent({ mode, onClose }: { mode: RoomType; onClose: () => void }) {
  const { addDocument } = useFirestoreCache();
  const { handleSubmit, control, formState: { isSubmitting }, reset, register } = useForm({
    defaultValues: {
      name: '',
      event: '3x3',
      password: '',
      maxPreparationTime: '30',
      totalRounds: '5',
      type: mode,
      status: RoomStatus.IDLE
    }
  })

  const submitForm = async (data: any) => {
    await addDocument(FirestoreCollections.CLASH_ROOMS, { ...data, createdAt: Date.now() });
    reset();
    onClose();
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

      <div className="space-y-4 overflow-auto max-h-[60vh]">
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
                    <SelectItem value="3x3 BLD">3x3 BLD</SelectItem>
                    <SelectItem value="3x3 FMC">3x3 FMC</SelectItem>
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
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {mode === RoomType.PRIVATE && (
          <div className="grid gap-2">
            <Label htmlFor="room-pass" className="text-sm font-medium">Contraseña</Label>
            <Input
              {...register('password')}
              type="password"
              placeholder="••••••"
            />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="insp" className="text-sm font-medium">
              Time limit for scrambling + inspection (per solve)
            </Label>
            <Controller
              name={'maxPreparationTime'}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select value={value} onValueChange={onChange}>
                  <SelectTrigger className={'w-full'}>
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="40">40</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="60">60</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      </div>

      <DialogFooter className="mt-2">
        <Button onClick={handleSubmit(submitForm)} disabled={isSubmitting}>Listo (solo UI)</Button>
      </DialogFooter>
    </DialogContent>
  );
}
