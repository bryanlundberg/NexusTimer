import { PlayerStatus } from '@/enums/PlayerStatus';

export interface PlayerPresence {
  solves: number[];
  status:PlayerStatus;
  joinedAt?: number;
  name?: string;
  image?: string;
  role?: 'admin' | 'player';
  id: string;
  lastSeen?: number;
}
