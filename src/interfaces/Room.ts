import { RoomType } from '@/enums/RoomType';
import { RoomStatus } from '@/enums/RoomStatus';

export interface Room {
  id: string;
  name: string;
  participants: number;
  event: string;
  type: RoomType;
  password?: string;
  maxPreparationTime: number;
  totalRounds: number;
  currentSolve: number;
  createdAt: number;
  status: RoomStatus;
}
