'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import Peer, { DataConnection } from 'peerjs';

export default function Page() {
  const { data: session } = useSession();
  const peerRef = useRef<Peer | null>(null);
  const myPeerIdRef = useRef<string | null>(null);
  const connectionsRef = useRef<Map<string, DataConnection>>(new Map());

  const peerIdInputRef = useRef<HTMLInputElement | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const appendLog = (line: string) => setLog(prev => [...prev, line]);

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
      appendLog(`Peer opened: ${id}`);
    };

    const onConnection = (conn: DataConnection) => {
      appendLog(`Incoming connection from ${conn.peer}`);
      registerConnection(conn);
    };

    peer.on('open', onOpen);
    peer.on('connection', onConnection);
    peer.on('error', (e) => appendLog(`Peer error: ${String(e)}`));
    peer.on('close', () => appendLog('Peer closed'));

    function registerConnection(conn: DataConnection) {
      const pid = conn.peer;

      if (pid === myPeerIdRef.current) {
        appendLog(`Ignoring self-connection from ${pid}`);
        conn.close();
        return;
      }

      const existing = connectionsRef.current.get(pid);
      if (existing && existing.open) {
        appendLog(`Duplicate with ${pid}, closing the new one`);
        conn.close();
        return;
      }

      connectionsRef.current.set(pid, conn);

      conn.on('open', () => {
        appendLog(`Connection opened with ${pid}`);
        conn.send({ type: 'hello', from: myPeerIdRef.current });
      });

      conn.on('data', (data) => {
        appendLog(`Msg from ${pid}: ${JSON.stringify(data)}`);
        // Optional: broadcast(data, pid); // simple flooding
      });

      conn.on('close', () => {
        appendLog(`Connection closed with ${pid}`);
        connectionsRef.current.delete(pid);
      });

      conn.on('error', (err) => {
        appendLog(`Connection error with ${pid}: ${String(err)}`);
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
    if (!peer) return appendLog('Peer not initialized');
    if (targetId === myPeerIdRef.current) return appendLog('Do not connect to yourself');
    if (connectionsRef.current.has(targetId)) return appendLog(`Already connected to ${targetId}`);

    const conn = peer.connect(targetId, { reliable: true });
    appendLog(`Connecting to ${targetId}...`);

    conn.on('open', () => {
      appendLog(`Connection opened with ${targetId}`);
      conn.send({ type: 'hello', from: myPeerIdRef.current });
    });
    conn.on('data', (data) => appendLog(`Msg from ${targetId}: ${JSON.stringify(data)}`));
    conn.on('close', () => {
      appendLog(`Connection closed with ${targetId}`);
      connectionsRef.current.delete(targetId);
    });
    conn.on('error', (err) => appendLog(`Connection error with ${targetId}: ${String(err)}`));

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
    appendLog(`Broadcast to ${count} peers`);
  }

  function listConnectedPeers(): string[] {
    return Array.from(connectionsRef.current.keys());
  }

  return (
    <div className={"select-text"}>
      <h1>Test Page</h1>
      <p>Your PeerID: {myPeerIdRef.current || '(creating...)'}</p>

      <form onSubmit={(e) => {
        e.preventDefault();
        const id = peerIdInputRef.current?.value?.trim();
        if (id) connectToPeer(id);
      }}>
        <input type="text" placeholder="Peer ID" ref={peerIdInputRef} />
        <button type="submit">Connect</button>
      </form>

      <form onSubmit={(e) => {
        e.preventDefault();
        const input = (e.target as HTMLFormElement).elements[0] as HTMLInputElement;
        const msg = input.value.trim();
        if (msg) { broadcast(msg); input.value = ''; }
      }}>
        <input type="text" placeholder="Message" />
        <button>Send</button>
      </form>

      <button type="button" onClick={() => {
        console.log('Connected peers:', listConnectedPeers());
        appendLog('Peers: ' + JSON.stringify(listConnectedPeers()));
      }}>
        View connected peers
      </button>

      <div style={{ marginTop: 16, padding: 8, border: '1px solid #999', maxHeight: 250, overflow: 'auto' }}>
        <strong>Log</strong>
        <ul>
          {log.map((l, i) => <li key={i} style={{ fontFamily: 'monospace' }}>{l}</li>)}
        </ul>
      </div>
    </div>
  );
}
