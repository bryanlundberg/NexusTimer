import { PlayerStatus } from '@/enums/PlayerStatus';
import { PlayerRole } from '@/enums/PlayerRole';

export interface PlayerPresence {
  solves: number[];
  status:PlayerStatus;
  joinedAt?: number;
  name?: string;
  image?: string;
  role?: PlayerRole;
  id: string;
  lastSeen?: number;
}
