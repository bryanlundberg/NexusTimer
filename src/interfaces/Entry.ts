import { ChatMessageContent } from '@/interfaces/ChatMessageContent';
import { SystemContent } from '@/interfaces/SystemContent';
import { RoundMessageContent } from '@/interfaces/RoundMessageContent';

export interface Entry {
  timestamp: number;
  type: 'system' | 'chatMessage' | 'roundMessage';
  content: SystemContent | ChatMessageContent | RoundMessageContent;
}
