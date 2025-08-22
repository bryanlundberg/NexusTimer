'use client';
import { Button } from '@/components/ui/button';
import { useClashManager } from '@/store/ClashManager';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { SendIcon } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { EntryEnum } from '@/enums/Entry';
import { ChatMessageContent } from '@/interfaces/ChatMessageContent';
import { Entry } from '@/interfaces/Entry';

export default function Chat({ broadcast }) {
  const logs = useClashManager(state => state.logs);
  const addLog = useClashManager(state => state.addLog);

  const displayMessages = useMemo(() => {
    const r = logs.filter((msg) => msg.type === EntryEnum.CHAT_MESSAGE)
    return _.orderBy(r, ['timestamp'], ['asc']);
  }, [logs]);

  const { data: session } = useSession()
  const { handleSubmit, register, getValues, setValue } = useForm({
    defaultValues: {
      content: ''
    }
  })

  const send = async () => {
    try {
      const content = (getValues('content') || '').trim();
      if (!content) return;
      const newMessage: Entry = {
        type: EntryEnum.CHAT_MESSAGE,
        timestamp: Date.now(),
        content: {
          senderId: (session?.user as any)?.id || 'unknown',
          senderImage: (session?.user as any)?.image || undefined,
          senderName: session?.user?.name || 'Unknown User',
          message: content
        } satisfies ChatMessageContent,
      };

      broadcast(newMessage)
      addLog(newMessage);
      setValue('content', '');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [displayMessages.length]);

  const myUserId = (session?.user)?.id || 'unknown';

  return (
    <form onSubmit={handleSubmit(send)} className="flex flex-col h-full w-full">
      <div className="p-2 border-b border-border text-xs text-muted-foreground chat-drag-handle cursor-move select-none">Chat</div>
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-2 space-y-1 text-sm scroll-smooth">
        {displayMessages.map((m, i) => {
          const content = m.content as ChatMessageContent;
          const currentUserId = content.senderId
          const prevUserId = i > 0 ? ((displayMessages[i - 1])?.content as ChatMessageContent)?.senderId : undefined;
          const startsNewGroup = currentUserId !== prevUserId;
          const continuesGroup = !startsNewGroup;
          const isMine = currentUserId === myUserId;

          // Spacing: bigger gap before a new user group, tighter within the same group
          const topMargin = startsNewGroup ? 'mt-2' : 'mt-0.5';

          // Bubble rounding to stack grouped messages a bit tighter
          const roundedClass = isMine
            ? continuesGroup ? 'rounded-l-md rounded-tr-md rounded-br-md' : 'rounded-md'
            : continuesGroup ? 'rounded-r-md rounded-tl-md rounded-bl-md' : 'rounded-md';

          return (
            <div key={i} className={`flex ${topMargin} ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                {!isMine && startsNewGroup && (
                  <div className="text-[10px] text-muted-foreground/80 mb-0.5">
                    {content.senderName || 'Unknown'}
                  </div>
                )}
                <div
                  className={`${roundedClass} p-2 w-full border ${isMine ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border'}`}
                >
                  <div>{content.message}</div>
                  <div className={`mt-1 text-[10px] ${isMine ? 'text-primary-foreground/70' : 'text-muted-foreground/70'} ${isMine ? 'text-right' : 'text-left'}`}>
                    {(() => {
                      const ca: any = (m)?.timestamp;
                      const ms = typeof ca === 'number' ? ca : (ca?.toMillis?.() ?? (typeof ca?.seconds === 'number' ? ca.seconds * 1000 : undefined));
                      return ms ? moment(ms).format('HH:mm') : '';
                    })()}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef}/>
      </div>
      <div className="p-2 border-t border-border flex items-center gap-2">
        <Input
          placeholder="Write a message..."
          autoComplete={'off'}
          className="select-text"
          draggable={false}
          {...register('content', { required: true })}
        />
        <Button size="sm" type={'submit'}><SendIcon/></Button>
      </div>
    </form>
  );
}
