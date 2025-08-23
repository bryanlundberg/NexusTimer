import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import Peer, { DataConnection } from 'peerjs';
import { useClashManager } from '@/store/ClashManager';
import { Entry } from '@/interfaces/Entry';
import { EntryEnum } from '@/enums/Entry';
import { ChatMessageContent } from '@/interfaces/ChatMessageContent';
import { PlayerRole } from '@/enums/PlayerRole';
import { DisconnectMessageContent } from '@/interfaces/DisconnectMessageContent';

export default function usePeerRoom() {
  const { data: session } = useSession();
  const peerRef = useRef<Peer | null>(null);
  const myPeerIdRef = useRef<string | null>(null);
  const connectionsRef = useRef<Map<string, DataConnection>>(new Map());
  const addLog = useClashManager(state => state.addLog);

  useEffect(() => {
    const handler = () => {
      connectionsRef.current.forEach(c => {
        try {
          c.close();
        } catch {
        }
      });
      try {
        peerRef.current?.destroy();
      } catch {
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;

    const peer = new Peer(session.user.id);
    peerRef.current = peer;

    const onOpen = (id: string) => {
      myPeerIdRef.current = id;
      addLog({
        timestamp: Date.now(),
        type: EntryEnum.SYSTEM,
        content: { message: `Peer initialized with ID: ${id}` },
      });
    };

    const onConnection = (conn: DataConnection) => {
      addLog({
        timestamp: Date.now(),
        type: EntryEnum.SYSTEM,
        content: { message: `Incoming connection from ${conn.peer}` },
      })
      registerConnection(conn);
    };

    peer.on('open', onOpen);
    peer.on('connection', onConnection);
    peer.on('error', (e) => addLog({
      timestamp: Date.now(),
      type: EntryEnum.SYSTEM,
      content: { message: `Peer error: ${String(e)}` },
    }));
    peer.on('close', () => addLog({
      timestamp: Date.now(),
      type: EntryEnum.SYSTEM,
      content: { message: 'Peer connection closed', }
    }));

    function registerConnection(conn: DataConnection) {
      const pid = conn.peer;

      if (pid === myPeerIdRef.current) {
        console.log('Ignoring connection to self');
        conn.close();
        return;
      }

      const existing = connectionsRef.current.get(pid);
      if (existing && existing.open) {
        console.log('Already connected to', pid);
        conn.close();
        return;
      }

      connectionsRef.current.set(pid, conn);

      conn.on('open', () => {
        addLog({
          timestamp: Date.now(),
          type: EntryEnum.CHAT_MESSAGE,
          content: {
            message: `Connection established with ${pid}`,
            senderName: 'System',
            senderId: 'system',
            senderImage: '',
            role: PlayerRole.SYSTEM,
          } satisfies ChatMessageContent,
        });
      });

      conn.on('data', (data) => {
        addLog(data as Entry);
        // Optional: broadcast(data, pid); // simple flooding
      });

      conn.on('close', () => {
        addLog({
          timestamp: Date.now(),
          type: EntryEnum.CHAT_MESSAGE,
          content: {
            message: `Connection closed with ${pid}`,
            senderName: 'System',
            senderId: 'system',
            senderImage: '',
            role: PlayerRole.SYSTEM,
          } satisfies ChatMessageContent,
        })

        addLog({
          timestamp: Date.now(),
          type: EntryEnum.DISCONNECT,
          content: { peerId: pid } satisfies DisconnectMessageContent,
        })

        connectionsRef.current.delete(pid);
      });

      conn.on('error', (err) => {
        console.log(`Connection error with ${pid}:`, err);
        addLog({
          timestamp: Date.now(),
          type: EntryEnum.SYSTEM,
          content: { message: `Connection error with ${pid}: ${String(err)}` },
        })
      });
    }

    return () => {
      try {
        peer.off('open', onOpen);
        peer.off('connection', onConnection);
        peer.disconnect();
        peer.destroy();
      } finally {
        peerRef.current = null;
        myPeerIdRef.current = null;
        connectionsRef.current.forEach(c => {
          try {
            c.close();
          } catch {
          }
        });
        connectionsRef.current.clear();
      }
    };
  }, [session]);

  function connectToPeer(targetId: string) {
    const peer = peerRef.current;
    if (!peer) return console.warn('Peer not initialized');
    if (targetId === myPeerIdRef.current) return console.warn('Cannot connect to self');
    if (connectionsRef.current.has(targetId)) return console.log('Already connected to', targetId);

    const conn = peer.connect(targetId, { reliable: true });

    conn.on('open', () => {
      addLog({
        timestamp: Date.now(),
        type: EntryEnum.CHAT_MESSAGE,
        content: {
          message: `Connection established with ${targetId}`,
          senderName: 'System',
          senderId: 'system',
          senderImage: '',
          role: PlayerRole.SYSTEM,
        } satisfies ChatMessageContent,
      })
      conn.send({ type: 'hello', from: myPeerIdRef.current });
      // Emit JOIN event so the leader can add us to presence
      if (session?.user?.id) {
        const joinEntry: Entry = {
          timestamp: Date.now(),
          type: EntryEnum.JOIN,
          content: {
            peerId: session.user.id,
            userId: session.user.id,
            name: session.user.name || undefined,
            image: session.user.image || undefined,
          },
        };
        conn.send(joinEntry);
      }
    });
    conn.on('data', (data) => addLog(data as Entry));
    conn.on('close', () => {
      addLog({
        timestamp: Date.now(),
        type: EntryEnum.CHAT_MESSAGE,
        content: {
          message: `Connection closed with ${targetId}`,
          senderName: 'System',
          senderId: 'system',
          senderImage: '',
          role: PlayerRole.SYSTEM,
        } satisfies ChatMessageContent,
      })

      addLog({
        timestamp: Date.now(),
        type: EntryEnum.DISCONNECT,
        content: { peerId: targetId } satisfies DisconnectMessageContent,
      })
      connectionsRef.current.delete(targetId);
    });
    conn.on('error', (err) => addLog({
      timestamp: Date.now(),
      type: EntryEnum.SYSTEM,
      content: { message: `Connection error with ${targetId}: ${String(err)}` },
    }));

    connectionsRef.current.set(targetId, conn);
  }

  function broadcast(message: any, exceptPeerId?: string) {
    let count = 0;
    connectionsRef.current.forEach((conn, pid) => {
      if (exceptPeerId && pid === exceptPeerId) return;
      if (conn.open) {
        conn.send(message);
        count++;
      }
    });
    console.log(`Broadcasted message to ${count} peers`, message);
  }

  function listConnectedPeers(): string[] {
    return Array.from(connectionsRef.current.keys());
  }

  return {
    connectToPeer,
    broadcast,
    connections: connectionsRef.current,
    peerId: myPeerIdRef.current,
    listConnectedPeers,
    peerRef: peerRef.current,
  }
}
