import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import Peer, { DataConnection } from 'peerjs';
import { useClashManager } from '@/store/ClashManager';

interface LogEntry {
  timestamp: number;
  type: 'system' | 'chatMessage' | 'roundMessage';
  content: any;
}

export default function usePeerRoom() {
  const { data: session } = useSession();
  const peerRef = useRef<Peer | null>(null);
  const myPeerIdRef = useRef<string | null>(null);
  const connectionsRef = useRef<Map<string, DataConnection>>(new Map());
  const addLog = useClashManager(state => state.addLog);

  const peerIdInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handler = () => {
      connectionsRef.current.forEach(c => { try { c.close(); } catch {} });
      try { peerRef.current?.destroy(); } catch {}
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
        type: 'system',
        content: `Peer initialized with ID: ${id}`,
      });
    };

    const onConnection = (conn: DataConnection) => {
      addLog({
        timestamp: Date.now(),
        type: 'system',
        content: `Incoming connection from ${conn.peer}`,
      })
      registerConnection(conn);
    };

    peer.on('open', onOpen);
    peer.on('connection', onConnection);
    peer.on('error', (e) => addLog({
      timestamp: Date.now(),
      type: 'system',
      content: `Peer error: ${String(e)}`,
    }));
    peer.on('close', () => addLog({
      timestamp: Date.now(),
      type: 'system',
      content: 'Peer connection closed',
    }));

    function registerConnection(conn: DataConnection) {
      const pid = conn.peer;

      if (pid === myPeerIdRef.current) {
        addLog({
          timestamp: Date.now(),
          type: 'system',
          content: `Refusing connection to self (${pid})`,
        })
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
        console.log('Connection opened with', pid);
        conn.send({ type: 'hello', from: myPeerIdRef.current });
      });

      conn.on('data', (data) => {
        addLog({
          timestamp: Date.now(),
          type: 'chatMessage',
          content: { from: pid, data },
        });
        // Optional: broadcast(data, pid); // simple flooding
      });

      conn.on('close', () => {
        addLog({
          timestamp: Date.now(),
          type: 'system',
          content: `Connection closed with ${pid}`,
        })
        connectionsRef.current.delete(pid);
      });

      conn.on('error', (err) => {
        addLog({
          timestamp: Date.now(),
          type: 'system',
          content: `Connection error with ${pid}: ${String(err)}`,
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
        connectionsRef.current.forEach(c => { try { c.close(); } catch {} });
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
        type: 'system',
        content: `Connection opened with ${targetId}`,
      })
      conn.send({ type: 'hello', from: myPeerIdRef.current });
    });
    conn.on('data', (data) => addLog({
      timestamp: Date.now(),
      type: 'chatMessage',
      content: { from: targetId, data },
    }));
    conn.on('close', () => {
      addLog({
        timestamp: Date.now(),
        type: 'system',
        content: `Connection closed with ${targetId}`,
      })
      connectionsRef.current.delete(targetId);
    });
    conn.on('error', (err) => addLog({
      timestamp: Date.now(),
      type: 'system',
      content: `Connection error with ${targetId}: ${String(err)}`,
    }));

    connectionsRef.current.set(targetId, conn);
  }

  function broadcast(message: any, exceptPeerId?: string) {
    const payload = {
      event: 'message',
      data: message,
      userId: session?.user?.id || '',
      ts: Date.now(),
    };
    let count = 0;
    connectionsRef.current.forEach((conn, pid) => {
      if (exceptPeerId && pid === exceptPeerId) return;
      if (conn.open) {
        conn.send(payload);
        count++;
      }
    });
    console.log(`Broadcasted message to ${count} peers`, payload);
  }

  function listConnectedPeers(): string[] {
    return Array.from(connectionsRef.current.keys());
  }

  return {
    connectToPeer,
    broadcast,
    connections: connectionsRef.current,
    peerId: myPeerIdRef.current,
    peerIdInputRef,
    listConnectedPeers,
    peerRef: peerRef.current,
  }
}
