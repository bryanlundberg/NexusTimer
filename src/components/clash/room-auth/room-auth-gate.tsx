'use client';
import FadeIn from '@/components/fade-in/fade-in';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { useState } from 'react';
import { Room } from '@/interfaces/Room';
import { useClashAuth } from '@/store/ClashAuth';
import { InputOTP, InputOTPGroup, InputOTPSlot, } from '@/components/ui/input-otp'

interface RoomAuthGateProps {
  roomId: string;
  room: Room;
  onCancel?: () => void;
}

export default function RoomAuthGate({ roomId, room, onCancel }: RoomAuthGateProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const authorize = useClashAuth((s) => s.authorize);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    if (!password) {
      setError('Please enter the room password.');
      return;
    }
    if (room.password === password) {
      authorize(roomId, password);
    } else {
      setError('Incorrect password. Try again.');
    }
  };

  return (
    <FadeIn
      className="flex flex-col grow overflow-auto bg-cover bg-center bg-no-repeat relative z-0"
      style={{ backgroundImage: 'url(\'/utils/abstract-cubes.jpg\')' }}
    >
      <div className="absolute inset-0 z-0 backdrop-blur-sm pointer-events-none"></div>
      <div className="max-w-md w-full mx-auto mt-10 px-4">
        <Card className={'absolute w-fit h-fit my-auto inset-0 mx-auto z-10 bg-background'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lock className="size-4"/> Private Room</CardTitle>
            <CardDescription>This room is private. Enter the password to continue.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <InputOTP maxLength={room.password?.length || 0} onChange={setPassword} value={password}>
                <InputOTPGroup>
                  {(room.password || '').split('').map((_, index) => (
                    <InputOTPSlot key={index} index={index}/>
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {error && (
                <div className="text-sm text-destructive">{error}</div>
              )}
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Enter</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </FadeIn>
  );
}
