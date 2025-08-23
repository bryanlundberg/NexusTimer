import { ChatMessageContent } from '@/interfaces/ChatMessageContent';
import { SystemContent } from '@/interfaces/SystemContent';
import { RoundMessageContent } from '@/interfaces/RoundMessageContent';
import { EntryEnum } from '@/enums/Entry';
import { DisconnectMessageContent } from '@/interfaces/DisconnectMessageContent';

export interface Entry {
  timestamp: number;
  type: EntryEnum;
  content: SystemContent | ChatMessageContent | RoundMessageContent | DisconnectMessageContent;
}
