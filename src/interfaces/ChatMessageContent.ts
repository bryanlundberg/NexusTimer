import { PlayerRole } from '@/enums/PlayerRole';

export interface ChatMessageContent {
  senderId: string;
  senderName: string;
  senderImage: string;
  message: string;
  role: PlayerRole;
}
