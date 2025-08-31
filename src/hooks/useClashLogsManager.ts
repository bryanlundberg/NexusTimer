import { useSession } from 'next-auth/react';
import { useClashManager } from '@/store/ClashManager';
import { useCallback, useEffect } from 'react';
import { EntryEnum } from '@/enums/Entry';
import { PlayerRole } from '@/enums/PlayerRole';
import _ from 'lodash';
import { useFirestoreCache } from '@/hooks/useFirebaseCache';
import { FirestoreCollections } from '@/constants/FirestoreCollections';
import { deleteField } from '@firebase/firestore';
import { PlayerStatus } from '@/enums/PlayerStatus';
import { DisconnectMessageContent } from '@/interfaces/DisconnectMessageContent';

export const useClashLogsManager = () => {
  const { data: session } = useSession()
  const logs = useClashManager((state) => state.logs);
  const room = useClashManager((state) => state.room);
  const { updateDocument } = useFirestoreCache()

  const handleDisconnectUserPeerEvent = useCallback(async () => {
    if (logs.length && logs[logs.length - 1].type === EntryEnum.DISCONNECT) {
      const lastLog = logs[logs.length - 1];
      const content = lastLog.content as DisconnectMessageContent;

      if (room?.authority.leaderId === content.peerId) {
        const presentPlayers = Object.values(room?.presence || {})
          .filter(player => player.role === PlayerRole.PLAYER && player.id !== content.peerId);
        const newLeaderId = _.orderBy(presentPlayers, ['joinedAt'], ['asc'])[0]?.id || null;

        if (newLeaderId && newLeaderId === session?.user?.id) {
          await updateDocument(
            `${FirestoreCollections.CLASH_ROOMS}/${room?.id}`,
            {
              'authority.leaderId': newLeaderId,
              'authority.term': (room?.authority.term || 0) + 1,
              [`presence.${content.peerId}`]: deleteField(),
            }
          );
        } else if (!newLeaderId && session?.user?.id === room?.createdBy) {
          await updateDocument(
            `${FirestoreCollections.CLASH_ROOMS}/${room?.id}`,
            {
              'authority.leaderId': null,
              'authority.term': (room?.authority.term || 0) + 1,
              [`presence.${content.peerId}`]: deleteField(),
            }
          );
        }
      }

      if (room?.authority.leaderId !== content.peerId && session?.user?.id === room?.authority.leaderId) {
        await updateDocument(
          `${FirestoreCollections.CLASH_ROOMS}/${room?.id}`,
          { [`presence.${content.peerId}`]: deleteField() }
        )
      }
    }
  }, [logs, room, session, updateDocument]);

  const handleJoinEvent = useCallback(async () => {
    if (!logs.length) return;
    const lastLog = logs[logs.length - 1];
    if (lastLog.type !== EntryEnum.JOIN) return;

    // Only leader processes JOIN
    if (session?.user?.id !== room?.authority.leaderId) return;
    if (!room?.id) return;

    const content: any = lastLog.content as any;
    const joinUserId = content.userId || content.peerId;
    if (!joinUserId) return;

    const alreadyPresent = !!room.presence?.[joinUserId];
    if (alreadyPresent) return;

    const now = Date.now();
    await updateDocument(
      `${FirestoreCollections.CLASH_ROOMS}/${room.id}`,
      {
        [`presence.${joinUserId}`]: {
          id: joinUserId,
          joinedAt: now,
          name: content.name || 'Unknown',
          image: content.image || null,
          role: PlayerRole.PLAYER,
          status: PlayerStatus.PREPARING,
        }
      }
    );
  }, [logs, room, session, updateDocument]);

  useEffect(() => {
    (async () => {
      await handleDisconnectUserPeerEvent();
      await handleJoinEvent();
    })()
  }, [handleDisconnectUserPeerEvent, handleJoinEvent, logs]);
}
