import { PlayerStatus } from '@/enums/PlayerStatus';

export interface PlayerPresence {
  solves: number[];
  status:PlayerStatus;
  joinedAt?: number;
  name?: string;
  image?: string;
  role?: 'owner' | 'admin' | 'player';
  id: string;
}
