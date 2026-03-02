import { ImageResponse } from 'next/og';

export const alt = 'IranNews - Iran News Aggregator';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          position: 'relative',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            left: -100,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(234,179,8,0.08) 0%, transparent 70%)',
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            display: 'flex',
          }}
        >
          <div style={{ flex: 1, background: '#ef4444' }} />
          <div style={{ flex: 1, background: '#eab308' }} />
          <div style={{ flex: 1, background: '#3b82f6' }} />
        </div>

        {/* News icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            borderRadius: 20,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
            border: '1px solid rgba(255,255,255,0.1)',
            marginBottom: 24,
          }}
        >
          <svg
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" />
          </svg>
        </div>

        {/* Logo text */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontWeight: 900,
              letterSpacing: '-2px',
              color: '#ef4444',
            }}
          >
            Iran
          </span>
          <span
            style={{
              fontSize: 72,
              fontWeight: 900,
              letterSpacing: '-2px',
              color: '#eab308',
            }}
          >
            Ne
          </span>
          <span
            style={{
              fontSize: 72,
              fontWeight: 900,
              letterSpacing: '-2px',
              color: '#3b82f6',
            }}
          >
            ws
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 24,
            color: 'rgba(255,255,255,0.6)',
            marginBottom: 40,
            letterSpacing: '0.5px',
          }}
        >
          Iran News Aggregator
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 20px',
              borderRadius: 20,
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.3)',
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#ef4444',
              }}
            />
            <span style={{ color: '#fca5a5', fontSize: 16 }}>Pro-Regime</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 20px',
              borderRadius: 20,
              background: 'rgba(59,130,246,0.15)',
              border: '1px solid rgba(59,130,246,0.3)',
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#3b82f6',
              }}
            />
            <span style={{ color: '#93c5fd', fontSize: 16 }}>Opposition</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 20px',
              borderRadius: 20,
              background: 'rgba(234,179,8,0.15)',
              border: '1px solid rgba(234,179,8,0.3)',
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#eab308',
              }}
            />
            <span style={{ color: '#fde047', fontSize: 16 }}>Neutral</span>
          </div>
        </div>

        {/* Bottom text */}
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            fontSize: 16,
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '2px',
          }}
        >
          www.iranews.co
        </div>
      </div>
    ),
    { ...size }
  );
}
