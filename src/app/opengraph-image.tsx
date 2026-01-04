import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Roopy Diet - ケトジェニックダイエット管理'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #F4F9F7 0%, #E8F5F0 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 180,
              height: 180,
              borderRadius: 40,
              background: '#5DDFC3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 100,
            }}
          >
            🥗
          </div>
        </div>
        <h1
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #5DDFC3 0%, #4BC9AD 100%)',
            backgroundClip: 'text',
            color: 'transparent',
            margin: 0,
            marginBottom: 20,
          }}
        >
          Roopy Diet
        </h1>
        <p
          style={{
            fontSize: 36,
            color: '#3A405A',
            margin: 0,
            marginBottom: 40,
          }}
        >
          ケトジェニックダイエット管理アプリ
        </p>
        <div
          style={{
            display: 'flex',
            gap: 40,
            fontSize: 24,
            color: '#6B7280',
          }}
        >
          <span>📊 マクロ管理</span>
          <span>⚖️ 体重記録</span>
          <span>🍽️ 食事記録</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
