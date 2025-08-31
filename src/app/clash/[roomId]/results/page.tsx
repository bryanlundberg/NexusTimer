import MatchFinished from '@/components/clash/match-finished/match-finished';
import Image from 'next/image';

export default function Page() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <Image
        src="/utils/bg-results.png"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          margin: 'auto',
          width: '100%',
          height: '100%',
          opacity: 0.05,
          pointerEvents: 'none',
          objectFit: 'cover',
        }}
        width={1920}
        height={1080}
      />
      <div style={{ position: 'relative' }}>
        <MatchFinished />
      </div>
    </div>
  );
}
