import { ImageResponse } from 'next/og'
import { getTranslations } from 'next-intl/server'

export const runtime = 'edge'

export const alt = 'Nexus Timer - Multiplayer Room'
export const size = {
  width: 1200,
  height: 630
}

export const contentType = 'image/png'

export default async function Image({ params }: { params: { roomId: string } }) {
  const roomId = params.roomId
  const t = await getTranslations('Multiplayer.OpenGraph')

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #000000, #1a1a1a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          padding: '40px'
        }}
      >
        {/* Background Decorative Elements */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(59, 130, 246, 0.15)',
            filter: 'blur(60px)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            left: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(59, 130, 246, 0.15)',
            filter: 'blur(60px)'
          }}
        />

        {/* Logo/Brand Area */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '40px'
          }}
        >
          <span
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: 'white',
              letterSpacing: '-0.02em'
            }}
          >
            Nexus Timer
          </span>
        </div>

        {/* Content Area */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '60px 80px',
            borderRadius: '32px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
          }}
        >
          <span
            style={{
              fontSize: '24px',
              color: '#94a3b8',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}
          >
            {t('invited-to-room')}
          </span>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <span
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                color: 'white'
              }}
            >
              {roomId}
            </span>
          </div>

          <div
            style={{
              marginTop: '32px',
              background: '#3b82f6',
              padding: '12px 32px',
              borderRadius: '9999px',
              color: 'white',
              fontSize: '24px',
              fontWeight: '600'
            }}
          >
            {t('join-now')}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            fontSize: '20px',
            color: '#64748b'
          }}
        >
          nexustimer.com
        </div>
      </div>
    ),
    {
      ...size
    }
  )
}
